/**
 * Created by cl on 2017/6/30.
 */
import {novel,website} from './mongo/db_novel'
import {http,toHash,copy} from './comom'
import merge from './generate/multiple'
import pars from './generate/parsing'
import generate from './generate/single'

class Service {
    constructor(model){
        this.model = model;
        this.method = {};
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.put = this.put.bind(this);
        this.del = this.del.bind(this);
    }
    get(req,res,next){
        let obj;
        let method = this.method.get||[];
        method.forEach((item)=>{
            item(req,res,next)
        });
        req.params.id ? obj = {}:obj={isList:true};
        Object.assign(obj,req.params,req.query);
        this.model.query(obj).then(function(result){
            res.json(result)
        }).catch((err)=>next(err))
    }
    post(req,res,next){
        let method = this.method.post||[];
        method.forEach((item)=>{
            item(req,res,next)
        });
        this.model.add(req.body).then(function(result){
            res.json(result)
        }).catch((err)=>next(err))
    }
    del(req,res,next){
        let method = this.method.del||[];
        method.forEach((item)=>{
            item(req,res,next)
        });
        this.model.del(req.params.id).then(function(result){
            res.json(result)
        }).catch((err)=>next(err))
    }
    put(req,res,next) {
        let method = this.method.put||[];
        method.forEach((item)=>{
            item(req,res,next)
        });
        this.model.updata(req.params.id,req.body).then(function(result){
            res.json(result)
        }).catch((err)=>next(err))
    }
    observe(name,fn){
        this.method[name] = this.method[name] || [];
        this.method[name].push(fn)
    }
}
let websiteService = new Service(website);
let novelService = new Service(novel);
async function addNovel(req,res,next){
   let body = req.body;
   let websiteDd = await website.query({id:body.websiteId});
   let config = {
        name: body.name,
        node: websiteDd.data.node,
        chilNode: websiteDd.data.chilNode,
        url: websiteDd.data.url + body.path
    };
    let data = await http(config.url);
    let urls = await pars.chapter(data,config.node);
    let result = {
        items:copy(urls),
        isFull:true,
        hash:toHash(body.name)
    };
    Object.assign(body,result);
    config.items = copy(urls);
    await generate(config,20);
    await merge(body);
    let novelData = await novel.query({name:config.name});
    await novel.updata(novelData.data.id,body);
}
novelService.observe('post',addNovel);

export {websiteService,novelService}