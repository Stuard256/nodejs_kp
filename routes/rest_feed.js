const router = require('express').Router();
const controller = require('../controllers/rest_feed');

router.get('/', (req, res, next) => controller.getFeed(req, res, next));

router.get('/search', (req, res, next) => controller.search(req, res, next));

exports.router = router;