const express = require('express');
const conf = require('./config/conf')
const app = express();
const hbs = require("hbs");
const passport = require("passport");
const routes = require("./routes");
const bodyParser = require('body-parser')
const session = require('express-session');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

let result = 0;
let counts = [0,0,0,0,0,0,0,0]
//const images = [img1, img2, img3, img4, img5, img6, img7, img8]
const products = [
    'Тюльпан','Роза','Гвоздика','Астра','Хризантема','Ирис','Нарцисс','Ромашка'
]
const prices = [100, 70, 70, 138, 99, 80, 200, 100]
app.set("view engine", "hbs");
hbs.registerPartials("./views/partials/");
hbs.registerHelper('renderProduct', (index) => {
    let string = "<div class='product-img' style='height: 300px'><img src=";
    //string += images[index];
    string += "'https://st29.stpulscen.ru/images/product/256/778/708_big.jpg'"
    string += "alt=''></img></div><p class='product-title'>";
    string += products[index];
    string += "</p> <p class='product-price' style='left: 0; position: absolute;width: 100%;color: #d51e08;font-size: 20px;font-weight: 500;'>";
    string += prices[index];
    string += " руб/шт</p>"
    return new hbs.SafeString(string)
})

hbs.registerHelper('onClick', () => {
    let newResult = result;
    for (let i=0; i<8; i++)
        newResult += prices[i]
    result=newResult
})
hbs.registerHelper('getResult', () => {
    return result
})
/*
hbs.registerHelper('onChange', (event) => {
    let deltaValue = event.target.value - counts[event.target.name]
    result+= prices[event.target.name]*deltaValue
    counts[event.target.name]=event.target.value
})*/
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
