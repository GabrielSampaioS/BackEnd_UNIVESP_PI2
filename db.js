const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bar_filo', 'usuario', 'senha', {
  host: 'localhost',
  dialect: 'mysql', // ou 'postgres'
  logging: false
});

module.exports = sequelize;
