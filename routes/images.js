const router = require('express').Router();
const controller = require('../controllers/images')
const multer = require('multer');

let upload = multer({dest: 'static/uploads'});

router.post('/', upload.single('picture'), (req, res, next) => controller.uploadImage(req, res, next));

exports.router = router;