// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
const _ = require('underscore');
const { newPowerUps } = require('app/scripts/data/new-power-ups');

const latestDate = _.chain(newPowerUps).values().max().value();

module.exports.latestPowerUpsMessage =
  latestDate > Date.now()
    ? `NewPowerUps_${latestDate.toISOString().substr(0, 10)}`
    : undefined;
