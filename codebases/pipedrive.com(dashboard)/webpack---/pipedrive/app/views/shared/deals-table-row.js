'use strict';

const TableRowView = require('views/shared/table-row');
const _ = require('lodash');

let local;

const DealsTableRow = TableRowView.extend({
	/**
	 * Custom row view for Deals listView
	 * Extends views/shared/table-row
	 */
	initialize: function(options) {
		this.model.on('change:status', local.handleStatusChange, this);

		return TableRowView.prototype.initialize.call(this, options);
	},

	selfRender: function() {
		TableRowView.prototype.selfRender.call(this);
		local.addRowClass.call(this);
	}
});

local = {
	addRowClass: function() {
		const status = this.model.get('status');

		if (_.includes(['won', 'lost'], status)) {
			this.$el.addClass(status);
		}
	},

	handleStatusChange: function() {
		this.$el.removeClass('won lost');
		local.addRowClass.call(this);
	}
};

module.exports = DealsTableRow;
