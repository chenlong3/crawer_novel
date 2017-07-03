/**
 * Created by cl on 2017/6/30.
 */
import fs from 'fs'
import {http,toHash,addFolder} from '../comom'
import parsing from './parsing'
import log from '../log'

async function generate(config,number){
    log.info('开始循环写入');
    let result = config.items.splice(config.UdIndex||0);
    let num = number||10;
    let start = 0;
    let end = start + num;
    let count = 0;
    let hash = toHash(config.name);
    addFolder('./text/multiple/' + hash);
    log.info('开始更新'+ config.name);

    result.length < end ? end = result.length : end;

    for (let i = 0, len = Math.ceil(result.length / num); i < len; i++) {

        let arr = result.slice(start, end);

        let prmire = arr.map(function (item) {

            let url = config.url + item.herf;

            return http(url);
        });

        await Promise.all(prmire).then(function (ress) {

            ress.forEach((item, index) => {
                let tHash = arr[index].hash;
                let title = arr[index].title;
                let fileData = parsing.content(title,item,config.chilNode);

                fs.writeFile('./text/multiple/' + hash + '/' + tHash + '.html', fileData, (err) => {

                    if (err) log.error(err);

                    count++;
                    log.info(title + '生成完成',count + '/' + result.length);
                })
            });

            start = end;
            end = start + num;
            result.length < end ? end = result.length : end
        })
    }
    await function () {
        console.log('循环写入完成')
    }
}

export default generate