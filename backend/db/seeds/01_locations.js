
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('locations').del()
    .then(function () {
      // Inserts seed entries
      return knex('locations').insert([
        {id: 1, name: 'Location 1', date: new Date(), status: 'new'},
        {id: 2, name: 'Location 2', date: new Date(), status: 'current'},
        {id: 3, name: 'Location 3', date: new Date(), status: 'passed'}
      ]);
    });
};
