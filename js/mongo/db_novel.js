/**
 * Created by cl on 2017/6/16.
 */
import mongoose from './db'
const Schema = mongoose.Schema;
const novelSchema = new Schema({
    name: String,
    items: [],
    UdIndex: Number,
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
        Entity.save(function (err) {
            if(err)throw err;

        });
    }
    query(obj){
        let model = this.model;
        return new Promise(function(resolve,reject){
            model.findOne(obj||{},function(err,res){
                if(err){
                    reject(err)
                }else{
                  resolve(res)
                }
            })
        })
    }
    del(id){
        this.model.findById(id,function(err,res){
            if(err)throw err;
            res.remove({_id:id},function(err){})
        })
    }
    updata(id,data){
        this.model.findByIdAndUpdate(id,{$set:data},function(err,person){
            if(err)throw err;
            console.log('已更新：',person.name)
        });
    }
}
let novel = new Novel(novelSchema,'Novel');
let website = new Novel(websiteSchema,'website');
export {novel,website}