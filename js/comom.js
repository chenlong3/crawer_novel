/**
 * Created by cl on 2017/6/12.
 */
import request from 'request'
function http(url){
    return new Promise(function(resolve,reject){
        request.get({url:url,encoding:null},function(err, res, body){
            if(err){
                return reject(err)
            }
            return resolve(body)

        })
    });
}

export default http