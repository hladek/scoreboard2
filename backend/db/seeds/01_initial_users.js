const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);
  
  // Insert seed entries
  await knex('users').insert([
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      is_admin: true
    },
    {
      id: 2,
      username: 'john',
      email: 'john@example.com',
      password: userPassword,
      is_admin: false
    },
    {
      id: 3,
      username: 'jane',
      email: 'jane@example.com',
      password: userPassword,
      is_admin: false
    }
  ]);
};
