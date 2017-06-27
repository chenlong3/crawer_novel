/**
 * Created by cl on 2017/6/21.
 */
import express from 'express'
import {generate,websiteService} from './comom'
const router = express.Router();
router.use(function(req, res, next) {
    // .. some logic here .. like any other middleware
    next();
});
router.get('/api/novel',function(req,res,next){
    generate(10,req.query);
    res.json({href:'/text/'+req.query.name+'/'+req.query.name})
});
router.get('/text/download',function(req,res,next){
    res.download(req.query.path)
});
console.log(websiteService().get);
router.route('/api/website/:id')
    .get(websiteService().get)
    .put(websiteService().put)
    .delete(websiteService().del);
router.route('/api/website/')
    .get(websiteService().get)
    .post(websiteService().post);
export default router