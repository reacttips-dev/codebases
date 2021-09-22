const Pipedrive = require('pipedrive');
const moment = require('moment');
const User = require('models/user');
const _ = require('lodash');
const filterUtils = require('utils/filter-utils');
const DealStageAnalytics = require('utils/analytics/deal-stage-analytics');
const PDMetrics = require('utils/pd-metrics');

const local = {
	getFields: function() {
		let fields = [];

		const url = _.isFunction(this.url) ? this.url() : this.url;

		if (url.match('/deals')) {
			fields = User.fields.get('deal');
		}

		if (url.match('/organizations')) {
			fields = User.fields.get('organization');
		}

		if (url.match('/persons')) {
			fields = User.fields.get('person');
		}

		if (url.match('/products')) {
			fields = User.fields.get('product');
		}

		if (url.match('/activities')) {
			fields = User.fields.get('activity');
		}

		return fields;
	},
	findFieldByKey: function(key) {
		return function(f) {
			return f.key === key || f.use_field === key;
		};
	},
	findFieldByKeyType: function(key, type) {
		return function(f) {
			return (f.key === key || f.use_field === key) && f.field_type === type;
		};
	},
	getNormalizedDate: function(fromDate) {
		if (!_.isEmpty(fromDate)) {
			return moment(fromDate, 'L').format('YYYY-MM-DD');
		}

		return null;
	},
	// eslint-disable-next-line camelcase
	getPrefilledAddress: function({ address, address_geocoded }, isOrganizationModel) {
		if (isOrganizationModel) {
			return null;
		}

		return {
			...(!!address && { address }),
			...(!!address_geocoded && { address_geocoded }) // eslint-disable-line camelcase
		};
	},
	normalizeDateAttributes: function(attributes, fields) {
		_.forEach(attributes, (attribute, key) => {
			const field = _.find(fields, local.findFieldByKey(key));

			switch (_.get(field, 'field_type')) {
				case 'date':
				case 'daterange':
					attributes[key] = local.getNormalizedDate(attribute);

					if (field.field_type === 'daterange' && attributes[`${key}_until`]) {
						attributes[`${key}_until`] = local.getNormalizedDate(
							attributes[`${key}_until`]
						);
					}

					break;
				default:
			}
		});
	},
	preCreateParticipants: function(args, attributes, fields, setReady) {
		const readyList = [];
		const requireCallbacks = [];
		const self = this;

		_.forEach(attributes, (attribute, key) => {
			const field = _.find(fields, local.findFieldByKeyType(key, 'participants'));

			if (!field) {
				return;
			}

			_.forEach(attribute, (participant) => {
				if (
					!_.isEmpty(participant.person_id_helper) &&
					!_.isEmpty(participant.person_temp_id)
				) {
					const readyKey = _.uniqueId('participant');

					readyList.push(readyKey);
					requireCallbacks.push((Person) => {
						const person = new Person();

						person.set({ name: participant.person_id_helper });
						person.save(null, {
							success: function(person) {
								self.updateParticipants(participant.person_temp_id, person);
								setReady(readyKey);
								PDMetrics.trackUsage(
									null,
									'create_before_update',
									'person_created'
								);
							}
						});
					});
				}
			});
		});

		return { readyList, requireCallbacks };
	},
	preCreatePerson: function(args, attributes, fields, setReady) {
		const readyList = [];
		const requireCallbacks = [];
		const self = this;

		_.forEach(attributes, (attribute, key) => {
			const field = _.find(fields, local.findFieldByKeyType(key, 'person'));

			if (!field) {
				return;
			}

			if (!_.isEmpty(attributes[`${key}_helper`]) && Number(attribute) === 0) {
				readyList.push(key);
				requireCallbacks.push((Person) => {
					const person = new Person();

					person.set({ name: attributes[`${key}_helper`] });
					person.save(null, {
						success: function(person) {
							self.updateModelContact(args, key, field.field_type, person);
							setReady(key);
							PDMetrics.trackUsage(null, 'create_before_update', 'person_created');
						}
					});
				});
			}
		});

		return { readyList, requireCallbacks };
	},
	preCreateOrganization: function(args, attributes, fields, setReady) {
		const readyList = [];
		const requireCallbacks = [];
		const self = this;

		_.forEach(attributes, (attribute, key) => {
			const field = _.find(fields, local.findFieldByKeyType(key, 'organization'));

			if (!field) {
				return;
			}

			if (!_.isEmpty(attributes[`${key}_helper`]) && Number(attribute) === 0) {
				readyList.push(key);
				requireCallbacks.push((Person, Organization) => {
					const isOrganizationModel = self instanceof Organization;
					const org = new Organization();

					const orgAttributes = {
						name: attributes[`${key}_helper`],
						...local.getPrefilledAddress(attributes, isOrganizationModel)
					};

					org.set(orgAttributes);
					org.save(null, {
						success: function(org) {
							self.updateModelContact(args, key, field.field_type, org);
							setReady(key);
							PDMetrics.trackUsage(null, 'create_before_update', 'org_created');
						}
					});
				});
			}
		});

		return { readyList, requireCallbacks };
	},
	preCreateRelatedData: function(args, attributes, fields, callback) {
		let Ready;

		const setReady = function(key) {
			Ready && Ready.set(key);
		};
		const preCreateResults = _.reduce(
			[
				local.preCreatePerson.call(this, args, attributes, fields, setReady),
				local.preCreateOrganization.call(this, args, attributes, fields, setReady),
				local.preCreateParticipants.call(this, args, attributes, fields, setReady)
			],
			(preCreateResults, preCreateEntity) => {
				preCreateResults.readyList = _.concat(
					preCreateResults.readyList,
					preCreateEntity.readyList
				);
				preCreateResults.requireCallbacks = _.concat(
					preCreateResults.requireCallbacks,
					preCreateEntity.requireCallbacks
				);

				return preCreateResults;
			},
			{ readyList: [], requireCallbacks: [] }
		);

		Ready = Pipedrive.Ready(preCreateResults.readyList, callback);

		return preCreateResults.requireCallbacks;
	}
};

