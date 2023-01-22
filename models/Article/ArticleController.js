const express = require('express')
const { default: slugify } = require('slugify')
const router = express.Router()

const Category = require('../Category/Category')
const Article = require('./Article')

router.get('/articles/list/:page?',(req,res)=>{

    const page = req.params.page || 1
    const limit = 4
    const offset = isNaN(page) || page == 0 ? 0 : (parseInt(page)-1)*limit

    Article.findAndCountAll({
        limit: limit,
        offset: offset,
        include: [{
            model: Category,
        }]
    }).then((articles)=>{
        const next = (offset+limit) <= articles.count ? true : false
        const result = {
            next: next,
            articles: articles
        }

        //res.json(result)

        Category.findAll({raw:true}).then((categories)=>{
            res.render('admin/article/list',{
                articles: result.articles.rows,
                categories: categories,
                page: parseInt(page),
                next: result.next
            })
        })
    }).catch((error)=>{
        console.log(`Error to find Category: ${error}`)
    })
})

router.post('/admin/article/save',(req,res)=>{
    const title = req.body.title
    const body = req.body.body
    const categoryId = req.body.categoryId
    Article.create({
        title: title,
        body: body,
        slug: slugify(title).toLowerCase(),
        categoryId: categoryId
    }).then(()=>{
        res.redirect('/articles/list')
    }).catch((error)=>{
        console.log(`Error to save new article: ${error}`)
    })
})

router.get('/admin/article/:id',(req,res)=>{
    const id = req.params.id
    Article.findByPk(id).then((article)=>{
        Category.findAll({raw: true}).then((categories)=>{
            res.render('admin/article/update',{
                id: article.id,
                title: article.title,
                body: article.body,
                categoryId: article.categoryId,
                categories: categories
            })
        })
    })
})


router.post('/admin/article/update',(req,res)=>{
    const id = req.body.id
    const title = req.body.title
    const body = req.body.body
    const categoryId = req.body.categoryId
    Article.update({
        title: title,
        slug: slugify(title).toLowerCase(),
        body: body,
        categoryId: categoryId
    },{
        where: {
            id: id
        }
    }).then(()=>{
        res.redirect('/articles/list')
    }).catch((error)=>{
        console.log(`Error to update article: ${error}`)
    })
})

router.post('/admin/article/delete',(req,res)=>{
    const id = req.body.id
    Article.destroy({
        where: {
            id: id
        }
    }).then(()=>{
        res.redirect('/articles/list')
    }).catch((error)=>{
        console.log(`Error to delete article: ${error}`)
    })
})

router.get('/admin/articles/create',(req,res)=>{
    Category.findAll({raw: false}).then((categories)=>{
        res.render('admin/article/create',{
            categories: categories
        })
    }).catch((error)=>{
        console.log(`Error to find Category: ${error}`)
    })
})

module.exports = router