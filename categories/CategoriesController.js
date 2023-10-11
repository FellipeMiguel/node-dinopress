const express = require('express');
const router = express.Router();
const Categoty = require('./Category');
const slugify = require('slugify');

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new');
});

router.post('/categories/save', (req, res) => {
    const title = req.body.title;
    if(title != undefined) {
        Categoty.create({
            title: title,
            slug: slugify(title).toLowerCase()
        }).then(() => {
            res.redirect('/admin/categories');
        })
    } else {
        res.redirect('/admin/categories/new');
    }
});

router.get('/admin/categories', (req, res) => {
    Categoty.findAll().then(categories => {
        res.render('admin/categories/index', {categories: categories});
    });
});

router.post('/categories/delete', (req, res) => {
    const id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            Categoty.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/categories');
            });
        } else {
            res.redirect('/admin/categories');
        }
    } else {
        res.redirect('/admin/categories');
    }
});

router.get('/admin/categories/edit/:id', (req, res) => {
    const id = req.params.id;

    if(isNaN(id)) {
        res.redirect('/admin/categories');
    }

   Categoty.findByPk(id).then(category => {
       if(category != undefined) {
            res.render('admin/categories/edit', {category: category})
       }else {
           res.redirect('/admin/categories');
       }
   }).catch(err => {
       res.redirect('/admin/categories');
   });
});

router.post('/categories/update', (req, res) => {
   const id = req.body.id;
   const title = req.body.title;

   Categoty.update({title: title, slug: slugify(title).toLowerCase()}, {
       where: {
           id: id
       }
   }).then(() => {
       res.redirect('/admin/categories');
   });
});

module.exports = router;