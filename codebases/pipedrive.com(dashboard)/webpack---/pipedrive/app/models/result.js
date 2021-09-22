const Pipedrive = require('pipedrive');
const l10n = require('l10n');

module.exports = Pipedrive.Model.extend({
	idAttribute: '_id',
	defaults: function() {
		return {
			id: 0,
			name: 'N/A',
			title: 'N/A',
			done: false
		};
	},

	initialize: function() {
		if (!this.get('type')) {
			this.set({ type: this.defaults.type });
		}

		if (!this.get('title') || this.get('title') === 'N/A') {
			this.set({ title: this.getTitle() });
		}
	},

	getTitle: function() {
		return this.get('name') || this.get('person_name') || this.get('org_name');
	},

	toggle: function() {
		this.save({ done: !this.get('done') });
	},

	clear: function() {
		this.destroy();
	},

	bindView: function(view) {
		this.view = view;
	},

	getFormattedStatus: function() {
		switch (this.get('status')) {
			case 'won':
				return l10n.gettext('Won');
			case 'lost':
				return l10n.gettext('Lost');
			case 'deleted':
				return l10n.gettext('Deleted');
			case 'open':
				return l10n.gettext('Open');
			default:
				return status || '';
		}
	}
});
