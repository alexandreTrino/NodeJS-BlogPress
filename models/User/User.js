const Sequelize = require('sequelize')
const Connection = require('../../database/Connection')

const User = Connection.define('users',{
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

User.sync({force:false}).then(()=>{console.log('User table syncronized')})

module.exports = User