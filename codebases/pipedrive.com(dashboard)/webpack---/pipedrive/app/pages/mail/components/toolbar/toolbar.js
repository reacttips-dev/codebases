'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const template = require('./toolbar.html');
const DropMenu = require('views/ui/dropmenu');
const PDMetrics = require('utils/pd-metrics');

const Toolbar = Pipedrive.View.extend({
	template: _.template(template),

	/**
	 * Custom content of the toolbar view should be passed as option
	 * @type {Object} View
	 */
	actionsBarView: null,

	events: {
		'click .settings a.button': 'onSettingsButtonClick'
	},

	initialize: function(options) {
		this.options = options || {};
		this.initChildViews();
	},

	onLoad: function() {
		this.render();
	},

	getTemplateHelpers: function() {
		return {
			showEllipsisButton: this.options.showEllipsisButton
		};
	},

	afterRender: function() {
		if (this.options.showEllipsisButton) {
			this.initializeDropMenus();
		}
	},

	initChildViews: function() {
		this.actionsBarView = this.options.actionsBarView;

		this.addView({
			'.actionsBar': this.actionsBarView
		});
	},

	getSettingsDropMenuData: function() {
		const data = [
			{
				id: 'goToSettings',
				test: 'goToSettings',
				title: _.gettext('Go to Mail settings'),
				click: _.bind(this.onSettingsButtonClick, this, true)
			}
		];

		return data;
	},

	onSettingsButtonClick: function() {
		app.router.go(null, '/settings/email-sync', true, false);
		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', {
			'mail-v2.feature': 'mail-page',
			'mail-v2.action': 'settings-button-click'
		});
	},

	initializeDropMenus: function() {
		const settingsData = this.getSettingsDropMenuData();

		this.settingsDropMenu = new DropMenu({
			target: this.$('.settings'),
			ui: 'arrowDropmenu',
			alignRight: true,
			data: settingsData,
			activeOnClick: true
		});
	}
});

module.exports = Toolbar;
