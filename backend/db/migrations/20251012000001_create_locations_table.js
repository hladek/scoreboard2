
exports.up = function(knex) {
  return knex.schema.createTable('locations', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.dateTime('date').notNullable();
    table.enum('status', ['new', 'current', 'passed', 'deleted']).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('locations');
};
