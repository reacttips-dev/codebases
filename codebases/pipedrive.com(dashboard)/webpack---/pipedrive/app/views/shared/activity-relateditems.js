const _ = require('lodash');
const RelatedItemsView = require('views/shared/relateditems');
const Template = require('templates/shared/activity-relateditems.html');

/**
 * Activity RelatedItems View
 *
 */

module.exports = RelatedItemsView.extend({
	template: _.template(Template),

	bindOnChangeEvents: function() {
		this.model.onChange('org_id org_name participants deal_id deal_title', this.render, this);
	},

	getActivityParticipants: function getActivityParticipants() {
		const primaryParticipant = this.getPrimaryParticipant();
		const participants = this.getSecondaryParticipants();

		if (primaryParticipant) {
			participants.unshift(primaryParticipant);
		}

		return participants;
	},
	getPrimaryParticipant: function getMainParticipantInfo() {
		const personId = this.model.get('person_id');
		const personName = this.model.get('person_name');

		if (!personId) {
			return null;
		}

		return {
			name: personName || `(${_.gettext('hidden')})`,
			url: personName && this.getParticipantUrl(personId)
		};
	},
	getSecondaryParticipants: function getSecondaryParticipants() {
		const self = this;
		const secondaryParticipants = _.filter(this.model.get('participants'), {
			primary_flag: false
		});
		const relatedModel =
			this.model?.get('related_objects')?.person ||
			this.model?.collection?.relatedObjects?.person;

		return _.map(secondaryParticipants, function(secondaryParticipant) {
			const participantId = secondaryParticipant.person_id;
			const participant = relatedModel && relatedModel[participantId];

			return {
				name: participant ? participant.name : `(${_.gettext('hidden')})`,
				url: participant && self.getParticipantUrl(participantId)
			};
		});
	},
	getParticipantUrl: function getParticipantUrl(participantId) {
		const relatedModelId = parseInt(this.relatedModel.get('id'), 10);

		if (!(this.relatedModel.type === 'person' && relatedModelId === participantId)) {
			return `/person/${participantId}`;
		}
	},
	/**
	 * Returns related items data array
	 * @return {Array} Returns array of objects
	 */
	getRelatedItems: function getRelatedItems() {
		const items = RelatedItemsView.prototype.getRelatedItems.apply(this);
		const personsList = this.getActivityParticipants();

		_.remove(items, { type: 'person' });

		if (personsList.length) {
			items.unshift({
				type: 'person',
				list: personsList
			});
		}

		return items;
	}
});
