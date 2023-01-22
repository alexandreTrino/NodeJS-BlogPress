const express = require('express')
const router = express.Router()
const adminAuth = require('../../middleware/adminAuth')

//slugify
const slugify = require('slugify')

//database connection
const Category = require('./Category')

//CATEGORY CREATE
router.get('/admin/category/create', adminAuth, (req,res)=>{
    Category.findAll({raw:true}).then((categories)=>{   
        res.render('admin/category/create',{
            categories: categories
        })
    })
})

//CATEGORY SAVE
router.post('/admin/category/save', adminAuth,(req,res)=>{
    const title = req.body.title
    Category.create({
        title: title,
        slug: slugify(title).toLowerCase()
    }).then(()=>{
        res.redirect('/admin/category/list')
    }).catch((error)=>{
        console.log(`Error to create Category: ${error}`)
    })
})

//CATEGORY LIST
router.get('/admin/category/list',(req,res)=>{
    Category.findAll({raw:true}).then((categories)=>{
        res.render('admin/category/list',{
            categories: categories
        })
    })
})

//CATEGORY DELETE
router.post('/admin/category/delete', adminAuth,(req,res)=>{
    const id = req.body.id
    Category.destroy({
        where: {
            id: id
        }
    }).then(()=>{
        res.redirect('/admin/category/list')
    }).catch((error)=>{
        res.end(`Error to delete category: ${error}`)
    })
})

//CATEGORY UPDATE
router.post('/admin/category/update', adminAuth,(req,res)=>{
    const title = req.body.title
    const id = req.body.id
    Category.update({
        title: title,
        slug: slugify(title).toLowerCase()
    },{
        where: {
            id: id
        }
    }).then(()=>{
        res.redirect('/admin/category/list')
    }).catch((error)=>{
        console.log(`Error to create Category: ${error}`)
    })
})

router.get('/admin/category/:id',(req,res)=>{
    const id = req.params.id
    Category.findOne({
        where: {
            id: id
        }
    }).then((category)=>{
        Category.findAll({raw:true}).then((categories)=>{
            res.render('admin/category/update',{
                category: category,
                categories: categories
            })
        })
    }).catch((error)=>{
        res.end(`Error to find category by id: ${error}`)
    })
})

module.exports = router