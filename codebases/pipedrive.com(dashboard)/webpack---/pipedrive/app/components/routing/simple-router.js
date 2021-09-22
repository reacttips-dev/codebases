const _ = require('lodash');
const Backbone = require('backbone');

/**
 * An extension of Backbone.Router that allows manual calling of routing instead of depending on Backbone.History.
 *
 * @class components/routing/SimpleRouter
 *
 * @param {Object} options
 */
module.exports = Backbone.Router.extend(
	/** @lends components/routing/SimpleRouter.prototype */ {
		/**
		 * Override the route method on Backbone.Router to remember the handlers instead of passing them to Backbone.History.
		 * @param  {String}   route
		 * @param  {String}   name
		 * @param  {Function} callback
		 */
		route: function(route, name, callback) {
			if (!_.isRegExp(route)) {
				route = this._routeToRegExp(route);
			}

			if (_.isFunction(name)) {
				callback = name;
				name = '';
			}

			if (!callback) {
				callback = this[name];
			}

			if (!this.handlers) {
				this.handlers = [];
			}

			this.handlers.unshift({
				route,
				callback,
				name
			});
		},

		/**
		 * Override Router navigate to only trigger route callback
		 * @param  {String} fragment URL fragment to route to
		 * @param  {Object} options The options object can contain `trigger: true` if you wish to have the route callback be fired
		 * @return {Mixed}
		 */
		navigate: function(fragment, options) {
			if (!options || options === true) options = { trigger: !!options };

			// SimpleRouter.navigate ov trigger
			if (!options.trigger) return;

			return _.some(this.handlers, (handler) => {
				if (handler.route.test(fragment)) {
					const args = this._extractParameters(handler.route, fragment);

					if (handler.callback.apply(this, args) !== false) {
						this.trigger.apply(this, [`route:${handler.name}`].concat(args));
						this.trigger('route', handler.name, args);
					}

					return true;
				}
			});
		},

		/**
		 * Routing will be called manually instead of by history.
		 * @param  {String} fragment URL fragment to route to
		 * @return {Mixed}
		 */
		go: function(fragment) {
			return this.navigate(fragment, { trigger: true });
		}
	}
);
