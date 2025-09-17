const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,       // nome do banco
  process.env.DB_USER,       // usuário
  process.env.DB_PASSWORD,   // senha
  {
    host: process.env.DB_HOST, // host do banco
    dialect: 'mysql',          // ou 'postgres'
    logging: false
  }
);

module.exports = sequelize;
