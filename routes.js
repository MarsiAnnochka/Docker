const router = require('express').Router();
const auth = require('./auth')
const fs = require('fs')
const {Sequelize} = require('sequelize');
const sequelize = new Sequelize("models", "postgres", "qwerty", {
    dialect: "postgres"
})
const user = require('./models/model')(sequelize, Sequelize);

router.use(RequestLogging)

router.post('/api/register', function(request, response){
    auth.register(request, response)
})
router.post('/api/auth', function(request, response){
    auth.auth(request, response)
})

router.post('/api/catalog', function(request, response){
    if (request.body.result){
        auth.changeBasket(request, response)
    }
    else {
        auth.checkSession(request, response)
    }
})
router.post('/api/home', function(request, response){
    if (request.body.change){
        auth.changeCash(request, response)
    }
    else {
        auth.checkSession(request, response)
    }
})
router.post('/api/logout', function(request, response){
    if(request.session.user) {
        delete request.session.user;
    }
})


router.use(function (request, response,  next){
    let err = new Error()
    err.statusCode = 404;
    err.name = "Not Found"
    ErrorsLogging(request,response,err)
})
function RequestLogging(req,res,next){
    console.log('%s',req.method + '  ' + req.url + '  ' + (new Date()).toUTCString())
    next()
}

function ErrorsLogging(req,res,err){
    fs.appendFile('./ErrorLogging.txt', err.statusCode + '  ' + err.name + '  ' + req.method + '  ' + req.url + '  ' + (new Date()).toUTCString() + "\n", (err) =>{
        res.send('<h2>ERROR!</h2>')
    })
}
module.exports = router;
