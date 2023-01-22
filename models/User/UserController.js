const express = require('express')
const router = express.Router()

const Category = require('../Category/Category')
const User = require('./User')

const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)


router.get('/login/:error?',(req,res)=>{
    const error = req.params.error || 0
    Category.findAll().then((categories)=>{
        res.render('admin/user/login',{
            categories: categories,
            error: error
        })
    })
})

router.post('/authenticate',(req,res)=>{
    const email = req.body.email
    const password = req.body.password
    User.findOne({
        where: {
            email: email
        }
    }).then((user)=>{
        const correct = bcrypt.compareSync(password, user.password)
        if(correct){
            req.session.user = {
                id: user.id,
                email: user.email
            }
            //res.json(req.session.user)
            res.redirect('/')
        }else{
            res.redirect('/login/error')
        } 
    }).catch((error)=>{
        console.log(`Error to find this login email: ${error}`)
    })
})

router.get('/admin/user/register/:error?',(req,res)=>{

    const error = req.params.error || 0

    Category.findAll({raw: true}).then((categories)=>{
        res.render('admin/user/create',{
            categories: categories,
            error: error
        })
    })
})

router.get('/admin/user/list',(req,res)=>{
    User.findAll().then((users)=>{
        //res.json(users)
        Category.findAll({raw: true}).then((categories)=>{
            res.render('admin/user/list',{
                users: users,
                categories: categories
            })
        })
    })
})

router.post('/save-user',(req,res)=>{
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    User.findOne({
        where: {
            email: email
        }
    }).then((user)=>{
        
        if(user == null){
            var hash = bcrypt.hashSync(password, salt)
            User.create({
                name: name,
                email: email,
                password: hash
            }).then(()=>{
                //res.json({name, email, password})
                res.redirect('/login')
            }).catch((error)=>{
                console.log(`Error to register User: ${error}`)
            })
        }else{
            res.redirect('/admin/user/register/error')
        }

    }).catch((error)=>{
        console.log(`Error to create user: ${error}`)
    })
})

module.exports = router