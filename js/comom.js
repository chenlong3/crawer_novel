/**
 * Created by cl on 2017/6/12.
 */
import request from 'request'
import log from './log'

export function http(url){
    return new Promise(function(resolve,reject){
        let startTime = new Date().getTime();
        log.info('开始请求:'+ url);
        request.get({url:url,encoding:null},function(err, res, body){
            let endTime = new Date().getTime();
            if(err){
                log.error(url+':请求失败'+ 'time:'+(endTime - startTime));
                return reject(err)
            }
            log.info(url+':请求成功'+ 'time:'+(endTime - startTime));
            return resolve(body)
        })
    });
}

export function toHash(value){
    let hash = 0;
    value.join('').forEach((str,index)=>{
        hash += value.charCodeAt(index)
    });
    return hash
}