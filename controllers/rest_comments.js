const Models = require('../models/all');
const Comment = Models.Comment;
const User = Models.User;
const Publication = Models.Publication;


exports.getComments = async function (req, res, next) {
    try {
        if (req.query.publication === undefined) {
            throw new Error('Wrong usage');
        }
        let publicationId = parseInt(req.query.publication);

        let offset = 0;
        if (req.query.offset !== undefined) {
            offset = parseInt(req.query.offset);
        }

        let comments = await Comment.findAll({
            where: {
                publicationId: publicationId,
            },
            order: [
                ['updatedAt', 'DESC']
            ],
            include: [{
                model: User,
                required: true
            }],
            limit: 10,
            offset: offset
        });

        let resultArray = [];
        for (let comment of comments) {
            resultArray.push({
                createdAt: comment.dataValues.createdAt,
                content: comment.dataValues.content,
                user: {
                    id: comment.dataValues.userId,
                    nick: comment.user.dataValues.nick,
                    avatar: comment.user.dataValues.avatar
                }
            });
        }

        let result = {success: true, items: resultArray};
        res.json(result);
    } catch (e) {
        res.statusCode = 400;
        res.json({ error: e.message });
    }
}

exports.postComment = async function (req, res, next) {
    try {
        if (!req.session.userId) {
            throw new Error('Unauthorized access');
        }

        let content = req.body.content.trim();

        if (content.length < 10 || content.length > 2048) {
            throw new Error('Content length so strange');
        }
        await Comment.create({
            userId: req.session.userId,
            publicationId: req.body.id,
            content: content
        });
        res.json({success: true});
    } catch (e) {
        res.json({ error: e.message });
    }
}

exports.deleteComment = async function (req, res, next) {
    try {
        // res.json({success: true, destroyed: destroyed});
    } catch (e) {
        res.json({ error: e.message });
    }
}