const Sequelize = require('sequelize');

const connection = new Sequelize('dinopress', 'dino', 'Btz85y7i.', {
   host: 'localhost',
   dialect: 'mysql',
   timezone: '-03:00'
});

module.exports = connection;