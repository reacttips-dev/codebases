const _ = require('lodash');
const teams = { setTeams };

function setTeams(instance) {
	_.assignIn(teams, instance);
}

module.exports = teams;
