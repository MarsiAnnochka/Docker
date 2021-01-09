const Sequelize = require('sequelize');
const sequelize = new Sequelize("models", "postgres", "qwerty", {
    dialect: "postgres"
})
const user = require('./models/model')(sequelize, Sequelize);
const bcrypt = require('bcrypt')

module.exports.register = function register(request, response) {
    let username = request.body.username || ''
    let password = request.body.password || ''
    if (username && password) {
        user.findOne({where: {username: username}}).then( (User) => {
                if (!User) {
                    hash(user.build({username: username, password: password}), (err) => {
                        if (err) throw err
                    })
                    if(request.session.user) {
                        delete request.session.user;
                    }
                    request.session.user = {username: username}
                    response.send({message: 'ok', error: false})
                } else {
                    response.send({message:'Пользователь с таким именем уже существует!', error: true});
                }
        })
            .catch((err)=>{
                throw err;
            });
    } else {
        return response.send({message:'Введите имя пользователя и пароль!', error: true});
    }
};

module.exports.auth = function auth(request, response) {

    let username = request.body.username || ''
    let password = request.body.password || ''
    if (username && password) {
        user.findOne({where: {username: username}}).then( (User) => {
                if (!User) {
                    response.send({message:'Пользователя с таким именем не существует!', error: true})
                } else {
                    comparePasswd(User, password, (error, isMatch) => {
                        if (isMatch && !error) {
                            request.session.user = {username: username}
                            response.send({error: false, message: 'ok'})
                        } else {
                            response.send({message: 'Неверный пароль!', error: true});
                        }
                    });
                }
        })
            .catch((err)=>{
                throw err;
            });
    } else {
        response.send({message:'Введите имя пользователя и пароль!', error: true})
    }
};

module.exports.checkSession = function checkSession(request, response){
    if (request.session.user) {
        user.findOne({where: {username: request.session.user.username}}).then( (User) => {
                let cash = User.dataValues.cash
                let basket = User.dataValues.basket
                response.send({logged: true, cash: cash, basket: basket})
            }
        ).catch((err)=>{
            throw err;
        });
    }
    else {
        response.send({logged: false})
    }
}

module.exports.changeBasket = function changeBasket(request, response){
        user.update({basket: request.body.result},{where: {username: request.session.user.username}})
        .catch((err)=>{
            throw err;
        });
}

module.exports.changeCash = function changeCash(request, response){
    user.update({cash: request.body.change, basket:0},{where: {username: request.session.user.username}})
        .catch((err)=>{
            throw err;
        });
}

module.exports.getBasket = function getBasket(request, response){
    user.findOne({where: {username: request.session.user.username}}).then( (User) => {
            let basket = User.dataValues.basket
            response.send({logged: true, cash: basket})
        }
    ).catch((err)=>{
        throw err;
    });
}

function hash(User, next) {
    bcrypt.genSalt(10, function (error, salt) {
        if (error) next(error)
        bcrypt.hash(User.password, salt, function (err, hash) {
            if (err) next(err)
            User.password = hash
            User.save()
        })
    });
    next()
}

function comparePasswd(User, password, cb) {
    bcrypt.compare(password, User.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
}
