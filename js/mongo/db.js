/**
 * Created by cl on 2017/6/16.
 */
import mongoose from 'mongoose'
import config from '../../config'
let url = 'mongodb://' + config.mongod.user + ':' + config.mongod.pwd + '@' + config.mongod.ip + ':' + config.mongod.port + '/' +config.mongod.db;
mongoose.connect(url);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('ok')
});
export {mongoose,db}