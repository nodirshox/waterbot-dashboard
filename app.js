require('dotenv').config(); // Getting token from env
const express = require('express')
var path = require('path')
var serveStatic = require('serve-static')
const app = express()
app.use(serveStatic(path.join(__dirname, 'dist')))
var bodyParser = require('body-parser')
const router = require('./router')

app.use(bodyParser.urlencoded({ extended: true }));

const password = process.env.PW
function passwordProtected(req, res, next) {
    res.set('WWW-Authenticate', 'Basic realm="Dashboard"')
    //console.log(req.headers.authorization)
    if(req.headers.authorization == password){
      next()
    } else {
      res.status(401).send("Authenticated required")
    }
  }
  
  app.use(passwordProtected)


app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)

module.exports = app