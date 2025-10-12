
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('username').unique().notNullable();
    table.string('affiliation').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.enum('status', ['new', 'active', 'inactive']).notNullable();
    table.enum('role', ['admin', 'judge']).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
