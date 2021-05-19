const Models = require('../models/all');
const User = Models.User;
const crypto = require('crypto')

exports.getRegistrationPage = function(req, res, next) {
    res.render('register', { title: 'Sign In', req: req, res: res });
}

exports.postRegistrationPage = async function(req, res, next) {
    let messages = []
    let email = req.body.email.toLowerCase().trim();
    let nick = req.body.nick.trim();
    let password = req.body.password;
    let repeatPassword = req.body.repeatPassword;

    if (password != repeatPassword) {
        messages.push('Your passwords are different, try again');
    }
    if (email.length < 3 || email.length > 36) {
        messages.push('Invalid email length');
    }
    if (nick.length < 3 || nick.length > 25) {
        messages.push('Invalid nickname length');
    }

    try {
        let user = await User.findOne({ where: { email: email } });
        if (user != null) {
            throw new Error('User with this email already exists!');
        }

        let hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        await User.create({
            nick: nick,
            email: email,
            password: hashedPassword,
            avatar: req.file ? '/public/avatars/' + req.file.filename : '/public/images/empty_avatar.jpg'
        });
    } catch (err) {
        messages.push(err.message);
    }

    if (messages.length === 0) { // no errors
        messages.push("You've created an account!");
    }
    res.render('register', { title: 'Sign in', messages: messages, req: req, res: res });
}