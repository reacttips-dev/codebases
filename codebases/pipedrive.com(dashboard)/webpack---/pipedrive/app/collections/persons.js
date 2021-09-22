const _ = require('lodash');
const sortUtils = require('utils/sort-utils');
const Pipedrive = require('pipedrive');
const PersonModel = require('models/person');

module.exports = Pipedrive.Collection.extend(
	{
		model: PersonModel,

		relatedModel: null,

		type: 'person',

		pullLimit: 20,

		url: function() {
			let url = `${app.config.api}/persons`;

			if (this.options.relatedModel) {
				url = `${app.config.api}/${this.options.relatedModel.type}s/${this.options.relatedModel.id}/persons`;
			}

			if (_.isArray(this.options.limitFields)) {
				url = `${url}:(${this.options.limitFields.join(',')})`;
			}

			return url;
		},

		initialize: function(data, options) {
			this.options = options || {};

			if (this.options.relatedModel) {
				app.global.bind('person.model.*.add', this.onPersonUpdate, this);
				app.global.bind('person.model.*.update', this.onPersonUpdate, this);
				app.global.bind('person.model.*.delete', this.onPersonDelete, this);
			}
		},

		onPersonUpdate: function(person) {
			const relatedModel = this.options.relatedModel;
			const isPersonInCollection = this.find({ id: person.id });
			const isInSameOrganization =
				Number(person.get(relatedModel.relationKey)) === Number(relatedModel.id);
			const isPersonDeleted = !person.get('active_flag');

			if (isInSameOrganization && !isPersonDeleted && !isPersonInCollection) {
				this.add(person);
			} else if (isPersonInCollection && (!isInSameOrganization || isPersonDeleted)) {
				this.remove(isPersonInCollection);
			}
		},

		onPersonDelete: function(person) {
			const personInCollection = this.find({ id: person });

			if (personInCollection) {
				this.remove(personInCollection);
			}
		},

		onUnload: function() {
			app.global.unbind('person.model.*.add', this.onPersonUpdate, this);
			app.global.unbind('person.model.*.update', this.onPersonUpdate, this);
			app.global.unbind('person.model.*.delete', this.onPersonDelete, this);
		},

		pull: function(options) {
			if (options.data && options.data.sort) {
				const removeNameFieldFromSortParameters = true;

				options.data.sort = sortUtils.applySortFieldsMapping(
					options.data.sort,
					removeNameFieldFromSortParameters
				);
			}

			return Pipedrive.Collection.prototype.pull.call(this, options);
		}
	},
	{
		getListApiEndpoint: function() {
			return '/persons/list';
		},

		includeFields: function(fields) {
			const result = ['name'];

			if (fields.indexOf('next_activity_date') !== -1) {
				result.push('next_activity_time');
			}

			if (fields.indexOf('last_activity_date') !== -1) {
				result.push('last_activity_time');
			}

			return result;
		}
	}
);
