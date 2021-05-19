const router = require('express').Router();
const controller = require('../controllers/admin')

router.get('/', (req, res, next) => controller.getPanel(req, res, next));
router.get('/publications', (req, res, next) => controller.getPublicationsPage(req, res, next));
router.get('/users', (req, res, next) => controller.getUsersPage(req, res, next));
router.get('/server', (req, res, next) => controller.getServerManagementPage(req, res, next));

router.post('/publications', (req, res, next) => controller.applyPublicationAction(req, res, next));

exports.router = router;