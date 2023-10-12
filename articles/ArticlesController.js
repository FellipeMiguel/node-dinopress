const express = require('express');
const Category = require("../categories/Category");
const router = express.Router();
const Article = require('./Article');
const slugify = require('slugify');
const Categoty = require("../categories/Category");

router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render('admin/articles/index', {articles: articles});
    });
});

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories});
    });
});

// Salvando artigo no banco de dados
router.post('/articles/save', (req, res) => {
    const {title, body, category} = req.body;

    Article.create({
        title: title,
        slug: slugify(title).toLowerCase(),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles')
    });
});

router.post('/articles/delete', (req, res) => {
    const id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles');
            });
        } else {
            res.redirect('/admin/articles');
        }
    } else {
        res.redirect('/admin/articles');
    }
});

router.get('/admin/articles/edit/:id', (req, res) => {
    const {id} = req.params;
    Article.findByPk(id).then(article => {
        if (article != undefined) {
            Categoty.findAll().then(categories => {
                res.render('admin/articles/edit', {categories: categories, article: article});
            });
        } else {
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    });
});

router.post('/articles/update', (req, res) => {
   const {id, title, body, category} = req.body;

   Article.update({title: title, body: body, categoryId: category, slug: slugify(title).toLowerCase()},{
       where: {
           id: id
       }
   }).then(() => {
       res.redirect('/admin/articles');
   }).catch(err => {
       res.redirect('/');
   });
});

module.exports = router;