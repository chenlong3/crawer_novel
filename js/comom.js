/**
 * Created by cl on 2017/6/12.
 */
import request from 'request'
import log from './log'
import fs from 'fs'

export function http(url){
    return new Promise(function(resolve,reject){
        let startTime = new Date().getTime();
        request.get({url:url,encoding:null},function(err, res, body){
            let endTime = new Date().getTime();
            if(err){
                log.error(url+':请求失败'+ 'time:'+(endTime - startTime));
                return reject(err)
            }
            return resolve(body)
        })
    });
}

export function toHash(value){
    let hash = 0;
    value.split('').forEach((str,index)=>{
        hash += value.charCodeAt(index)
    });
    return hash
}
function isFsExist(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

export function addFolder(path) {
    if(!isFsExist(path)){
        fs.mkdir(path,function (err) {
            if(err)throw err;
            log.info(path+'生成成功')
        })
    }else{
        log.info(path+'已存在')
    }
}
export function copy(data){
    if(data instanceof Array){
        let _arr = [];
        data.forEach((item)=>{
            _arr.push(copy(item))
        });
        return _arr
    }else if(typeof data === 'object'){
        let _obj = {};
        Object.keys(data).forEach((item)=>{
            _obj[item] = copy(data[item])
        });
        return _obj
    }else{
        return data
    }
}