/**
 * @classdesc
 * Custom field helper model.
 *
 * @description
 * Custom field helper model to help set some values before model save
 *
 * @class models/CustomFieldHelper
 * @augments models/User
 */
module.exports = {
	/**
	 * Custom save function to do certain save's before actual model save
	 * @void
	 */
	save: function() {
		const fields = local.getFields.call(this);
		// eslint-disable-next-line prefer-rest-params
		const args = Array.prototype.slice.call(arguments);

		if (this.getMatchingFilters) {
			const query = filterUtils.getMatchingFilterQueryParam();

			if (_.isObject(args[1])) {
				args[1].query = query;
			} else if (_.isUndefined(args[1])) {
				args[1] = { query };
			}
		}

		// If fields information cannot be found
		if (_.isEmpty(fields)) {
			Pipedrive.Model.prototype.save.apply(this, args);

			return;
		}

		if (_.isObject(args[0])) {
			_.assignIn(this.changed, args[0]);
		}

		const changed = this.changed.data || this.changed;
		const attributes = _.assignIn({}, this.attributes, changed);
		const previousAttributes = this.previousAttributes();

		this.trackEvents(attributes, changed, previousAttributes);

		local.normalizeDateAttributes.call(this, attributes, fields);

		const saveMainModel = _.bind(function() {
			this.unsetAddressAttribute && this.unsetAddressAttribute(args);

			Pipedrive.Model.prototype.save.apply(this, args);
		}, this);
		const preSaveRequireLoaders = local.preCreateRelatedData.call(
			this,
			args,
			attributes,
			fields,
			saveMainModel
		);

		if (!_.isEmpty(preSaveRequireLoaders)) {
			const Person = require('models/person');
			const Organization = require('models/organization');

			_.forEach(preSaveRequireLoaders, (callback) => {
				if (_.isFunction(callback)) {
					return callback(Person, Organization);
				}
			});
		}
	},

	trackEvents: function(attributes, changed, previousAttributes) {
		if (changed.stage_id && !_.isNil(previousAttributes.stage_id)) {
			DealStageAnalytics.trackStageChange(
				attributes,
				window.location.pathname,
				previousAttributes
			);
		}

		const isSingleDealEdited = !!attributes.id;

		if ((changed.status === 'won' || changed.status === 'lost') && isSingleDealEdited) {
			DealStageAnalytics.trackDealClosed(
				attributes,
				window.location.pathname,
				changed.status
			);
		}
	},

	/**
	 * Update model contact model after it has been created
	 * @param  {object} args
	 * @param  {string} key
	 * @param  {string} fieldType
	 * @param  {object} contact
	 * @void
	 */
	updateModelContact: function(args, key, fieldType, contact) {
		if (_.isObject(args[0])) {
			args[0][key] = contact.get('id');
		} else {
			this[this.isNew() ? 'attributes' : 'changed'][key] = contact.get('id');
		}
	},

	updateParticipants: function(personTempId, person) {
		const attributes = this[this.isNew() ? 'attributes' : 'changed'];
		const participants = attributes.participants || attributes.data.participants;
		const participantToReplace = _.find(participants, { person_temp_id: personTempId });

		participantToReplace.person_id = person.get('id');
		delete participantToReplace.person_temp_id;
		delete participantToReplace.person_id_helper;
	}
};
