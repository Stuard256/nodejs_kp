const uuid = require('uuid');

const Models = require('../models/all');
const PublicationDraft = Models.PublicationDraft;
const Publication = Models.Publication;
const User = Models.User;

exports.getNewPage = async function (req, res, next) {
    // TODO: check permissions

    let resultUuid = uuid.v4();
    let publicationTitle = 'My new publication';
    let publicationContent = '';
    let isDraft = false;
    if (req.query.recoverDraft) {
        let draft = await PublicationDraft.findOne({
            where: {
                uuid: req.query.recoverDraft,
                userId: req.session.userId
            }
        });
        if (draft) {
            resultUuid = draft.uuid;
            publicationTitle = draft.title;
            publicationContent = draft.content;
            isDraft = true;
        } else {
            res.redirect('/publications/new');
        }
    }
    res.render('publications/new', { title: 'New publication', publicationTitle: publicationTitle, publicationContent: publicationContent, req: req, res: res, uuid: resultUuid, isDraft: isDraft });
}

exports.postPublication = async function (req, res, next) {
    // TODO: check permissions
    try {
        let trimmedTitle = req.body.title.trim();
        let trimmedContent = req.body.content.trim();
        if (trimmedTitle.length < 5  || trimmedTitle.length > 55) {
            throw new Error("Invalid title length");
        }

        if (trimmedContent.length < 5) {
            throw new Error("Invalid content length");
        }
        let createdPub = await Publication.create({name: req.body.title, content: req.body.content, userId: req.session.userId});
        console.log(createdPub.dataValues.id);
        res.redirect(`/publications?id=${createdPub.dataValues.id}`);
    } catch (e) {
        res.write(e.message);
    }
}

exports.getPublication = async function(req, res, next) {
    console.log(req.query.id);
    let publication = await Publication.findOne({where: {
        id: req.query.id
    }});
    let author = {};
    if (!publication) {
        // TODO: redirect to 404
        res.end("404 error");
    } else {
        if (publication.userId != null) {
            let user = await User.findOne({where: {id: publication.userId}});
            if (user != null) {
                author.id = user.id;
                author.nick = user.nick;
            }
        }
        let created = new Date(publication.dataValues.createdAt).toLocaleString();
        res.render('publications/index', {title: 'Publication', author: author, publication: publication.dataValues, created: created, req: req, res: res});
    }
}