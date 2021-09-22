const { Model } = require('@pipedrive/webapp-core');
const _ = require('lodash');

/**
 * @classdesc
 * Custom field mode
 *
 * @description
 * Allows you to delete certain custom field from the list.
 */
const FieldModel = Model.extend(
	{
		/**
		 * Different API endpoints enum - url is chosen according to given type
		 * @type {Object}
		 */
		endpoints: {
			deal: '/dealFields',
			person: '/personFields',
			organization: '/organizationFields',
			product: '/productFields'
		},

		/**
		 * Initializes the field
		 * @param  {object} data
		 * @param  {object} options
		 */
		initialize: function(data, options) {
			this.options = options || {};
			this.fieldType = this.options.type;
			this.type = `${this.options.type}Field`;

			// Update all fields from server
			this.on(
				'sync',
				_.bind(function() {
					app.global.fire(`${this.type}.model.${this.id}.update`, this);
				}, this)
			);

			this.selfUpdateFromSocket();
			this.selfDeleteFromSocket();
		},

		/**
		 * API endpoint for managin custom field (deleting, for example)
		 *
		 * Field id is needed for urlRoot in case of dealing with specific field
		 *
		 * @throws {Pipedrive.ModelException} if fieldType is missing
		 * @return {String} API endpoint
		 */
		urlRoot: function() {
			if (this.fieldType && this.endpoints.hasOwnProperty(this.fieldType)) {
				return `/api/v1${this.endpoints[this.fieldType]}`;
			}

			throw new Error('No valid fieldType set.');
		},

		/**
		 * Get current field type
		 * @return {String} Field type (deal|person|organization|product)
		 */
		getType: function() {
			return this.fieldType;
		},

		/**
		 * Some date fields are actually datetime fields and contain time.
		 * Those fields should be worked with differently so we don't mess up the TZ conversion.
		 * @return {Boolean} [description]
		 */
		isDatetime: function() {
			return _.includes(FieldModel.dateTimeFields, this.get('key'));
		},

		isFieldModel: true
	},
	{
		dateTimeFields: [
			'won_time',
			'lost_time',
			'add_time',
			'update_time',
			'close_time',
			'marked_as_done_time',
			'stage_change_time',
			'last_incoming_mail_time',
			'last_outgoing_mail_time'
		],
		timeFormattedDateTimeFields: ['marked_as_done_time', 'add_time', 'update_time']
	}
);

module.exports = FieldModel;
