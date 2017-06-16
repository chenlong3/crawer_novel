/**
 * Created by cl on 2017/6/16.
 */
import {mongoose,db} from './db'
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const novelChapterSchema = new Schema({
    title:String,
    href: String,
    index: Number,
    id:ObjectId
});
const novelSchema = new Schema({
    name: String,
    items: [novelChapterSchema],
    UdIndex: Number,
    id:ObjectId
});
let novelModel = db.model('Novel',novelSchema);
let novelEntity = new novelModel({name:'最强基因',id:'fkdfffffffffffffffffffffff'});
novelEntity.save(function(err){
    console.log(err);
});
console.log(55555555555,novelEntity.id);
novelModel.find({name:'最强基因'},function(err,data){
    console.log(data);
});