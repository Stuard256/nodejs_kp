const router = require('express').Router();
const controller = require('../controllers/publications')

router.get('/new', (req, res, next) => controller.getNewPage(req, res, next));
router.post('/new', (req, res, next) => controller.postPublication(req, res, next));
router.get('/', (req, res, next) => controller.getPublication(req, res, next));

exports.router = router;