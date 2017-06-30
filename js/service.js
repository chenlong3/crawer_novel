/**
 * Created by cl on 2017/6/30.
 */
import {novel,website} from './mongo/db_novel'
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
function addNovel(req,res,next){
   let body = req.body;
   website.query({id:body.websiteId}).then((websiteDd)=>{
       let websiteData = websiteDd.data;
       let config = {
           name: body.name,
           node: websiteData.node,
           chilNode: websiteData.chilNode,
           url: websiteData.url + body.path
       };

   })
}
novelService.observe('posh',addNovel);
export {websiteService,novelService}