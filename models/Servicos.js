const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const Servicos = db.define('Servicos', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
    }
})

Servicos.belongsTo(User)
User.hasMany(Servicos)

module.exports = Servicos 