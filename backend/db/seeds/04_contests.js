
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('contests').del()
    .then(function () {
      // Inserts seed entries
      return knex('contests').insert([
        {id: 1, name: 'Contest 1', description: 'Description 1', max_rounds: 5, location_id: 1, status: 'new'},
        {id: 2, name: 'Contest 2', description: 'Description 2', max_rounds: 3, location_id: 1, status: 'current'},
        {id: 3, name: 'Contest 3', description: 'Description 3', max_rounds: 10, location_id: 2, status: 'passed'}
      ]);
    });
};
