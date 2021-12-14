'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    creatorId: DataTypes.INTEGER,
    followerId: DataTypes.INTEGER
  }, {});
  Follow.associate = function(models) {
    // associations can be defined here
    Follow.belongsTo(models.User, { foreignKey: 'followerId' }),
    Follow.belongsTo(models.User, { foreignKey: 'creatorId' })
  };
  return Follow;
};
