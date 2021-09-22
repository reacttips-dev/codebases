const Pipedrive = require('pipedrive');
const _ = require('lodash');
const Search = require('collections/autocomplete');
const ResultItemView = require('views/ui/search-result-item');
const $ = require('jquery');
const Helpers = require('utils/helpers');

/* eslint-disable no-undefined */

/**
 * Create new Input Search component
 *
 * @param  {Object} options data and settings what field and how to show
 * @class views/ui/InputSearch
 * @augments module:Pipedrive.View
 */

const KEY = Pipedrive.common.keyCodes();
const InputSearch = Pipedrive.View.extend(
	/** @lends views/ui/InputSearch */
	{
		/**
		 * Default options when creating new input search, override these. <br>
		 * Use this as example what you can pass into constructor
		 *
		 * @const {Object}
		 * @enum {string}
		 */
		defaultOptions: {
			uuid: null,
			data: {
				type: '', // like 'address',
				noResultsMessage: undefined, // null means hide!
				el: null // when element triggers 'remove' event, destroys this input search
			},
			path: '',
			minimumQueryLength: 2,

			limit: 200, // max number of results

			// callbacks wrapped into 'on'
			on: {
				select: null,
				change: null,
				blur: null,
				focus: null,
				clear: null
			},

			prefillModel: null,

			additional_parameters: null, // passed to collection
			resultItemView: ResultItemView,
			returnStringValue: false,
			typeDescription: undefined // no idea!
		},

		/*
    triggers events:
    * clear,
    * blur,
    * select,
    * change
    */

		// private properties
		options: null,
		searchOptions: null,
		collection: null,
		minimumQueryLength: 0,
		result: null,
		cancelResults: null,

		presearchData: null,

		// collection.query - search made?
		// collection.defaultValue - hacked into collection

		_lastSelect: null, // just to trigger 'select' event also

		$list: null, // element in body tag, shared between inputsearch instances

		initialize: function(opts) {
			this.options = _.assignIn({}, this.defaultOptions, opts);

			const self = this;

			// bind this view to the add and remove events of the collection
			this.searchOptions = {
				path: _.isObject(opts) && _.isString(opts.path) ? opts.path : ''
			};

			this.collection = this.getSearchCollection();

			// why override type!?
			this.collection.type = opts.data.type;
			this.collection.additional_parameters = this.options.additional_parameters;

			this.collection.on('reset', this.changed, this);
			this.collection.on('destroy', this.destroy, this);
			this.collection.on('selected', this.selected, this);

			// make better - automatic destroy system
			if (typeof opts.data.el !== 'undefined') {
				$(opts.data.el).one('remove', _.bind(this.destroy, this));
			}

			this.minimumQueryLength = Number(this.options.minimumQueryLength);
			this.resultItemView = this.options.resultItemView;

			// finds element, with certain ID
			this.$el = $(`#${opts.uuid}`);
			this.el = this.$el.get(0);

			this.$el.on('focus.autocompleter', function(ev) {
				self.onfocus.call(this, ev, self);
			});
			this.$el.on('blur.autocompleter', _.bind(this.onblur, this));
			this.$el.on('keyup.autocompleter, input.autocompleter', _.bind(this.onkeyup, this));
			this.$el.on('keydown.autocompleter', _.bind(this.onkeydown, this));

			// Custom triggers
			/**
			 * pd-search trigger
			 *
			 * Trigger should be supplied with at least ‘search’ parameter to actually trigger
			 * the search. ‘result’ and ‘noresult’ can also be supplied for additional functionality.
			 *
			 * Example data:
			 * {
			 *   search:   { term: 'a', text: 'b' },  // Search term and text to show in input field
			 *   result:   { id: 100 },               // Post-search default match (result id 100 in this case)
			 *   noresult: { anykey: 'anyvalue' }     // If no match, a default result can be supplied
			 * }
			 */
			this.$el.on('pd-search', _.bind(this.preSearch, this));

			this.on('select', opts.on.select);
			this.on('change', opts.on.change);
			this.on('blur', opts.on.blur);
			this.on('focus', opts.on.focus);
			this.on('clear', opts.on.clear);

			// Remember last selection internally
			this.on('select', function(model) {
				this._lastSelect = model;
			});

			// Clear button
			this.$clear = this.$el.siblings('span.clear');
			this.$clear.off('click.autocompleter').on('click.autocompleter', () => {
				self.$el.val('').focus();
				self.trigger('clear', self.$el);
			});

			// Spinners
			this.initializeSpinner();

			// Auto-search on init, if there is data attribute set
			if (this.$el.attr('data-pd-search')) {
				this.$el.trigger('pd-search'); // this basicly calls this.preSearch()
			}

			this.createList();

			if (this.options.prefillModel) {
				this.preSearch(null, this.options.prefillModel);
			}

			this.onWindow('resize.autocompleter', _.bind(this.reposition, this));
		},

		initializeSpinner: function() {
			this.$spinner = this.$el.siblings('span.spinner');

			if (this.$spinner.length) {
				this.spinner = Helpers.spinner('s');
				this.options.isFetching ? this.showSpinner() : this.hideSpinner();
			}
		},

		getSearchCollection: function() {
			return new Search(this.searchOptions);
		},

		createList: function() {
			this.$list = $('#widget-ac-results');

			if (this.$list.length) {
				this.$list.data('binds', this.$list.data('binds') + 1);
			} else {
				this.$list = $('<ul id="widget-ac-results" data-test="address-results"/>');
				this.$list.hide();
				this.$list.appendTo('body');
				this.$list.data('binds', 1);
			}
		},

		destroyList: function() {
			if (this.$list.data('binds') > 1) {
				this.$list.data('binds', this.$list.data('binds') - 1);
			} else {
				this.$list.remove();
			}
		},

		getOriginalCount: function() {
			if (this.hideMatch) {
				// -1 cause merge removes model A
				return this.collection.length - 1;
			}

			return this.collection.length;
		},

		render: function() {
			const self = this;

			this.$list.removeClass('poweredByGoogle');

			// Calculate position
			this.reposition();

			if (this.collection.length) {
				// has resuts
				_.forEach(
					this.collection.models,
					_.bind(function(item, i) {
						const originalCount = this.getOriginalCount();
						const indexEqualToOriginalCount = originalCount === i;
						const limitReached = i === this.options.limit - 1;
						const isMoreInProvider =
							this.collection.additionalData &&
							this.collection.additionalData.pagination.more_in_provider;

						if ((indexEqualToOriginalCount && isMoreInProvider) || limitReached) {
							this.renderTextItem(
								_.gettext('Too many results. Specify search query.')
							);
						} else if (i < self.options.limit) {
							self.renderItem(item);
						}
					}, this)
				);
				this.visible = true;
				this.$list.show();
			} else if (this.collection.query) {
				// search made, but no results
				if (this.options.data.noResultsMessage === undefined) {
					let itemName;

					if (
						this.collection.type === 'custom' &&
						_.isObject(this.options) &&
						_.isString(this.options.typeDescription)
					) {
						itemName = this.options.typeDescription;
					} else if (_.isString(this.getTypeText(this.collection.type))) {
						itemName = this.getTypeText(this.collection.type);
					} else {
						itemName = _.gettext('value');
					}

					this.renderTextItem(
						_.gettext('‘%1$s’ will be added as a new %2$s', [
							this.collection.query,
							itemName
						])
					);
				} else {
					// value NULL means hide without option to create new...
					const disableCreateItem = _.isNull(this.options.data.noResultsMessage);

					if (disableCreateItem) {
						this.visible = false;
						this.$list.hide();

						return;
					} else {
						this.renderTextItem(this.options.data.noResultsMessage);
					}
				}

				this.visible = true;
				this.$list.show();
			}

			this.focus();
		},

		getTypeText: function(type) {
			const types = {
				person: _.gettext('contact'),
				organization: _.gettext('organization'),
				product: _.gettext('product'),
				deal: _.gettext('deal'),
				custom: _.gettext('custom'),
				address: _.gettext('address')
			};

			return types[type];
		},

		// creates new rows in results list
		renderItem: function(model) {
			const result = new this.resultItemView({
				model,
				list: this
			});

			this.$list.append(result.render().el);

			if (model.active) {
				model.view.$el.addClass('active');
			}
		},

		renderTextItem: function(text) {
			const result = new this.resultItemView({
				model: text,
				list: this
			});

			this.$list.append(result.render().el);
		},

		onfocus: function(ev, context) {
			if ($(this).hasClass('searching')) {
				return;
			}

			if (ev) {
				context.trigger('focus', context.el);
			}

			context.collection.query = '';
			context.collection.defaultValue = $(this).val();
			context.result = null;
			context.collection.reset();
			context.$list.hide();
			context.reposition();
		},

		onblur: function(ev) {
			this.hide();
			this.visible = false;

			if (ev) {
				this.trigger('blur', this.el);
			}

			if (!this.result && this.collection.defaultValue === this.$el.val()) {
				return;
			}

			let returnValue = null;

			const triggerEvents = { select: false, change: false };

			if (this.options.returnStringValue) {
				returnValue = this.$el.val();
			}

			if (this.result) {
				// user had something typed in to search box and had selected one of the predefined values
				if (returnValue === null) {
					returnValue = this.result;
				}

				triggerEvents.change = true;
			} else if (this.$el.val()) {
				// user had something typed in to search box but did NOT select any of the predefined values
				this.collection.reset();
				triggerEvents.select = true;
				triggerEvents.change = true;
			} else {
				// user had NOT typed anything in to search box
				this.collection.query = '';
				this.collection.reset();
				triggerEvents.select = true;
				triggerEvents.change = true;
			}

			if (triggerEvents.select) {
				this.trigger('select', returnValue, this.el, ev);
			}

			if (triggerEvents.change) {
				this.trigger('change', returnValue, this.el, ev);
			}

			this.collection.defaultValue = this.$el.val();
		},

		// moved out with tab key
		onkeydown: function(ev) {
			switch (ev.keyCode) {
				case KEY.tab:
					if (!this.visible || !this.collection.getActive()) {
						return;
					}

					// sets value to first result name or title
					this.$el.val(
						this.collection.getActive().get('name') === 'N/A'
							? this.collection.getActive().get('title')
							: this.collection.getActive().get('name')
					);
					break;
			}
		},

		/* eslint-disable complexity */
		onkeyup: function(ev) {
			switch (ev.keyCode) {
				case KEY.up:
					if (!this.visible) {
						return;
					}

					ev.preventDefault();
					this.collection.prev();

					if (!this.collection.getActive()) {
						return;
					}

					this.$el.val(
						this.collection.getActive().get('name') === 'N/A'
							? this.collection.getActive().get('title')
							: this.collection.getActive().get('name')
					);

					return false;

				case KEY.down:
					if (!this.visible) {
						return;
					}

					ev.preventDefault();
					this.collection.next();

					if (!this.collection.getActive()) {
						return;
					}

					this.$el.val(
						this.collection.getActive().get('name') === 'N/A'
							? this.collection.getActive().get('title')
							: this.collection.getActive().get('name')
					);

					return false;

				case KEY.enter:
					if (!this.visible) {
						return;
					}

					this.setResult(this.collection.getActive()); // setResult(getActive())
					ev.preventDefault();
					this.onblur(ev); // calls onBLUR!

					return false;

				case KEY.left:
				case KEY.right:
				case KEY.tab:
				case KEY.shift:
					if (!this.visible) {
						return;
					}

					return false; // ignores basicly

				case KEY.escape:
					this.trigger('clear', this.$el.val());

					if (this.$el.val()) {
						this.$el.val('').focus();
					} else {
						this.$el.blur();
					}

					ev.preventDefault();
					ev.stopPropagation();
			}

			// starts search when text bigger than minimumQueryLength
			if ($.trim(this.$el.val()).length >= this.minimumQueryLength) {
				this.cancelResults = false;
				this.userSearch($.trim(this.$el.val()));
			} else {
				this.triggerChangeEvent();
				this.hide();
			}
		},
		/* eslint-enable complexity */

		/**
		 * Throttled wrapper for this.search()
		 *
		 * @param  {String} keyword Keyword to search
		 * @return {undefined}
		 */
		userSearch: _.debounce(function(keyword) {
			this.search(keyword);

			this.currentKeyword = keyword;
		}, 200),

		search: function(keyword) {
			const data = {
				term: keyword,
				limit: this.options.limit
			};

			if (this.currentKeyword === keyword) {
				this.$list.html('');
				this.render();
			} else {
				// actually starts search
				this.collection.limitedPull({
					data,
					success: _.bind(this.changed, this),
					error: _.bind(function() {
						this.collection.clearActive();
						this.collection.reset();
						this.changed();
					}, this)
				});
			}

			this.showSpinner();
		},

		triggerChangeEvent: function() {
			this.trigger('resultsFound', {
				query: this.$el.val(),
				collection: this.collection
			});
		},

		showSpinner: function() {
			// starts spinner, hides clear button
			if (!this.$el.hasClass('searching')) {
				this.$el.addClass('searching');
				$(this.spinner).appendTo(this.$spinner);
				this.$clear.hide();
			}
		},

		hideSpinner: function() {
			if (this.spinner) {
				this.$spinner.html('');
			}
		},

		// Collection changed, redraw list
		// called on search result, error, reset
		/* eslint-disable complexity */
		/* eslint-disable max-depth */
		changed: function() {
			if (this.options.exclude) {
				const excludedModels = this.collection.filter(
					_.bind(function(model) {
						return _.includes(this.options.exclude, model.get('id'));
					}, this)
				);

				this.collection.remove(excludedModels);
			}

			this.$el.removeClass('searching');

			this.hideSpinner();

			this.$clear.show();
			this.$list.html(''); // resets list

			this.triggerChangeEvent();

			// results loading canceled, ignore rendering
			if (this.cancelResults) {
				return;
			}

			if (this.collection.length && this.options.data.hideResultId) {
				this.hideMatch = this.collection.find({ id: this.options.data.hideResultId });

				if (this.hideMatch) {
					this.collection.remove(this.hideMatch);
				}
			}

			this.render();

			if (this.presearchData) {
				if (this.presearchData.result) {
					// we have matches
					if (this.collection.length) {
						// match results to given direct ID
						if (this.presearchData.result.id) {
							const match = this.collection.find({
								id: this.presearchData.result.id
							});

							if (match) {
								if (this.presearchData.result.alwaysShowAlternatives) {
									this.collection.setActive(match);
								} else {
									this.setResult(match);
									this.onblur();
								}
							}
						}
						// when no matches
					} else {
						// create new result based on predefined search text and noresult item
						const newResult = new Pipedrive.Model(
							_.assignIn(
								{
									name: this.presearchData.search.text
								},
								this.presearchData.noresult
							)
						);

						this.setResult(newResult);

						// don't show options list when 'blurOnNoResult' defined
						if (this.presearchData.result.blurOnNoResult) {
							this.onblur();
						}
					}
				} else {
					// explain this
					$(document).one(
						'mousedown.inputsearch',
						_.bind(function() {
							this.onblur();
						}, this)
					);
				}

				this.presearchData = null;
			}

			if (!this.collection.getActive()) {
				this.result = null;
				this.trigger('select', null);
			}
		},
		/* eslint-enable complexity */
		/* eslint-enable max-depth */

		// Selection changed, display new selection
		selected: function(model) {
			this.$list.find('li.active').removeClass('active');
			this.result = model;

			if (!model) {
				if (this._lastSelect !== null) {
					this.trigger('select', null);
				}

				return;
			}

			this.trigger('select', this.collection.getActive(), this.el);

			// model.view - direct reference to some other element - bad architecture :(
			model.view.$el.addClass('active');
		},

		setResult: function(result) {
			let value;

			if (!result) {
				return;
			}

			this.result = result;
			value = result.get('name');

			if (value === 'N/A' || typeof value === 'undefined') {
				value = result.get('title');
			}

			this.$el.val(value);
		},

		/**
		 * Trigger automatic search from input event
		 *
		 * @event pd-search
		 * @param queryObject Object
		 *
		 * @example
		 * preSearch: {
		 *		search: {
		 *			text: 'awddawadwadw',
		 *			term: 'same as text???'
		 *		},
		 *		result: {
		 *			id: 124124,
		 *			directMatchShowOtherOptions: true,
		 *			blurOnNoResult: true,
		 *		},
		 *		noresult: {}
		 * }
		 *
		 */
		preSearch: function(ev, queryObject) {
			if (!queryObject) {
				// create query object based on current input value
				queryObject = {};

				if ($.trim(this.$el.val()).length >= this.minimumQueryLength) {
					queryObject.search = {
						text: this.$el.val()
					};
					queryObject.noresult = {};
					queryObject.noresult[this.$el.attr('name')] = this.$el.val();
				}
			}

			if (_.isModel(queryObject)) {
				this.setResult(queryObject);
				this.onblur();

				return;
			}

			if (!_.isObject(queryObject.search)) {
				return;
			}

			this.presearchData = queryObject;
			this.collection.defaultValue = '';

			// fill input with text
			this.$el.val(queryObject.search.text);

			this.search(
				queryObject.search.term ? queryObject.search.term : queryObject.search.text
			);
		},

		reposition: function() {
			if (this.$el.parent().length) {
				let maxHeight = 195;

				const styles = {
					top: this.$el.parent().offset().top + this.$el.parent().outerHeight(),
					left: this.$el.parent().offset().left,
					width: this.$el.parent().outerWidth() - 2
				};
				const widgetHeight = $(window).height() - styles.top;

				if (widgetHeight < maxHeight) {
					maxHeight = widgetHeight - 20;
				}

				styles.maxHeight = maxHeight;

				this.$list.css(styles);
			}
		},

		hide: function() {
			this.collection.stopQuery();
			this.cancelResults = true;

			if (this.spinner) {
				this.$spinner.html('');
			}

			this.$clear.show();
			this.$el.removeClass('searching');

			this.$list.hide();
		},

		destroy: function() {
			this.hide();
			this.destroyList();

			this.$el.off('focus.autocompleter');
			this.$el.off('blur.autocompleter');
			this.$el.off('keyup.autocompleter');
			this.$el.off('keydown.autocompleter');

			this.remove();
		},

		addExcludeItem: function(id) {
			this.options.exclude.push(id);
		},

		removeExcludeItem: function(id) {
			_.remove(this.options.exclude, (excludedId) => {
				return excludedId === id;
			});
		}
	}
);

module.exports = InputSearch;
