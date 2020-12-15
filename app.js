const express = require('express');
const conf = require('./config/conf')
const app = express();
const hbs = require("hbs");
const passport = require("passport");
const routes = require("./routes");
const session = require('express-session');

app.set("view engine", "hbs");
hbs.registerPartials("./views/partials/");
app.use(
    session({
        secret: conf.sessionSecret,
        saveUninitialized: true,
        resave: false,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
    })
)
app.use(routes);
app.listen(8080, function() {
    console.log("Сервер ожидает подключения...");
    connectToDatabase().then(() => {
        console.log("CONNECTION PHASE ENDED");
    }).catch(e => {
        console.log("CONNECT TO DATABASE : ERROR " + e);
    });
});
const {Sequelize} = require('sequelize');
const sequelize = new Sequelize("models", "postgres", "qwerty", {
    dialect: "postgres"
})
async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
