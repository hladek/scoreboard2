
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('teams').del()
    .then(function () {
      // Inserts seed entries
      return knex('teams').insert([
        {id: 1, name: 'Team 1', affiliation: 'School 1', location_id: 1},
        {id: 2, name: 'Team 2', affiliation: 'School 2', location_id: 1},
        {id: 3, name: 'Team 3', affiliation: 'School 1', location_id: 2}
      ]);
    });
};
