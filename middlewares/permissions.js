exports.adminPermissionsCheckerMiddleware = function (req, res, next) {
    if (req.session && req.session.userId && req.session.userLevel >= 100) {
        next();
    } else {
        res.statusCode = 403;
        res.end('Forbidden');
    }
}