
exports.up = function(knex) {
  return knex.schema.createTable('rounds', function(table) {
    table.increments('id').primary();
    table.float('time');
    table.float('points');
    table.string('judge_notes');
    table.integer('round_number').notNullable();
    table.integer('contest_id').unsigned().references('id').inTable('contests');
    table.integer('team_id').unsigned().references('id').inTable('teams');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('rounds');
};
