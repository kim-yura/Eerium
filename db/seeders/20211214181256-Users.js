'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkInsert('Users', [
      {
      id: 9999,
      username: 'DemoDave',
      hashedPassword: '$2a$12$brsi1a4OJ0yNWU9WIirNvOzGldr0mTsr04kf772H9hUSW10VwYPr6',
      // pw: Password@123
      email: 'dave@dave.com',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 10000,
      username: 'MothmanMark',
      hashedPassword: '$2a$12$brsi1a4OJ0yNWU9WIirNvOzGldr0mTsr04kf772H9hUSW10VwYPr6',
      email: 'moth@moth.com',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 20000,
      username: 'Emma',
      hashedPassword: '$2a$12$brsi1a4OJ0yNWU9WIirNvOzGldr0mTsr04kf772H9hUSW10VwYPr6',
      email: 'emma@emma.com',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 30000,
      username: 'James',
      hashedPassword: '$2a$12$brsi1a4OJ0yNWU9WIirNvOzGldr0mTsr04kf772H9hUSW10VwYPr6',
      email: 'james@james.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkDelete('Users', null, {});
  }
};
