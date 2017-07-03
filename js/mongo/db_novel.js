/**
 * Created by cl on 2017/6/16.
 */
import mongoose from './db'
const Schema = mongoose.Schema;
const novelSchema = new Schema({
    name: {
        type:String,
        required:true,
        unique:true
    },
    path:{
        type:String,
        required:true
    },
    items: [],
    UdIndex: Number,
    isFull:Boolean,
    websiteId: {
        type:Schema.Types.ObjectId,
        required: true
    },
    hash:Number,
    upDateAt:Date
});
const websiteSchema = new Schema({
    name:{
        type:String,
        required: true,
        unique:true
    },
    url:{
        type:String,
        required: true
    },
    node:{
        type:String,
        required: true
    },
    chilNode:{
        type:String,
        required: true
    },
    upDateAt:Date
});
class Novel{
    constructor(Schema,name){
        this.model = mongoose.model(name,Schema);
        this.error = {
            status:600
        }
    }
    toClient(obj){
        if(obj){
            if(obj instanceof Array){
                obj = obj.map(function(item){
                    let _obj = item.toObject();
                    _obj._id&&(_obj.id = _obj._id);
                     delete _obj._id;
                     delete _obj.__v;
                    return _obj
                });
            }else{
                obj = obj.toObject();
                obj._id&&(obj.id = obj._id);
                delete obj._id;
                delete obj.__v;
            }
            return obj
        }else{
            return {}
        }
    }
    toDb(obj){
        if(obj){
            obj.id&&(obj._id = obj.id);
            delete obj.id;
            delete obj.isList;
            return obj
        }else{
            return {}
        }
    }
    saveDb(data){
        if(typeof data === 'object'){
            data.upDateAt = new Date();
        }
        return data
    }
    add(data){
        let Entity = new this.model(this.saveDb(data));
        let error = this.error;
        let toClient = this.toClient;
        return new Promise(function(resolve,reject){
            Entity.save(function (err,data) {
                if(err){
                    error.message = err.message;
                    reject(error)
                }else{
                    resolve({res: "SUCCESS",data:toClient(data)})
                }
            });
        })

    }
    query(obj){
        let model = this.model;
        let error = this.error;
        let toClient = this.toClient;
        let toDb = this.toDb;
        return new Promise(function(resolve,reject){
            if(!obj||obj.isList){
                model.find(toDb(obj)||{},function(err,res){
                    if(err){
                        error.message = err.message;
                        reject(error)
                    }else{
                        resolve({data:toClient(res),res:"SUCCESS"})
                    }
                })
            }else{
                model.findOne(toDb(obj)||{},function(err,res){
                    if(err){
                        error.message = err.message;
                        reject(error)
                    }else{
                        resolve({data:toClient(res),res:"SUCCESS"})
                    }
                })
            }
        })
    }
    del(id){
        let model = this.model;
        let error = this.error;
        let toClient = this.toClient;
        return new Promise(function(resolve,reject){
            model.findById(id,function(err,res){
                if(err)throw err;
                res.remove({_id:id},function(err,data){
                    if(err){
                        error.message = err.message;
                        reject(error)
                    }else{
                        resolve({res: "SUCCESS",data:toClient(data)})
                    }
                })
            })
        })
    }
    updata(id,data){
        let model = this.model;
        let error = this.error;
        let toClient = this.toClient;
        let saveDb = this.saveDb;
        return new Promise(function(resolve,reject){
            model.findByIdAndUpdate(id,{$set:saveDb(data)},function(err,person){
                if(err){
                    error.message = err.message;
                    reject(error)
                }else{
                    resolve({res:'SUCCESS',data:toClient(person)})
                }
            });
        })

    }
}
let novel = new Novel(novelSchema,'Novel');
let website = new Novel(websiteSchema,'website');
export {novel,website}