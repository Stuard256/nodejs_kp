const Models = require('../models/all');
const Comment = Models.Comment;
const User = Models.User;
const Publication = Models.Publication;

exports.getFeed = async function (req, res, next) {
    try {
        let offset = 0;
        if (req.query.offset)
            offset = parseInt(req.query.offset);
        let publications = await Publication.findAll({
            where: {
                published: true
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
        for (let publication of publications) {
            resultArray.push({
                updatedAt: publication.dataValues.updatedAt,
                createdAt: publication.dataValues.createdAt,
                name: publication.dataValues.name,
                content: publication.dataValues.content,
                id: publication.dataValues.id,
                user: {
                    id: publication.dataValues.userId,
                    nick: publication.user.dataValues.nick,
                    avatar: publication.user.dataValues.avatar
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

exports.search = async function (req, res, next) {
    try {
        let offset = 0;
        if (req.query.offset)
            offset = parseInt(req.query.offset);

        let publications = await Publication.findAll({
            where: {
                published: true
            }
        });

        let resultArray = publications.filter(item => item.name.toLowerCase().search(req.query.name.toLowerCase()) + 1)
        if (resultArray.length > 0) {
            let result = { success: true, items: resultArray };
            res.json(result);
        }
        else {
            let result = { success: false, error: "Nothing found" };
            res.json(result);
        }
    } catch (e) {
        res.statusCode = 400;
        res.json({ error: e.message });
    }
};