const _ = require('lodash');
const Pipedrive = require('pipedrive');
const Template = require('templates/shared/relateditems.html');

/**
 * RelatedItems View
 *
 * @example
 * this.relatedItems = new RelatedItemsView({
        model: this.model,
        relatedModel: this.options.relatedModel,
        containerClassName: 'flowItemDetails'
    });
 * @param {object} model child model for example Activity model
 * @param {object} relatedModel parent model for example Deal model
 * @param {string} size supported sizes 'size20'
 * @param {boolean} relatedParent deafault = false if used will only display parent model
 */

module.exports = Pipedrive.View.extend({
	template: _.template(Template),

	initialize: function(options) {
		this.options = options || {};
		this.relatedModel = this.options.relatedModel;
		this.relatedParent = this.options.relatedParent || false;
		this.render();
		this.bindOnChangeEvents();
	},

	bindOnChangeEvents: function() {
		this.model.onChange('org_id org_name person_id person_name', this.render, this);
	},

	render: function() {
		this.$el.html(this.template(this));
	},
	/**
	 * Returns Icon size
	 * @return {string}
	 */
	getSize: function() {
		return this.options.size || 'size20';
	},
	/**
	 * Returns wrapper container class name
	 * @return {string}
	 */
	getContainerClassName: function() {
		return this.options.containerClassName ? this.options.containerClassName : '';
	},
	/**
	 * If options.relatedParent is defined, returns related parent data
	 * @return {object} returns type and name
	 */
	getRelatedParent: function() {
		let item = {};

		if (this.model.type === 'person') {
			item = {
				type: 'person',
				name: this.model.get('name')
			};
		}

		if (this.model.type === 'organization') {
			item = {
				type: 'organization',
				name: this.model.get('name')
			};
		}

		if (this.model.type === 'deal') {
			item = {
				type: 'deal',
				name: this.model.get('title')
			};
		}

		return item;
	},
	/**
	 * Returns related items data array
	 * @return {array} Returns array of objects
	 */
	getRelatedItems: function() {
		const items = [];

		if (this.relatedModel.type !== 'person' && this.model.get('person_id')) {
			items.push({
				type: 'person',
				name: this.model.get('person_name'),
				url: `/person/${this.model.get('person_id')}`
			});
		}

		if (this.relatedModel.type !== 'organization' && this.model.get('org_id')) {
			items.push({
				type: 'organization',
				name: this.model.get('org_name'),
				url: `/organization/${this.model.get('org_id')}`
			});
		}

		if (this.relatedModel.type !== 'deal' && this.model.get('deal_id')) {
			items.push({
				type: 'deal',
				name: this.model.get('deal_title')
					? this.model.get('deal_title')
					: this.model.get('deal_name'),
				url: `/deal/${this.model.get('deal_id')}`
			});
		}

		return items;
	}
});
