const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');

// Controllers
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

// Models
const Category = require('./categories/Category');
const Article = require('./articles/Article');

// View engine
app.set('view engine', 'ejs');

// Static
app.use(express.static('public'));

// Body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Database
connection.authenticate().then(() => {
    console.log('Succeffuly connection with database');
}).catch(err => {
    console.log(err)
});

// Rotas
app.use('/', categoriesController);
app.use('/', articlesController);

app.get("/", (req, res) => {
    res.render('index');
});

app.listen(8080, () => {
    console.log('app is listen on port 8080');
});
