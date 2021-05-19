const Models = require('../models/all');
const User = Models.User;
const Publication = Models.Publication;
const Message = Models.Message;


exports.logout = async function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
}
exports.getProfilePage = async function (req, res, next) {
    if (!req.query.id) {
        if (req.session.userId) {
            req.query.id = req.session.userId;
        } else {
            res.statusCode = 401;
            return await res.end("Unauthorized access");
        }
    }
    let user = await User.findOne({ where: { id: req.query.id } });
    let isOwner = false;
    if (user && req.session && user.dataValues.id === req.session.userId)
        isOwner = true;

    res.render('users/profile', { title: 'User profile', req: req, res: res, user: user ? user.dataValues : null, isOwner: isOwner });
}

exports.getPublicationsPage = async function (req, res, next) {
    const itemsOnPage = 10;
    let offset = 0;
    let page = 1;
    if (req.query.page != null) {
        page = parseInt(req.query.page)
        offset = (page - 1) * itemsOnPage;
    }

    if (!req.query.id) {
        if (req.session.userId) {
            req.query.id = req.session.userId;
        } else {
            res.statusCode = 401;
            return await res.end("Unauthorized access");
        }
    }

    let user = await User.findOne({ where: { id: req.query.id } });
    let isOwner = false;
    if (user && req.session && user.dataValues.id === req.session.userId)
        isOwner = true;

    let publications = await Publication.findAndCountAll({
        limit: itemsOnPage,
        offset: offset,
        where: { userId: user.dataValues.id },
        order: [
            ['createdAt', 'DESC']
        ]
    });

    let pages = [];
    const pagesNumber = Math.ceil(publications.count / itemsOnPage);
    for (let i = 1; i <= pagesNumber; ++i) {
        pages.push(i);
    }
    let pubs = [];
    for (let pub of publications.rows) {
        pubs.push({
            name: pub.dataValues.name,
            id: pub.dataValues.id,
            created: new Date(pub.dataValues.createdAt).toUTCString()
        });
    }

    let nextPage = page + 1;
    let prevPage = page - 1;
    prevPage = prevPage < 1 ? null : prevPage;
    nextPage = nextPage > pagesNumber ? null : nextPage;

    res.render('users/publications', {
        title: 'User publications',
        req: req,
        res: res,
        user: user ? user.dataValues : null,
        isOwner: isOwner,
        publications: pubs,
        pagination: pages,
        page: page,
        nextPage: nextPage,
        prevPage: prevPage
    });
}

exports.getMessagesPage = async function (req, res, next) {
    if (!req.session.userId) {
        res.statusCode = 401;
        return await res.end('Unauthorized');
    }
    let dialogs = await Message.findAll({
        where: {
            toUserId: req.session.userId
        },
        //group: 'fromUserId',
        include: [{
            model: User,
            as: 'sourceUser',
            required: true
        }, {
            model: User,
            as: 'targetUser',
            required: true
        }],
        order: [
            ['createdAt', 'DESC']
        ]
    });
    let diags = [];
    for (let dialog of dialogs) {
        console.log(dialog.sourceUser.nick);
        console.log(`From: ${dialog.dataValues.fromUserId}, to: ${dialog.dataValues.toUserId} - ${dialog.dataValues.content}`);
        diags.push({
            id: dialog.dataValues.id,
            content: dialog.dataValues.content,
            createdAt: dialog.dataValues.createdAt.toLocaleString(),
            from: {
                id: dialog.sourceUser.id,
                nick: dialog.sourceUser.nick,
                avatar: dialog.sourceUser.avatar
            }
        });
    }
    res.render('users/messages', {title: 'Messages', req: req, res: res, isOwner: true, dialogs: diags });
}

exports.getSendMessagePage = async function (req, res, next) {
    try {
        if (!req.session.userId) {
            throw new Error();
        }

        if (!req.query.to) {
            throw new Error('No to param');
        }

        let toUserId = parseInt(req.query.to);
        let toUser = await User.findOne({
            where: {
                id: toUserId
            }
        });
        if (!toUser) {
            throw new Error('No such user found');
        }

        res.render('users/message_send', { title: 'Messages', req: req, res: res, isOwner: true, toUser: toUser.dataValues });
    } catch (e) {
        res.statusCode = 401;
        res.end("Unauthorized access\n" + e.message);
    }
}

exports.sendMessage = async function (req, res, next) {
    try {
        if (!req.session.userId) {
            throw new Error('Unauthorized access');
        }

        if (!req.body.content || !req.body.to) {
            throw new Error();
        }

        let content = req.body.content.trim();
        if (content.length < 5 || content.length > 1024) {
            throw new Error();
        }

        let toUser = await User.findOne({where: {
            id: parseInt(req.body.to)
        }});

        if (!toUser) {
            throw new Error('No such user');
        }

        await Message.create({toUserId: toUser.id, fromUserId: req.session.userId, content: content});
        res.redirect('/users/messages');
    } catch (e) {
        res.statusCode = 401;
        res.end("Unauthorized access\n" + e.message);
    }
}