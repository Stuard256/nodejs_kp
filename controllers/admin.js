const Models = require('../models/all');
const Publication = Models.Publication;
const User = Models.User;

const os = require('os')

exports.getPanel = async function (req, res, next) {
    // TODO: check admin permissions
    res.render('admin/index', { title: 'Admin panel', req: req, res: res });
}

exports.getPublicationsPage = async function (req, res, next) {
    // TODO: check admin persmissions

    let whereStrategy = {};
    if (!req.query.filter || req.query.filter === 'pending') {
        whereStrategy = { reviewed: false, published: false };
    } else if (req.query.filter === 'published') {
        whereStrategy = { published: true, reviewed: true };
    } // else all

    let offset = 0;
    if (req.query.offset) {
        offset = parseInt(req.query.offset);
    }

    let publications = await Publication.findAll({
        where: whereStrategy,
        order: [
            ['updatedAt', 'DESC']
        ],
        limit: 10,
        offset: offset
    });
    let pubs = [];
    for (let publication of publications) {
        pubs.push({
            id: publication.dataValues.id,
            title: publication.dataValues.name,
            content: publication.dataValues.content,
        });
    }
    res.render('admin/publications', { title: 'Publications administration', req: req, res: res, pubs: pubs });
}

exports.getUsersPage = async function (req, res, next) {
    // TODO: check admin permissions
    let offset = 0;
    if (req.query.offset) {
        offset = parseInt(req.query.offset);
    }

    let users = await User.findAll({
        order: [
            ['updatedAt', 'DESC']
        ],
        limit: 10,
        offset: offset
    });
    let usrs = [];
    for (let user of users) {
        usrs.push({
            id: user.dataValues.id,
            nick: user.dataValues.nick,
        });
    }
    res.render('admin/users', { title: 'Users administration', req: req, res: res, users: usrs });
}

exports.getServerManagementPage = async function (req, res, next) {
    // TODO: check admin permissions
    let cpudata = [];
    let avgCpu = 0.0;

    for (let cpu of os.cpus())
    {
        let cpuPercentage = 100 - ((cpu.times.idle / (cpu.times.sys + cpu.times.user + cpu.times.idle)) * 100.0);
        cpudata.push({
            name: cpu.model,
            speed: cpu.speed,
            avg: cpuPercentage.toFixed(2)
        });
        avgCpu += cpuPercentage;
    }
    avgCpu /= os.cpus().length;

    let memory = {
        total: (os.totalmem() / (1024 * 1024)).toFixed(2),
        free: (os.freemem() / (1024 * 1024)).toFixed(2),
        avg: (100 - ((os.freemem() / os.totalmem()) * 100.0)).toFixed(2)
    }

    res.render('admin/server', { title: 'Server management', req: req, res: res, cpudata: cpudata, memory: memory, avgCpu: avgCpu });
}

exports.applyPublicationAction = async function (req, res, next) {
    // TODO: check admin permissions
    if (req.body.action === 'accept' || req.body.action === 'reject') {
        let publicationId = parseInt(req.body.id);
        let publication = await Publication.findOne({
            where: {
                id: publicationId,
                published: false,
                reviewed: false
            }
        });
        if (publication) {
            publication.reviewed = true;
            if (req.body.action === 'accept') {
                publication.published = true;
            } else {
                publication.published = false;
            }
            await publication.save();

            res.redirect(`/publications?id=${publicationId}`);
        } else {
            res.end('Invalid publication');
        }

    } else {
        res.end('Invalid action');
    }
}