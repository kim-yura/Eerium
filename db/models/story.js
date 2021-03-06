'use strict';
module.exports = (sequelize, DataTypes) => {
  const Story = sequelize.define('Story', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    category: DataTypes.STRING,
    content: DataTypes.STRING(65535)
  }, {});
  Story.associate = function(models) {
    // associations can be defined here
    Story.belongsTo(models.User, { foreignKey: 'userId' })
    Story.hasMany(models.Comment, { foreignKey: 'storyId' }),
    Story.hasMany(models.Like, { foreignKey: 'storyId' })
  };
  return Story;
};
