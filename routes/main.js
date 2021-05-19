const router = require('express').Router();
const controller = require('../controllers/main');
router.get('/', (req, res, next) => controller.getMainPage(req, res, next));
router.get('/favicon.ico', (req, res, next) => controller.getFavicon(req, res, next));

const registerRouter = require('./register').router;
router.use('/register', registerRouter);

const signinRouter = require('./signin').router;
router.use('/signin', signinRouter);

const usersRouter = require('./users').router;
router.use('/users', usersRouter);

const publicationsRouter = require('./publications').router;
router.use('/publications', publicationsRouter);

const imagesRouter = require('./images').router;
router.use('/images', imagesRouter);

const adminMiddleware = require('../middlewares/permissions').adminPermissionsCheckerMiddleware;
const adminRouter = require('./admin').router;
router.use('/admin', adminMiddleware, adminRouter);

// REST
const restDraftsRouter = require('./rest_drafts').router;
router.use('/api/drafts', restDraftsRouter);

const restCommentsRouter = require('./rest_comments').router;
router.use('/api/comments', restCommentsRouter);

const restFeedRouter = require('./rest_feed').router;
router.use('/api/feed', restFeedRouter);

exports.router = router;