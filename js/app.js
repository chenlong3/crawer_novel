/**
 * Created by cl on 2017/6/12.
 */
import express from 'express'
import router from './router'


const app = express();
app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});
app.use('/', router);

app.listen(process.env.PORT || '3000',function(err){
    if(err)console.log(err);
    console.log(process.env.PORT||3000)
});