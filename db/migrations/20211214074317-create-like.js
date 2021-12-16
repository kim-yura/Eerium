'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Likes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        references: { model:'Users', key: 'id'},
        allowNull: false,
        type: Sequelize.INTEGER
      },
      commentId: {
        references: { model:'Comments', key: 'id'},
        type: Sequelize.INTEGER
      },
      storyId: {
        references: { model:'Stories', key: 'id'},
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Likes');
  }
};
