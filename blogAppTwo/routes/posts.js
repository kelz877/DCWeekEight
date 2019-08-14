//const session = require('express-session')
const express = require('express')
const router = express.Router()
//const Models = require('../models/models')


router.get('/', async(req, res) => {
    let blogPosts = await db.any('SELECT blogid, title, subject, description, author, date FROM posts ORDER BY blogid DESC;')
    res.render('posts', {blogPosts: blogPosts})
})
users = []
//71 7 mins sort articles by user 
router.post('/add-post', (req, res) =>{
    let title = req.body.title
    let subject = req.body.subject
    let description = req.body.description
    let author = req.body.author
    let userid = req.session.user.userid

    db.none('INSERT INTO posts(title, subject, description, author, userid) VALUES($1, $2, $3, $4, $5)', [title, subject, description, author, userid]).then(() =>{
        res.redirect('/posts')
    })
})

router.get('/updatePost', async(req, res) => {
    let blogPosts = await db.any('SELECT blogid,title,subject,description,author,date, userid FROM posts ORDER BY blogid DESC;')
    res.render('updatePost', {blogPosts: blogPosts})
})


router.post('/delete-post', (req, res) =>{
    let blogPost = req.body.blogPost

    db.none('DELETE FROM posts WHERE blogid = $1',[blogPost]).then(() =>{
    res.redirect('/posts')        
    })
})


router.post('/update-content', (req, res) => {

    let title = req.body.title
    let subject = req.body.subject
    let description = req.body.description
    let author = req.body.author
    let blogid = req.body.blogid

    db.none('UPDATE posts SET title = $1, subject = $2, description = $3, author = $4 WHERE blogid= $5' ,[title, subject, description, author,blogid])
    .then(() => {
        res.redirect('updatePost')
    })
})


router.get('/edit/:blogid', (req, res) => {
    let blogid = req.params.blogid

    db.one('SELECT blogid, title, subject, description, author, date FROM posts WHERE blogid = $1', [blogid]).then((blog) => {
        res.render('updateContent', blog)
    })
})




module.exports = router

