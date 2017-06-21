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
let novelModel = mongoose.model('Novel',novelSchema);
class Novel{
    constructor(){}
    add(data){
        let novelEntity = new novelModel(data);
        novelEntity.save(function (err) {
            if(err)throw err;

        });
    }
    query(obj){
        return new Promise(function(resolve,reject){
            novelModel.findOne(obj||{},function(err,res){
                if(err){
                    reject(err)
                }else{
                  resolve(res)
                }
            })
        })

    }
    del(id){
        novelModel.findById(id,function(err,res){
            if(err)throw err;
            res.remove({_id:id},function(err){})
        })
    }
    updata(id,data){
        novelModel.findByIdAndUpdate(id,{$set:data},function(err,person){
            if(err)throw err;
            console.log('已更新：',person.name)
        });
    }
}
let novel = new Novel();
export default novel