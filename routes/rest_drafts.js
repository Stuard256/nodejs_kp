const router = require('express').Router();
const controller = require('../controllers/rest_drafts')

router.post('/', (req, res, next) => controller.postDraft(req, res, next));
router.get('/', (req, res, next) => controller.getDrafts(req, res, next));
router.delete('/', (req, res, next) => controller.deleteDraft(req, res, next));

exports.router = router;