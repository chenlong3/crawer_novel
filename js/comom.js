/**
 * Created by cl on 2017/6/12.
 */
import request from 'request'
import cheerio from 'cheerio'
import iconv from 'iconv-lite'
import novel from './mongo/db_novel'
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



async function generate(num,config) {
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
            fs.mkdir('./text/'+data.name,function(err){
                if(err)throw err;
            });
            fs.mkdir('./text/'+data.name + '/' + data.name,function(err){
                if(err)throw err;
            });
            novel.add(data);
        }
        return urls
    }

    function io(result,name) {
        result.forEach(function(item,index){
            let data = fs.readFileSync('./text/' + name + '/' + name + '/' + item.title + '.html', 'utf8');
            if(index === 0){
                data = '<!DOCTYPE html><html lang="zh"><head><meta charset="utf-8"><title>'+name+'</title></head><body>'+data
            }
            if(index = result.length-1){
                data = data + '</body></html>'
            }
            console.log('开始写入' + item.title);
            fs.appendFileSync('./text/' + name + '/' + name + '.html',data);
        })
    }

    let name = config.name;
    let data = await http(config.url);                  //请求章节目录的网页
    let urls = await fn(data);                          //处理章节目录网页，提取章节名称等
    let resDb = await novel.query({name:name});        //查询数据库是否有同名小说
    let result = await save(resDb,urls);                //存在同名小说更新，没有则新增
    let start = 0;
    let end = start + num;
    let count = 0;
    if(result.length){
        result.length < end ? end = result.length : end;
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
                    let _str = '<h3>' + arr[index].title + '</h3>';
                    _arrStr.forEach(function (item) {
                        _str += '<p>'+item + '</p>'
                    });
                    fs.writeFile('./text/' + name + '/' + name + '/' + title + '.html', _str, (err) => {
                        if(err)console.log(err, arr[index]) ;
                        console.log(title+'生成完成',count,result.length);
                        count++;
                        if(count >= result.length){
                            io(result,name)
                        }
                    })
                });
                start = end;
                end = start + num;
                result.length < end ? end = result.length : end
            })
        }
    }else{
        console.log('不需要更新')
    }
}

export default generate