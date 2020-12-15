const Sequelize = require('sequelize');
const sequelize = new Sequelize("models", "postgres", "qwerty", {
    dialect: "postgres"
})
const user = require('./models/model')(sequelize, Sequelize);
const bcrypt = require('bcrypt')

module.exports.register = function register(request, response) {
    let username = request.query.username
    let password = request.query.password
    if (username && password) {
        user.findOne({where: {username: username}}).then( (User) => {
                if (!User) {
                    hash(user.build({username: username, password: password}), (err) => {
                        if (err) throw err
                    })
                    if(request.session.user) {
                        delete request.session.user;
                    }
                    response.redirect('/auth')
                } else {
                    response.send('Пользователь с таким именем уже существует!');
                }
        })
            .catch((err)=>{
                throw err;
            });
    } else {
        return response.send('Введите имя пользователя и пароль!');
    }
};

module.exports.auth = function auth(request, response) {
    let username = request.query.username || ''
    let password = request.query.password || ''
    if (username && password) {
        user.findOne({where: {username: username}}).then( (User) => {
                if (!User) {
                    response.send('Пользователя с таким именем не существует!')
                } else {
                    comparePasswd(User, password, (error, isMatch) => {
                        if (isMatch && !error) {
                            request.session.user = {username: username}
                            response.redirect('../home')
                        } else {
                            response.send('Неверный пароль!');
                        }
                    });
                }
        })
            .catch((err)=>{
                throw err;
            });
    } else {
        return response.send('Введите имя пользователя и пароль!')
    }
};

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
