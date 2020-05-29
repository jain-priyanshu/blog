const User = require('../models/user')

module.exports = (req, res, next) => {
    User.findById(req.session.userId, (error, user) => {
        if(error || !user) {
            res.redirect('/')
        }
        else{
            next()
        }
    })
}