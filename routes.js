
const router = require('express').Router();
const auth = require('./auth')
const fs = require('fs')
const {Sequelize} = require('sequelize');
const sequelize = new Sequelize("models", "postgres", "qwerty", {
    dialect: "postgres"
})
const user = require('./models/model')(sequelize, Sequelize);

router.use(RequestLogging)


router.get('/register', function(request, response){
    response.render("auth.hbs",{
        title: "Добро пожаловать!",
        task: "Введите имя пользователя и пароль",
        path: "/register/success",
        name: "Регистрация"
    })
})
router.get('/register/success', function (request, response){
    auth.register(request, response)
})
router.get('/auth', function(request, response){
        response.render("auth.hbs",{
        title: "Добро пожаловать!",
        task: "Введите имя пользователя и пароль",
        path: "/auth/success",
        name: "Авторизация"
    })
})

router.get('/auth/success', function(request, response){
    auth.auth(request, response)
})

router.get('/catalog', function(request, response){
    response.render("catalog.hbs", {
            title: "Добро пожаловать!",
            name: "Каталог",
            products: {
                'Тюльпан':100, 'Роза':100, 'Гвоздика':100, 'Астра':100, 'Хризантема':100, 'Ирис':100, 'Нарцисс':100, 'Ромашка':100,
            },

    })
})
router.get('/home', async function(request, response){
    if (request.session.user) {
        response.render("home.hbs", {
            name: "Anna",
            age: "20",
            university: "National Research Nuclear University MEPhI",
            users: await user.findAll()
        })
    }
    else {
        response.redirect('../auth');
    }
})
router.get('/logout', function(request, response){
    if(request.session.user) {
        delete request.session.user;
    }
    response.redirect('../auth');
})

router.get('/catalog', function(request, response){
    //ReactDOM.render(<Catalog />, document.getElementById('root'));
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
