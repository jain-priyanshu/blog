const express = require("express")
const router = express.Router()
const User = require('../models/user')
const Articles = require('../models/articles')

router.get('/create', (req,res) => {
    res.render("articles/create")
})

router.post('/create', async (req, res) => {
    const user = await User.findById(req.session.userId)
    let article = new Articles({
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        username: user.username
    })
    try{
        article = await article.save()
        res.redirect('/')
    }
    catch(err){
        console.log(err)
        res.redirect('/articles/create')
    }
})

router.get('/your', async (req, res) => {
    const user = await User.findById(req.session.userId)
    const articles = await Articles.find({
        username: user.username        
    })
    try{
        res.render('articles/your', {articles:articles})
    }
    catch(err) {
        console.error(err)
        res.redirect('/')
    }
})

router.get('/show/:id', async (req, res) => {
    const article = await Articles.findById(req.params.id)
    try{
        res.render('articles/post', {article:article})
    }
    catch(err) {
        console.error(err)
        res.redirect('/')
    }
})

module.exports = router