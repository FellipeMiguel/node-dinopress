const express = require('express');
const Category = require("../categories/Category");
const router = express.Router();
const Article = require('./Article');
const slugify = require('slugify');

router.get('/admin/articles', (req, res) => {
    res.send('rotas de artigo');
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
    })
})

module.exports = router;