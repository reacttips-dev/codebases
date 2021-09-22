const _ = require('lodash');
const Pipedrive = require('pipedrive');
const { refetchNote } = require('utils/apply-mention-styles-to-note');

module.exports = Pipedrive.Model.extend({
	type: 'note',

	allowDirectSync: true,

	readonly: ['last_update_user_id'],

	initialize: function() {
		const bindUpdate = function() {
			const updateEventName = `${this.type}.model.${this.get('id')}.update`;
			const addEventName = `${this.type}.model.${this.get('id')}.add`;

			app.global.bind(updateEventName, _.debounce(this.updateNoteFromSocket, 500), this);
			app.global.bind(addEventName, this.addEventFromSocket, this);
		};

		if (this.isNew()) {
			this.once('sync', bindUpdate);
		} else if (this.type) {
			bindUpdate.call(this);
		}
	},

	updateNoteFromSocket: function(model) {
		refetchNote(model, () => {
			this.eventFromSocket(model);
		});
	},

	url: function() {
		if (!this.get('id')) {
			return `${app.config.api}/notes`;
		}

		return `${app.config.api}/notes/${this.get('id')}`;
	}
});
