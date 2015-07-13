'use strict';
module.exports = function(sequelize, DataTypes) {
  var Day = sequelize.define('Day', {
    nrPosiedzenia: DataTypes.INTEGER,
    idDnia: DataTypes.INTEGER,
    date: DataTypes.DATE,
    liczbaGlosowan: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Day;
};