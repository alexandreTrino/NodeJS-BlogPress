const Sequelize = require('sequelize')
const Connection = require('../../database/Connection')

const Category = Connection.define('categories',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

Category.sync({force: false}).then(()=>{
    console.log('Category table syncronized!')
})

module.exports = Category