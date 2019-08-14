const express = require('express')
const router = express.Router() 
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10
const session = require('express-session')
//const Models = require('../models/models')


router.get('/', (req, res) => {
    res.render('index')
})

router.use(session({
    secret: 'dcbchtxj',
    resave: false,
    saveUninitialized: false,
}))


router.post('/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password

    db.oneOrNone('SELECT userid, username, password FROM users WHERE username = $1', [username])
    .then((user) => {
       if(user) { //check for users password
            bcrypt.compare(password, user.password, function(error, result) {
                if(result){
                    //put username and userid in the session
                    if(req.session){
                        req.session.user = {userid: user.userid, username: user.username }
                        
                    }
                    //(console.log(req.session.user))
                    res.redirect('/posts')
                } else {
                    res.render('index',{message: "Invalid username or password!"})
                }
            }) //compare entered pw with stored pw
       } else { //if user does not exist
            res.render('index',{message: "Invalid username or password!"})
       }
    })
})

router.post('/register', (req, res) => {
    
    let username = req.body.username
    let password = req.body.password
    
        //looking for a particular username in db based on the username that was provided to us
    db.oneOrNone('SELECT userid FROM users WHERE username = $1',[username])
    .then((user) => {
        //if the username already exists pass in additional data
        if(user) {
            res.render('index',{message: "User already exists!"})
        //however if the user does not exist, insert the user into the db
        }else {//db.none insert into the db and dont return anything
            bcrypt.hash(password, SALT_ROUNDS, function(error, hash){
                if (error == null) {
                    db.none('INSERT INTO users(username,password) VALUES($1,$2)', [username,hash]).then(() => {
                        res.redirect('index')
                    })
                }
            })
                
        }
    })
})

router.get('logout',(req, res) => {
    if(req.session) {
        req.session.destroy(error => {
            if(error) {
                next(error)
            }else {
                res.redirect('index')
            }
        })
    }
})

module.exports = router