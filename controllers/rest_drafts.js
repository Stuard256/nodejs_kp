const Models = require('../models/all');

const PublicationDraft = Models.PublicationDraft;
exports.postDraft = async function (req, res, next) {
    try {
        if (!req.session.userId) {
            throw new Error("Unauthorized access");
        }
        let draft = await PublicationDraft.findOne({ where: { uuid: req.body.uuid, userId: req.session.userId } });
        if (draft === null) {
            console.log(req.session.userId);
            draft = await PublicationDraft.build({ uuid: req.body.uuid, title: req.body.title, content: req.body.content, userId: req.session.userId });
        } else {
            draft.title = req.body.title;
            draft.content = req.body.content;
        }
        await draft.save();
        res.json({ success: true, id: draft.id });
    } catch (e) {
        res.json({ error: e.message });
    }
}

exports.getDrafts = async function (req, res, next) {
    try {
        if (!req.session.userId) {
            throw new Error("Unauthorized access");
        }
        let drafts = await PublicationDraft.findAll({ where: { userId: req.session.userId } });
        let draftsResult = [];
        for (let draft of drafts) {
            draftsResult.push({
                uuid: draft.uuid,
                title: draft.title,
                created: draft.createdAt
            });
        }
        res.json({success: true, items: draftsResult});
    } catch (e) {
        res.json({ error: e.message });
    }
}

exports.deleteDraft = async function (req, res, next) {
    try {
        if (!req.session.userId) {
            throw new Error("Unauthorized access");
        }
        let destroyed = await PublicationDraft.destroy({where: {userId: req.session.userId, uuid: req.body.uuid}});
        res.json({success: true, destroyed: destroyed});
    } catch (e) {
        res.json({ error: e.message });
    }
}