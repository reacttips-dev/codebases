'use strict';

const Pipedrive = require('pipedrive');
const MailThreadBodyView = require('./single-thread-body/single-thread-body');
const SingleThreadView = Pipedrive.View.extend({
	initialize: function(options) {
		this.options = options;
		this.initThreadModel();
	},

	/**
	 * Empty method that is overwritten in extended classes
	 * @void
	 */
	initThreadModel: function() {},

	onThreadModelReady: function() {
		this.initChildViews();
		this.render();
	},

	initChildViews: function() {
		this.mailThreadBodyView = new MailThreadBodyView({
			threadModel: this.threadModel
		});
		this.addView({
			'.singleThreadContent': this.mailThreadBodyView
		});
	}
});

module.exports = SingleThreadView;
