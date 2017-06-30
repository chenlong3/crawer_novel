/**
 * Created by cl on 2017/6/30.
 */
import {toHash} from '../comom'
import log from '../log'

function merge(config) {
    let hash = toHash(config.name);
    let result = config.items;
    result.forEach(function(item,index){
        let data = fs.readFileSync('./text/' + hash + '/' + hash + '/' + item.hash + '.html', 'utf8');
        if(index === 0){
            data = '<!DOCTYPE html><html lang="zh"><head><meta charset="utf-8"><title>'+name+'</title></head><body>'+data
        }
        if(index === result.length-1){
            data = data + '</body></html>'
        }
        log.info('开始写入' + item.title);
        fs.appendFileSync('./text/' + hash + '/' + hash + '.html',data);
    });
    log.info(name+'写入成功')
}
export default merge