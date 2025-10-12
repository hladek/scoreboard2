let scores = {
    team1: 0,
    team2: 0
};

// Initial prompt handlers
document.getElementById('start-btn').addEventListener('click', function() {
    document.getElementById('welcome-prompt').classList.add('hidden');
    document.getElementById('scoreboard').classList.remove('hidden');
});

// Setup handlers
document.getElementById('setup-btn').addEventListener('click', function() {
    const team1Name = document.getElementById('team1-name').value.trim() || 'Team 1';
    const team2Name = document.getElementById('team2-name').value.trim() || 'Team 2';
    
    document.getElementById('team1-display').textContent = team1Name;
    document.getElementById('team2-display').textContent = team2Name;
    
    document.querySelector('.setup-section').classList.add('hidden');
    document.getElementById('score-section').classList.remove('hidden');
});

// Score update function
function updateScore(team, delta) {
    if (team === 1) {
        scores.team1 = Math.max(0, scores.team1 + delta);
        document.getElementById('score1').textContent = scores.team1;
    } else if (team === 2) {
        scores.team2 = Math.max(0, scores.team2 + delta);
        document.getElementById('score2').textContent = scores.team2;
    }
}

// Reset scores
document.getElementById('reset-btn').addEventListener('click', function() {
    if (confirm('Are you sure you want to reset the scores?')) {
        scores.team1 = 0;
        scores.team2 = 0;
        document.getElementById('score1').textContent = '0';
        document.getElementById('score2').textContent = '0';
    }
});

// New game
document.getElementById('new-game-btn').addEventListener('click', function() {
    if (confirm('Start a new game? This will reset everything.')) {
        scores.team1 = 0;
        scores.team2 = 0;
        document.getElementById('score1').textContent = '0';
        document.getElementById('score2').textContent = '0';
        document.getElementById('team1-name').value = 'Team 1';
        document.getElementById('team2-name').value = 'Team 2';
        document.getElementById('score-section').classList.add('hidden');
        document.querySelector('.setup-section').classList.remove('hidden');
    }
});
