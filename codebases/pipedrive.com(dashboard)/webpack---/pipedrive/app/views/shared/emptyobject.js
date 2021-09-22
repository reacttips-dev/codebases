const Pipedrive = require('pipedrive');
const _ = require('lodash');
const EmptyObjectTemplate = require('templates/shared/emptyobject.html');

/**
 * Empty related content placeholder view.
 * Contains link to add data.
 *
 * @example
 * <pre>
 * this.dealsView = new EmptyObject({
 *   type: 'deal',
 *   model: this.model,
 *   addNewHandler: function(ev) {
 *   	ev.preventDefault();
 *   	app.router.go(null, '#dialog/deal/add', false , false, {addNew: true, model: this.model });
 *   }
 * });
 * </pre>
 *
 * @classdesc
 * Used as replacement where data list should be.
 *
 * @param  {Object}
 * @class views/shared/EmptyObject
 * @augments module:Pipedrive.View
 */

module.exports = Pipedrive.View.extend(
	/** @lends views/shared/EmptyObject.prototype */
	{
		template: _.template(EmptyObjectTemplate),

		/**
		 * Type of object connected to contact. Most likely 'deal'
		 * @type {String}
		 */
		type: '',

		initialize: function(options) {
			this.options = options || {};
			this.model = options.model;
			this.object = options.object;
			this.type = this.options.type || 'deal';
			this.render();
		},

		templateHelpers: function() {
			return {
				emptyMessage: this.getEmptyMessage(),
				type: this.type
			};
		},

		afterRender: function() {
			if (_.isFunction(this.options.onRender)) {
				this.options.onRender(this);
			}

			this.bindEvents();
		},

		getEmptyMessage: function() {
			let message = '';

			if (this.object === 'organization') {
				message = _.gettext('This organization has no related deals.');
			} else if (this.object === 'person') {
				message = _.gettext('This person has no related deals.');
			}

			return message;
		},

		bindEvents: function() {
			this.$('.addNew').on('click', _.bind(this.options.addNewHandler, this));
		},

		onUnload: function() {
			this.$el.html('');
			this.$('.addObject').off('click.addObject');
		}
	}
);
