/**
 * Created by cl on 2017/6/12.
 */
import request from 'request'
import cheerio from 'cheerio'
import iconv from 'iconv-lite'
import schedule from  'node-schedule'
import log from './log'
import {novel,website} from './mongo/db_novel'
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

function merge(result,name,id) {
    result.forEach(function(item,index){
        let data = fs.readFileSync('./text/' + name + '/' + name + '/' + item.title + '.html', 'utf8');
        if(index === 0){
            data = '<!DOCTYPE html><html lang="zh"><head><meta charset="utf-8"><title>'+name+'</title></head><body>'+data
        }
        if(index === result.length-1){
            data = data + '</body></html>'
        }
        console.log('开始写入' + item.title);
        fs.appendFileSync('./text/' + name + '/' + name + '.html',data);
    });
    novel.updata(id,{isFull:true});
    log.info(name+'写入成功')
}



async function generate(novelData,websiteData,number) {
    function fn(res) {
        let urls = [];
        let _res = iconv.decode(res, 'gb2312');
        let $ = cheerio.load(_res);
        let el = $(config.node);
        el.each(function (index, ele) {
            let obj = {};
            obj.index = index - 4;
            obj.herf = $(this).attr('href');
            obj.title = $(this).text().replace(/\/|(\*)/g,'-');
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
                if(err)log.error(err);
            });
            fs.mkdir('./text/'+data.name + '/' + data.name,function(err){
                if(err)log.error(err);
            });
            novel.add(data);
        }
        return urls
    }

    let config = {
        name:novelData.name,
        node:websiteData.node,
        chilNode:websiteData.chilNode,
        url: websiteData.url+novelData.path
    };
    let num = number||10;
    let name = config.name;
    let data = await http(config.url);                  //请求章节目录的网页
    let urls = await fn(data);                          //处理章节目录网页，提取章节名称等


    let resDb = await novel.query({name:name});        //查询数据库是否有同名小说
    let result = await save(resDb,urls);               //存在同名小说更新，没有则新增
    let id = resDb&&resDb._id;
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
                        if(err)log.error(err) ;
                        log.info(title+'生成完成',count,result.length);
                        count++;
                        if(count >= result.length){
                            merge(result,name,id)
                        }
                    })
                });
                start = end;
                end = start + num;
                result.length < end ? end = result.length : end
            })
        }
    }else{
        log.info('不需要更新')
    }
}
/*function novelService(){
    return{
        get:function(req,res,next){
            let obj;
            req.params.id ? obj = {}:obj={isList:true};
            Object.assign(obj,req.params,req.query);
            novel.query(obj).then(function(result){
                res.json(result)
            }).catch((err)=>next(err))
        },
        post:function(req,res,next){
            novel.add(req.body).then(function(result){
                res.json(result)
            }).catch((err)=>next(err))
        },
        del:function(req,res,next){
            novel.del(req.params.id).then(function(result){
                res.json(result)
            }).catch((err)=>next(err))
        },
        put:function (req,res,next) {
            novel.updata(req.params.id,req.body).then(function(result){
                res.json(result)
            }).catch((err)=>next(err))
        }
    }
}

function websiteService (){
    return{
        get:function(req,res,next){
            let obj;
            req.params.id ? obj = {}:obj={isList:true};
            Object.assign(obj,req.params,req.query);
            website.query(obj).then(function(result){
                res.json(result)
            }).catch((err)=>next(err))
        },
        post:function(req,res,next){
            website.add(req.body).then(function(result){
                res.json(result)
            }).catch((err)=>next(err))
        },
        del:function(req,res,next){
            website.del(req.params.id).then(function(result){
                res.json(result)
            }).catch((err)=>next(err))
        },
        put:function (req,res,next) {
            website.updata(req.params.id,req.body).then(function(result){
                res.json(result)
            }).catch((err)=>next(err))
        }
    }
}*/

class Service {
    constructor(model){
        this.model = model;
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.put = this.put.bind(this);
        this.del = this.del.bind(this);
    }
    get(req,res,next){
        let obj;
        req.params.id ? obj = {}:obj={isList:true};
        Object.assign(obj,req.params,req.query);
        this.model.query(obj).then(function(result){
            res.json(result)
        }).catch((err)=>next(err))
    }
    post(req,res,next){
        this.model.add(req.body).then(function(result){
            res.json(result)
        }).catch((err)=>next(err))
    }
    del(req,res,next){
        this.model.del(req.params.id).then(function(result){
            res.json(result)
        }).catch((err)=>next(err))
    }
    put(req,res,next) {
        this.model.updata(req.params.id,req.body).then(function(result){
            res.json(result)
        }).catch((err)=>next(err))
    }
}
let websiteService = new Service(website);
let novelService = new Service(novel);

let rule = new schedule.RecurrenceRule();

rule.minute = 40;

let j = schedule.scheduleJob(rule, function(){

    novel.query({isList:true}).then((res)=>{
        res.forEach(function(item){
            website.query({id:item.websiteId}).then((results)=>{
                generate(item,results);
            }).catch((err)=>{log.error(err);});
        })
    });
});


export {websiteService,novelService}