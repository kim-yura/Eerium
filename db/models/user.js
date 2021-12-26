'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  User.associate = function(models) {

    const columnMappingOne = { // User -> User, through Follow as follower
      through: 'Follow',
      otherKey: 'creatorId',
      foreignKey: 'followerId',
      as: 'followings'
    }
    const columnMappingTwo = { // User -> User, through Follow as following
        through: 'Follow',
        otherKey: 'followerId',
        foreignKey: 'creatorId',
        as: 'followers'
    }
    User.belongsToMany(models.User, columnMappingOne);
    User.belongsToMany(models.User, columnMappingTwo);
    //User.hasMany(models.Follow, { foreignKey: 'followerId', as: 'following'})
    //User.hasMany(models.Follow)
    //User.hasMany(models.Follow, { foreignKey: 'creatorId'})
    // User.hasMany(models.Follow, { foreignKey: 'followerId'})
    User.hasMany(models.Story, { foreignKey: 'userId' })
    User.hasMany(models.Comment, { foreignKey: 'userId'})
    User.hasMany(models.Like, { foreignKey: 'userId'})
  };
  return User;
};
