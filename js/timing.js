/**
 * Created by cl on 2017/6/30.
 */
import schedule from  'node-schedule'
import {novel,website} from './mongo/db_novel'

let rule = new schedule.RecurrenceRule();

rule.minute = 40;

let j = schedule.scheduleJob(rule, function(){

    novel.query({isList:true}).then((res)=>{
        res.data.forEach(function(item){
            website.query({id:item.websiteId}).then((results)=>{
                generate(item,results.data);
            }).catch((err)=>{log.error(err);});
        })
    });
});