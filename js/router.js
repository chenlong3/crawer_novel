/**
 * Created by cl on 2017/6/21.
 */
import express from 'express'
import {generate,websiteService,novelService} from './comom'
const router = express.Router();
router.use(function(req, res, next) {
    // .. some logic here .. like any other middleware
    next();
});
router.get('/text/download',function(req,res,next){
    res.download(req.query.path)
});

router.route('/api/novel/:id')
    .get(novelService.get)
    .put(novelService.put)
    .delete(novelService.del);
router.route('/api/novel')
    .get(novelService.get)
    .post(novelService.post);

router.route('/api/website/:id')
    .get(websiteService.get)
    .put(websiteService.put)
    .delete(websiteService.del);
router.route('/api/website')
    .get(websiteService.get)
    .post(websiteService.post);

export default router