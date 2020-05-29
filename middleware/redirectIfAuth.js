module.exports = (req, res, next) => {
    if(req.session.userId){
        res.redirect(`/user/${req.session.userId}`)
    }
    else{
        next()
    }
}