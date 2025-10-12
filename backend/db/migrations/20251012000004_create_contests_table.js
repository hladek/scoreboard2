
exports.up = function(knex) {
  return knex.schema.createTable('contests', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.integer('max_rounds').notNullable();
    table.integer('location_id').unsigned().references('id').inTable('locations');
    table.enum('status', ['new', 'current', 'passed', 'deleted']).notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('contests');
};
