/**
 * Created by cl on 2017/6/16.
 */
import mongoose from './db'
const Schema = mongoose.Schema;
const novelSchema = new Schema({
    name: String,
    path:String,
    items: [],
    UdIndex: Number,
    isFull:Boolean
});
const websiteSchema = new Schema({
    name:String,
    url:String,
    node:String,
    chilNode:String
});
class Novel{
    constructor(Schema,name){
        this.model = mongoose.model(name,Schema);
    }
    add(data){
        let Entity = new this.model(data);
        return new Promise(function(resolve,reject){
            Entity.save(function (err,data) {
                if(err){
                    reject(err)
                }else{
                    resolve({res: "SUCCESS",data:data})
                }
            });
        })

    }
    query(obj){
        let model = this.model;
        return new Promise(function(resolve,reject){
            model.findOne(obj||{},function(err,res){
                if(err){
                    reject(err)
                }else{
                  resolve({data:res,res:"SUCCESS"})
                }
            })
        })
    }
    del(id){
        let model = this.model;
        return new Promise(function(resolve,reject){
            model.findById(id,function(err,res){
                if(err)throw err;
                res.remove({_id:id},function(err,data){
                    if(err){
                        reject(err)
                    }else{
                        resolve({res: "SUCCESS",data:data})
                    }
                })
            })
        })
    }
    updata(id,data){
        let model = this.model;
        return new Promise(function(resolve,reject){
            model.findByIdAndUpdate(id,{$set:data},function(err,person){
                if(err){
                    reject(err)
                }else{
                    resolve({res:'SUCCESS',data:person})
                }
            });
        })

    }
}
let novel = new Novel(novelSchema,'Novel');
let website = new Novel(websiteSchema,'website');
export {novel,website}