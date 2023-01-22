const Sequelize = require('sequelize')
const Connection = require('../../database/Connection')

const Category = require('../Category/Category')

const Article = Connection.define('Articles',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article)
Article.belongsTo(Category)

Article.sync({force: false}).then(()=>{
    console.log('Articles table syncronized!')
})

module.exports = Article