/**
 * Created by cl on 2017/6/30.
 */
import cheerio from 'cheerio'
import iconv from 'iconv-lite'
import {toHash} from '../comom'

class Parsing {
    constructor(){

    }
    chapter(res){
        let urls = [];
        let _res = iconv.decode(res, 'gb2312');
        let $ = cheerio.load(_res);
        let el = $(config.node);
        let _hash = 0;
        el.each(function (index, ele) {
            let obj = {};
            _hash = (index === 3)?toHash(obj.title):_hash+1;
            obj.index = index - 4;
            obj.herf = $(this).attr('href');
            obj.title = $(this).text();
            obj.hash = _hash;
            urls.push(obj);
        });
        urls.splice(0, 4);
        return urls
    }
    content(title, content, rule) {
        let _content = iconv.decode(content, 'gb2312');
        let _result = _content.match(new RegExp(rule))[0];
        let _arrStr = _result.replace(/(\s|<br \/>|&nbsp|<br>|<\/div>\W+<!)/g, '').split(';;;;');
        _arrStr[0] = '<h3>' + title + '</h3><p>' + _arrStr[0];
        _arrStr[_arrStr.length - 1] += '</p>';
        return _arrStr.join('</p><p>');
    }
}
let pars = new Parsing();
export default pars