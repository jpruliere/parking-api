const { DataTypes, Model } = require('sequelize');
const sequelize = require('./sequelizeClient');

class Parking extends Model {}

Parking.init({
  // Model attributes are defined here
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number_of_places: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Parking', // We need to choose the model name
  tableName: 'parking', // par défaut, Sequelize suit une convention qui n'est pas la nôtre, pas le choix, il faut le rectifier
  timestamps: false // par défaut, il va également considérer que des champs createdAt et updatedAt sont présents, là encore, il faut l'éduquer
});

module.exports = Parking;