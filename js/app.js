/**
 * Created by cl on 2017/6/12.
 */
import cheerio from 'cheerio'
import iconv from 'iconv-lite'
import http from './comom'
import config from '../config'
import fs from 'fs'
let urls = [];

async function req(num){
    let start = 0;
    let end = start + num;
    await http(config.url).then((res)=>{
        let _res = iconv.decode(res, 'gb2312');
        let $ = cheerio.load(_res);
        let el = $(config.node);
        el.each(function(index,ele){
            let obj = {};
            obj.index = index;
            obj.herf = $(this).attr('href');
            obj.title = $(this).text();
            urls.push(obj);
        });
        urls.splice(0,4);
    });
    for(let i=0,len=Math.ceil(urls.length/num);i<len;i++){
        let arr = urls.slice(start,end);
        console.log(urls);
        let prmire = arr.map(function(item){
            let url = config.url+item.href;
            let _item = http(url);
            console.log(url);

            return _item
        });
        console.log(1);

        await Promise.all(prmire).then(function (ress) {
            ress.forEach((item,index)=>{
                let title = arr[index].title;
                /*console.log(arr[index]);
                fs.writeFile('./text/'+title + '.txt', item, (err) => {
                    if (err) throw err;
                    console.log(title+'生成成功');
                });*/
            })
        });
        start = end+1;
        end = start + num;
        urls.length-1 < end ?end=urls.length-1:end
    }
}
req(10);

