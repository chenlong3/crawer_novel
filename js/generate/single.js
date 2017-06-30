/**
 * Created by cl on 2017/6/30.
 */
import {http,toHash} from '../comom'

async function generate(config,number){
    let result = config.items.splice(config.UdIndex||0);
    let num = number||10;
    let start = 0;
    let end = start + num;
    let hash = toHash(config.name);

    log.info('开始更新'+ config.name);

    result.length < end ? end = result.length : end;

    for (let i = 0, len = Math.ceil(result.length / num); i < len; i++) {

        log.info('开始循环写入', i, len);

        let arr = result.slice(start, end);

        let prmire = arr.map(function (item) {

            let url = config.url + item.herf;

            return http(url);
        });

        await Promise.all(prmire).then(function (ress) {

            ress.forEach((item, index) => {
                let tHash = arr[index].hash;
                let fileData = parsing(arr[index].title,item,config.chilNode);

                fs.writeFile('./text/' + hash + '/' + hash + '/' + tHash + '.html', fileData, (err) => {

                    if (err) log.error(err);

                    log.info(title + '生成完成', count, result.length);
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