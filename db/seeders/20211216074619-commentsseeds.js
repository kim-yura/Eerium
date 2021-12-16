'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
      return queryInterface.bulkInsert('Comments', [{
        id: 1,
        storyId: 1,
        userId: 9999,
        content: `comment 1 for testing`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        storyId: 1,
        userId: 9999,
        content:`comment 2 for testing`,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
      return queryInterface.bulkDelete('Comments', null, {});
  }
};
