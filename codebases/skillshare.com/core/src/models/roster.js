

const Roster = Backbone.Model.extend({
  urlRoot: '/rosters',
}, {
  STATUS_ENROLLED: 1,
  STATUS_COMPLETED: 2,
});

export default Roster;

