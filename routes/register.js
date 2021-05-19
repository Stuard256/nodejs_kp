const router = require('express').Router();
const controller = require('../controllers/register');
const multer = require('multer');

let upload = multer({dest: 'static/avatars'});

router.get('/', (req, res, next) => controller.getRegistrationPage(req, res, next));
router.post('/', upload.single('avatar'), (req, res, next) => controller.postRegistrationPage(req, res, next));

exports.router = router;