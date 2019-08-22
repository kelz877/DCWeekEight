function checkAuthorization(req, res, next) {
    if(req.session){
        if(req.session.user){
            res.locals.authenticated = true
            next()
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }

}

module.exports = checkAuthorization