const Pipedrive = require('pipedrive');
const _ = require('lodash');
const Helpers = require('utils/helpers');
const resultsTemplate = require('templates/shared/search-result-item.html');
const $ = require('jquery');
const SearchResultItem = Pipedrive.View.extend(
	/** @lends views/ui/SearchResultItem.prototype */ {
		tagName: 'li',
		template: _.template(resultsTemplate),
		events: {
			mouseout: 'clearActive',
			mouseover: 'setActive',
			mousedown: 'setResult'
		},
		initialize: function(opts) {
			if (typeof this.model !== 'undefined' && !_.isString(this.model)) {
				this.model.on('activate', this.activate, this);
				this.model.bindView(this);
			}

			this.options = opts;
			this.list = this.options.list;
		},
		setActive: function(ev) {
			if (_.isString(this.model)) {
				return;
			}

			if (ev.type === 'mouseover') {
				this.model.collection.setActive(this.model, '555');
			}
		},
		setResult: function(ev) {
			if (_.isString(this.model)) {
				return;
			}

			this.list.setResult(this.model);
			this.list.onblur(ev);

			if (ev) {
				ev.preventDefault();
				ev.stopImmediatePropagation();

				return false;
			}
		},
		activate: function(/* ev*/) {
			app.router.go(null, this.$el.find('a').attr('href'));
		},
		clearActive: function() {
			if (
				this.model &&
				this.model.collection &&
				_.isFunction(this.model.collection.clearActive)
			) {
				this.model.collection.clearActive();
			}
		},
		render: function() {
			if (this.model) {
				if (_.isString(this.model)) {
					this.$el.html(
						this.template({
							message: $('<div>')
								.text(this.model)
								.html(),
							result: null
						})
					);
					this.$el.addClass('search-message');
				} else {
					this.$el.html(
						this.template({
							result: this.model,
							highlight: _.bind(this.highlight, this)
						})
					);
				}
			}

			return this;
		},

		highlight: function(string) {
			return Helpers.highlight(string, this.list.el.value);
		}
	}
);

module.exports = SearchResultItem;
