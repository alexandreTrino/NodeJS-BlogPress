const Sequelize = require('sequelize')

const Connection = new Sequelize('blogpress','root','123456',{
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})

module.exports = Connection