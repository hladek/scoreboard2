
exports.up = function(knex) {
  return knex.schema.createTable('teams', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('affiliation').notNullable();
    table.integer('location_id').unsigned().references('id').inTable('locations');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('teams');
};
