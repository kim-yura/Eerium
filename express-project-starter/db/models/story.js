'use strict';
module.exports = (sequelize, DataTypes) => {
  const Story = sequelize.define('Story', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    category: DataTypes.STRING,
    content: DataTypes.STRING
  }, {});
  Story.associate = function(models) {
    // associations can be defined here
    Story.belongsTo(models.User, { foreignKey: 'userId' })
    Story.hasMany(models.Comment, { foreignKey: 'storyId' })
  };
  return Story;
};
