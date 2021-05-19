const crypto = require('crypto');
const Models = require('../models/all');
const User = Models.User;

exports.signIn = async function(req, res, next) {
    let email = req.body.email.toLowerCase().trim();
    let password = req.body.password;

    let user = await User.findOne({ where: { email: email } });
    let hashedPass = crypto.createHash('sha256').update(password).digest('hex');
    if (user != null && user.password === hashedPass) {
        req.session.userId = user.id;
        req.session.userNickname = user.nick;
        req.session.userEmail = user.email;
        req.session.userAvatar = user.avatar;
        req.session.userLevel = user.level;
        res.redirect('/');
    } else {
        messages = ['Wrong email or password, try again'];
        res.render('register', { title: 'Register', messages: messages, req: req, res: res });
    }


}