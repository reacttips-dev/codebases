const Pipedrive = require('pipedrive');
const _ = require('lodash');
const ResultModel = require('models/result');
const GoogleMapsHelper = require('utils/google-maps');

let googleMapsService = null;

const googleMapsSearchOptions = { types: ['geocode'] };
const Search = function(opts) {
	const search = _.assignIn(
		{
			timeout: null,
			query: '',
			models: [],
			activeModel: null,
			length: 0,
			initialize: function() {},

			pull: function(options) {
				if (_.isNull(googleMapsService)) {
					GoogleMapsHelper.ready(function(google) {
						googleMapsService = new google.maps.places.AutocompleteService(
							googleMapsSearchOptions
						);
						search.pull(options);
					});

					return {
						abort: function() {}
					};
				}

				search.query = options.data.term;

				search.timeout = setTimeout(function() {
					googleMapsService.getPlacePredictions(
						{
							input: search.query
						},
						function(results, status) {
							search.reset();

							if (status === 'OK') {
								_.forEach(results, function(result) {
									const model = new ResultModel({
										id: result.id,
										title: result.description
									});

									search.models.push(model);
									model.collection = search;
								});

								search.length = search.models.length;
							}

							if (_.isFunction(options.success)) {
								options.success(search.models);
							}

							search.timeout = null;
						}
					);
				}, 100);

				return {
					abort: function() {
						clearTimeout(search.timeout);
						search.timeout = null;
						search._running = null;
					}
				};
			},
			limitedPull: function(options) {
				this._running = this.pull(options);
			},
			stopQuery: function() {
				if (this._running) {
					this._running.abort();
				}
			},
			setActive: function(model) {
				search.activeModel = model;
				search.trigger('selected', model);
			},

			getActive: function(/* model */) {
				return search.activeModel;
			},

			clearActive: function() {
				search.setActive(null);
			},

			next: function() {
				if (search.models.length === 0) {
					return;
				}

				let i = search.models.indexOf(search.getActive()) + 1;

				if (i >= search.models.length) {
					i = 0;
				}

				search.setActive(search.models[i]);

				return search;
			},

			prev: function() {
				if (search.models.length === 0) {
					return;
				}

				let i = search.models.indexOf(search.getActive()) - 1;

				if (i < 0) {
					i = search.models.length - 1;
				}

				search.setActive(search.models[i]);

				return search;
			},

			update: function(/* collection, response */) {
				if (search.models.length === 0) {
					search.activeModel = null;
				}
			},

			activate: function(ev) {
				if (!search.activeModel) {
					return false;
				}

				search.activeModel.trigger('activate', ev);
			},

			reset: function() {
				search.models = [];
				search.length = 0;
			}
		},
		Pipedrive.Events
	);

	search.initialize(opts);

	return search;
};

module.exports = Search;
