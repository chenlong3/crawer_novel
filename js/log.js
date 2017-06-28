/**
 * Created by cl on 2017/6/28.
 */
import winston from 'winston'

let logger = new winston.Logger({
    level: 'debug',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename:'allenway.log',json:false})
    ]
});
export default logger