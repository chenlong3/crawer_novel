/**
 * Created by cl on 2017/6/12.
 */
import request from 'request'
import cheerio from 'cheerio'
import iconv from 'iconv-lite'
import novel from './mongo/db_novel'
import config from '../config'
import fs from 'fs'

function http(url){
    return new Promise(function(resolve,reject){
        request.get({url:url,encoding:null},function(err, res, body){
            if(err){
                return reject(err)
            }
            return resolve(body)

        })
    });
}

function fn(res) {
    let urls = [];
    let _res = iconv.decode(res, 'gb2312');
    let $ = cheerio.load(_res);
    let el = $(config.node);
    el.each(function (index, ele) {
        let obj = {};
        obj.index = index - 4;
        obj.herf = $(this).attr('href');
        obj.title = $(this).text().replace(/\//,'-');
        urls.push(obj);
    });
    urls.splice(0, 4);
    return urls
}

function save(res,urls){
    let data = {
        name: config.name
    };
    data.items = urls;
    data.UdIndex = urls.length;
    if(res){
        novel.updata(res._id,data);
        urls = urls.splice(res.UdIndex);
    }else{
        novel.add(data);
    }
    return urls
}

async function req(num) {
    let data = await http(config.url);                  //请求章节目录的网页
    let urls = await fn(data);                          //处理章节目录网页，提取章节名称等
    let resDb = await novel.query({name:config.name}); //查询数据库是否有同名小说
    let result = await save(resDb,urls);                //存在同名小说更新，没有则新增
    let start = 0;
    let end = start + num;
    if(result.length){
        result.length - 1 < end ? end = result.length - 1 : end;
        for (let i = 0, len = Math.ceil(result.length / num); i < len; i++) {
            let arr = result.slice(start, end);
            let prmire = arr.map(function (item) {
                let url = config.url + item.herf;
                return http(url);
            });

            await Promise.all(prmire).then(function (ress) {
                ress.forEach((item, index) => {
                    let title = arr[index].title;
                    let _content = iconv.decode(item, 'gb2312');
                    let _result = _content.match(new RegExp(config.chilNode))[0];
                    let _arrStr = _result.replace(/(\s|<br \/>|&nbsp|<br>|<\/div>\W+<!)/g, '').split(';;;;');
                    let _str = arr[index].title + '\r';
                    _arrStr.forEach(function (item) {
                        _str += item + '\r'
                    });
                    fs.writeFile('./text/' + title + '.txt', _str, (err) => {
                        if(err)console.log(err, arr[index]) ;
                        console.log(title+'生成完成');
                    })
                });
                start = end + 1;
                end = start + num;
                result.length - 1 < end ? end = result.length - 1 : end
            })
        }
    }else{
        console.log('不需要更新')
    }
}

export default req