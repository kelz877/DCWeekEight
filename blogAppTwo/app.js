const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const path = require('path')
const userRoutes = require('./routes/posts')
const indexRoutes = require('./routes/index')
const session = require('express-session')
const checkAuthorization = require('./utils/authorization')
//const Models = require('./models/models')
app.use(express.urlencoded())

var pgp = require('pg-promise')();
var connectionString = 'postgres://xktovaan:5oDFhlm3WGlhaXCczdnihoF5Rg7SVhyY@raja.db.elephantsql.com:5432/xktovaan'
db = pgp(connectionString);

//must be in front of routes so routes can use
app.use(session({
    secret: 'dcbchtxj',
    resave: false,
    saveUninitialized: false,
}))

app.use((req, res, next) => {
    res.locals.authenticated = req.session.user == null ? false : true
    next()
})

app.use(express.static('static'))
//where should the user go when they activate the routes?
app.use('/', indexRoutes)
app.use('/posts', checkAuthorization, userRoutes)

 

app.use(express.json())

const VIEWS_PATH = path.join(__dirname, '/views')

app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'))


//pages are located in the views directory
app.set('views', VIEWS_PATH)
//file extensions will be in mustache
app.set('view engine', 'mustache')


app.listen(3000, () =>{
    console.log("Server is running successfully!")
})

