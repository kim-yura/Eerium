'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    storyId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    content: DataTypes.STRING
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.Story, { foreignKey: 'storyId' })
    Comment.belongsTo(models.User, { foreignKey: 'userId'} )
    Comment.hasMany(models.Like, { foreignKey: 'commentId' })
  };
  return Comment;
};
