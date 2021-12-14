'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Follow, { foreignKey: 'followerId' })
    User.hasMany(models.Follow, { foreignKey: 'creatorId' })
    User.hasMany(models.Story, { foreignKey: 'userId' })
    User.hasMany(models.Comment, { foreignKey: 'userId'}),
    User.hasMany(models.Like, { foreignKey: 'userId'})
  };
  return User;
};
