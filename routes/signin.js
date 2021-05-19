const router = require('express').Router();
const controller = require('../controllers/signin')

router.post('/', (req, res, next) => controller.signIn(req, res, next));

exports.router = router;