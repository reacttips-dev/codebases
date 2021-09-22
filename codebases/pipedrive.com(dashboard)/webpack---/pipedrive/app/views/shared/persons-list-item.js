const Pipedrive = require('pipedrive');
const _ = require('lodash');
const PersonListItemTemplate = require('templates/shared/persons-list-item.html');
const QuickInfoCard = require('views/quick-info-card');

module.exports = Pipedrive.View.extend({
	template: _.template(PersonListItemTemplate),

	initialize: function(options) {
		this.options = options || {};

		this.render();

		this.model.onChange('name active_flag', this.render, this);
	},

	getNameWithSuffix: function(model) {
		if (_.isUndefined(model)) {
			return null;
		}

		const activeFlag = model.get('active_flag');
		const isDeleted = !_.isUndefined(activeFlag) && !activeFlag;
		const isHidden = _.isUndefined(activeFlag);
		const name = model.get('name') ? `${model.get('name')} ` : '';

		let nameSuffix = '';

		if (isDeleted) {
			nameSuffix = _.gettext('(deleted)');
		} else if (isHidden) {
			nameSuffix = _.gettext('(hidden)');
		}

		return name + nameSuffix;
	},

	getSubmodel: function() {
		return this.model.submodel ? this.model[this.model.submodel] : this.model;
	},

	templateHelpers: function() {
		const model = this.getSubmodel();

		return {
			model,
			nameWithSuffix: this.getNameWithSuffix(model)
		};
	},

	addQuickInfoCard: function({ el, id, type, source }) {
		this.quickInfoCard = new QuickInfoCard({
			el,
			id,
			type,
			source,
			popoverProps: {
				placement: 'right'
			}
		});
	},

	getSourceType: function() {
		const model = this.getSubmodel();

		const type = model.type;

		if (type === 'follower') {
			return 'user';
		}

		return type;
	},

	beforeRender: function() {
		if (this.quickInfoCard) {
			this.quickInfoCard.onDestroy();
		}
	},

	afterRender: function() {
		const model = this.getSubmodel();

		if (model) {
			const id = model.id;
			const type = this.getSourceType();
			const source = type === 'user' ? 'followers' : 'participants';

			const el = this.$el.find('a').get(0);

			this.addQuickInfoCard({ el, id, type, source });
		}
	},

	onDestroy: function() {
		if (this.quickInfoCard) {
			this.quickInfoCard.onDestroy();
		}
	}
});
