const express = require("express")
const router = express.Router()
const User = require("./../models/user")
const bcrypt = require('bcrypt')
const redirectIfAuth = require('../middleware/redirectIfAuth')
const auth = require('../middleware/auth')
const Articles = require('../models/articles')

router.get('/signup', redirectIfAuth, (req,res) => {
    res.render('signup')
})

router.post('/login', redirectIfAuth,async (req,res) => {
    const user = await User.findOne({
        username: req.body.uname
    })
    try{
        if(await bcrypt.compare(req.body.pass, user.password)){
            req.session.userId = user._id
            res.redirect('/')
        }
        else{
            res.redirect('/user/login')
            console.log("wrong password")
        }
    }
    catch(err){
        console.log("No user found")
        res.redirect('/user/login')
    }
})

router.post('/signup', redirectIfAuth,async (req,res) => {
    let user = new User({
        username: req.body.uname,
        email: req.body.email,
        password: await bcrypt.hash(req.body.pass, 10)
    })
    try{
        user = await user.save()
        res.redirect('login')
    }
    catch(err){
        res.redirect("signup")
        console.error(err)
    }
})

router.get('/login', redirectIfAuth, (req,res) => {
    res.render("login")
})

router.get('/logout', (req, res) => {
    if(req.session.userId) {
        req.session.destroy(() => {
            res.redirect('/')
        })
    }
    else{
        res.redirect('/')
    }
})

router.get('/:id', auth, async (req, res) => {
    const articles =  await Articles.find().sort({
        createdAt: "desc"
    })
    res.render('home', {articles:articles})
})

module.exports = router