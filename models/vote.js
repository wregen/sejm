'use strict';
module.exports = function(sequelize, DataTypes) {
  var Vote = sequelize.define('Vote', {
    no: DataTypes.INTEGER,
    time: DataTypes.STRING,
    text: DataTypes.TEXT,
    idDnia: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Vote;
};