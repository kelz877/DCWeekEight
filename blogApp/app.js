const express = require('express')
const mustacheExpress = require('mustache-express')
const app = express()
const path = require('path')
const Blog = require('./models/blog')
//const blogRoutes = require('./routes/blogs')
//const session = require('express-session')

app.use(express.urlencoded())
app.use(express.json())

var pgp = require('pg-promise')();
var connectionString = 'postgres://localhost:5432/personalblog';
var db = pgp(connectionString);

app.use(express.static('static'))
//app.use('/blogs', blogRoutes)

const VIEWS_PATH = path.join(__dirname, '/views')

//global.blogPosts =[]

app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))

app.set('views', VIEWS_PATH)
app.set('view engine', 'mustache')

app.get('/', (req, res) => {
    
    res.render('index')
})


app.get('/updatePost', async(req, res) => {
    let blogPosts = await db.any('SELECT blogid,title,subject,body,author,date FROM blogposts ORDER BY blogid DESC;')
    res.render('updatePost', {blogPosts: blogPosts})
})

app.post('/update-content', (req, res) => {

    let title = req.body.title
    let subject = req.body.subject
    let body = req.body.description
    let author = req.body.author
    let blogid = req.body.blogid

    db.none('UPDATE blogposts SET title = $1, subject = $2, body = $3, author = $4 WHERE blogid= $5' ,[title, subject, body, author,blogid])
    .then(() => {
        res.redirect('updatePost')
    })
})

app.get('/posts/edit/:blogid', (req, res) => {
    let blogid = req.params.blogid

    db.one('SELECT blogid, title, subject, body, author, date FROM blogposts WHERE blogid = $1', [blogid]).then((blog) => {
        res.render('updateContent', blog)
    })
})


app.get('/createPost', async(req, res) => {
    let blogPosts = await db.any('SELECT blogid,title,subject,body,author,date FROM blogposts ORDER BY blogid DESC;')
    res.render('createPost', {blogPosts: blogPosts})
})

app.post('/add-post', (req, res) =>{
    let title = req.body.title
    let subject = req.body.subject
    let body = req.body.description
    let author = req.body.author

    db.none('INSERT INTO blogposts(title, subject, body, author) VALUES($1, $2, $3, $4)', [title, subject, body, author]).then(() =>{
        res.redirect('/createPost')
    })
})

app.post('/delete-post', (req, res) =>{
    let blogPost = req.body.blogPost
    db.none('DELETE FROM blogposts WHERE blogid = $1',[blogPost]).then(() =>{
    res.redirect('/createPost')        
    })


})












app.listen(3000, () => {
    console.log("server is running successfully")
})