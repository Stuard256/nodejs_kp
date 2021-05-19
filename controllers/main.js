const fs = require('fs');
const mime = require('mime');

exports.getMainPage = function(req, res, next) {
    res.render('index', {title: 'Main', req: req, res: res});
}

exports.getFavicon = function(req, res, next) {
    res.redirect('/public/images/favicon.ico');
    //let filePath = '../static/images/favicon.ico';
}