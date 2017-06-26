/**
 * Created by cl on 2017/6/21.
 */
import express from 'express'
import generate from './comom'
const router = express.Router();
router.use(function(req, res, next) {
    // .. some logic here .. like any other middleware
    next();
});
router.get('/api/novel',function(req,res,next){
    generate(10,req.query);
    res.json({href:'./text/'+req.query.name+'/'+req.query.name})
});
export default router