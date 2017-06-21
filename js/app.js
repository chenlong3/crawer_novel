/**
 * Created by cl on 2017/6/12.
 */
import express from 'express'
import router from './router'

const app = express();
app.use('/api/novel', router);
/*app.get('/api/novel',function(req,res){
    console.log(req.query);
    res.send('asfsdf')
});*/

app.listen(process.env.PORT || '3000',function(err){
    if(err)console.log(err);
    console.log(3000)
});