/**
 * Created by cl on 2017/6/30.
 */
import {toHash} from '../comom'
import log from '../log'
import fs from 'fs'

function merge(config) {
    log.info('开始写入' + config.name);
    let hash = toHash(config.name);
    let result = config.items;
    result.forEach(function(item,index){
        let data = fs.readFileSync('./text/multiple/' + hash + '/' + item.hash + '.html', 'utf8');
        if(index === 0){
            data = '<!DOCTYPE html><html lang="zh"><head><meta charset="utf-8"><title>'+config.name+'</title></head><body>'+data
        }
        if(index === result.length-1){
            data = data + '</body></html>'
        }

        fs.appendFileSync('./text/single/' + hash + '.html',data);
    });
    log.info(config.name+'写入成功')
}
export default merge