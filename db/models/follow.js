'use strict';
module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    creatorId: DataTypes.INTEGER,
    followerId: DataTypes.INTEGER
  }, {});
  Follow.associate = function(models) {
    // associations can be defined here
    //Follow.belongsTo(models.User, {foreignKey: 'followerId', as: 'following'})
    //Follow.belongsTo(models.User, {foreignKey: 'creatorId', as: 'follower' })
    //Follow.belongsTo(models.User)
    //Follow.hasMany(models.User)
  };
  return Follow;
};
