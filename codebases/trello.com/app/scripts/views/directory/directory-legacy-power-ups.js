// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
const CalendarSettingsView = require('app/scripts/views/power-ups/calendar-settings-view');
const CardAgingSettingsView = require('app/scripts/views/power-ups/card-aging-settings-view');
const { LegacyPowerUps } = require('app/scripts/data/legacy-power-ups');
const VotingSettingsView = require('app/scripts/views/power-ups/voting-settings-view');

module.exports = [
  {
    name: 'voting',
    settingsView(model) {
      return new VotingSettingsView({ model });
    },
    id: LegacyPowerUps.voting,
  },
  {
    name: 'cardAging',
    settingsView(model) {
      return new CardAgingSettingsView({ model });
    },
    id: LegacyPowerUps.cardAging,
  },
  {
    name: 'calendar',
    settingsView(model) {
      return new CalendarSettingsView({ model });
    },
    id: LegacyPowerUps.calendar,
  },
];
