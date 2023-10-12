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
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories});
        });
    });
});

app.get('/:slug', (req, res) => {
    const {slug} = req.params;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render('article', {article: article, categories: categories});
            });
        } else {
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    });
});

app.get('/categories/:slug', (req, res) => {
    const {slug} = req.params;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{
            model: Article
        }]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories});
            });
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    });
});

app.listen(8080, () => {
    console.log('app is listen on port 8080');
});
