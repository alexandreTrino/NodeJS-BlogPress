const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//database connection
const Connection = require('./database/connection')

//init session
app.use(session({
    secret: 'qqcoisa',
    cookie: {
        maxAge: 30000
    }
}))

Connection
    .authenticate().then(()=>{
        console.log('Connected into database!')
    }).catch((error)=>{
        console.log(`Error to connect into database: ${error}`)
    })

//Category Model
const Category = require('./models/Category/Category')
const CategoryController = require('./models/Category/CategoryController')

//Article Model
const Article = require('./models/Article/Article')
const ArticleController = require('./models/Article/ArticleController')

//User Model
const User = require('./models/User/User')
const UserController = require('./models/User/UserController')

// html render config
app.set('view engine', 'ejs')

//files directory config
app.use(express.static('public'))

//Homepage route
app.get('/',(req,res)=>{
    Article.findAll({
        limit: 4,
        order: [ ['createdAt', 'DESC'] ]
    }).then((articles)=>{
        Category.findAll({raw:true}).then((categories)=>{
            res.render('index', {
                articles: articles,
                categories: categories
            })
        })
    })
})

//Category Page
app.use('/', CategoryController)

//Article Page
app.use('/', ArticleController)

//User Page
app.use('/', UserController)

//Running Servet at:
app.listen(8080, (error)=>{
    if(error){
        console.log(`Error to start server`)
    }else{
        console.log('Server Running!')
    }
})

app.get('/:slug',(req,res)=>{
    const slug = req.params.slug
    Article.findOne({
        where:{
            slug: slug
        }
    },{
        include: {
            model: [{Category}]
        }
    }).then((article)=>{
        if(article != undefined){
            Category.findAll().then((categoryList)=>{
                res.render('article-view', {
                    title: article.title,
                    body: article.body,
                    category: article.categoryId,
                    categories: categoryList
                })
            })
        }
    })
})

app.get('/category/:slug',(req,res)=>{
    const slug = req.params.slug
    Category.findOne({
        where:{
            slug: slug
        },
        include: [{model: Article}]
    }).then((category)=>{
        Category.findAll().then((categories)=>{
            res.render('search',{
                articles: category.Articles,
                categories: categories,
                category: category
            })
        })
    })
})