
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('contest_rounds').del()
    .then(function () {
      // Inserts seed entries
      return knex('contest_rounds').insert([
        {id: 1, time: 10.5, points: 100, judge_notes: 'Good job', round_number: 1, contest_id: 1, team_id: 1},
        {id: 2, time: 12.3, points: 90, judge_notes: 'Could be faster', round_number: 2, contest_id: 1, team_id: 1},
        {id: 3, time: 9.8, points: 110, judge_notes: 'Excellent', round_number: 1, contest_id: 2, team_id: 2}
      ]);
    });
};
