const bcrypt = require('bcryptjs');



exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  const hashed_password = await bcrypt.hash('password', 10);
  await knex('users').insert([
        {id: 1, username: 'admin', affiliation: 'N/A', email: 'admin@example.com', password: hashed_password, role: 'admin'},
        {id: 2, username: 'judge1', affiliation: 'School 1', email: 'judge1@example.com', password: hashed_password, role: 'judge'},
        {id: 3, username: 'judge2', affiliation: 'School 2', email: 'judge2@example.com', password: hashed_password, role: 'judge'}
      ]);
};
