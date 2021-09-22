'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');

let relationTypeCopy;

/**
 * @classdesc
 * Related organizations model class
 *
 * @class models/RelatedOrganization
 * @augments module:Pipedrive.Model
 */
module.exports = Pipedrive.Model.extend({
	/**
	 * Initializes the collection by setting the organization.
	 * Will take it from collection if no optios are set.
	 * If there is no collection either but calculated_related_org_id is set then it's taken from calculated data.
	 * @param  {object} data
	 * @param  {object} options
	 */
	initialize: function(data, options) {
		relationTypeCopy = {
			parent: _.gettext('Parent'),
			daughter: _.gettext('Daughter'),
			related: _.gettext('Related'),
			sister: _.gettext('Sister')
		};

		this.options = options || {};
		this.organization =
			this.options.organization || (this.collection && this.collection.organization);

		if (this.organization) {
			this.organization_id = this.organization.id;
		} else if (this.get('calculated_related_org_id')) {
			this.organization_id =
				this.get('calculated_related_org_id') === this.get('rel_linked_org_id')
					? this.get('rel_owner_org_id')
					: this.get('rel_linked_org_id');
		}
	},

	/**
	 * Set api endpoint for related organization
	 * @return {String} API endpoint for related organization
	 */
	url: function() {
		let url = `${app.config.api}/organizationRelationships`;

		if (this.get('id')) {
			url += `/${this.get('id')}`;
		} else if (this.organization_id) {
			url += `?org_id=${this.organization_id}`;
		}

		return url;
	},

	/**
	 * Gets calculated related organization small object from related data.
	 * @return {object}
	 */
	getCalculatedRelatedOrganization: function() {
		if (this.get('calculated_related_org_id')) {
			return this.getRelatedData('organization', this.get('calculated_related_org_id'));
		}
	},

	/**
	 * Return the translated type for calculate relation type.
	 * @return {string}
	 */
	getCalculatedRelationType: function() {
		return relationTypeCopy[this.get('calculated_type')] || this.get('calculated_type');
	},

	getCalculatedLinkedId: function() {
		return this.get('calculated_related_org_id') === this.get('rel_linked_org_id')
			? this.get('rel_owner_org_id')
			: this.get('rel_linked_org_id');
	}
});
