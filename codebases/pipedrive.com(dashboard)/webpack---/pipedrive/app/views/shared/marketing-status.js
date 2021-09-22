const Pipedrive = require('pipedrive');
const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const { InlineInfo } = require('@pipedrive/convention-ui-react');

const User = require('models/user');
const Template = require('templates/shared/marketing-status.html');
const componentLoader = require('webapp-component-loader');
const logger = new Pipedrive.Logger(`webapp.${app.ENV}`, 'marketingStatusSelect');
const {
	checkMarketingStatusChangeRights,
	MARKETING_STATUSES
} = require('views/shared/marketing-status-utils');

const fieldStates = {
	READ: 'READ',
	EDIT: 'EDIT'
};

module.exports = Pipedrive.View.extend(
	/** @lends views/MarketingStatusView.prototype */ {
		template: _.template(Template.replace(/>\s+</g, '><')),
		saving: false,

		/**
		 * Default settings, override these in constructor options. <br> Use this as example what to pass into constructor
		 * @const {Object}
		 * @enum {string}
		 */
		defaultOptions: {
			model: null
		},

		/**
		 * Marketing Status view class
		 *
		 * @class MarketingStatusView view class
		 * @constructs
		 * @augments module:Pipedrive.View
		 *
		 * @example
		 *	this.marketingStatusFieldsView = new MarketingStatusView({
		 *		model: this.model
		 *	});
		 *
		 * @param {object} options options object
		 * @param {object} options.model related model
		 */
		initialize: function(options) {
			componentLoader.load('marketing-ui:marketingStatusSelect');
			this.options = _.assignIn({}, this.defaultOptions, options);
			this.status = this.model.get('marketing_status') || MARKETING_STATUSES.NO_CONSENT;
			this.state = fieldStates.READ;
			this.editableValue = null;
			this.render();
			this.model.onChange('email', this.render, this);
		},
		edit: function() {
			this.state = fieldStates.EDIT;
			this.editableValue = this.status;
			this.loadMarketingStatusSelect();
			this.render();
		},
		save: function() {
			const data = {
				marketing_status: this.editableValue,
				id: this.model.get('id')
			};

			this.model.set(data);

			if (this.model.hasChanged()) {
				this.model.save(null, {
					success: _.bind(function() {
						this.status = this.editableValue;
						this.cancel();
					}, this)
				});
			}
		},
		cancel: function() {
			this.state = fieldStates.READ;
			this.editableValue = null;
			this.render();
		},
		onButtonClick: function(ev) {
			ev.preventDefault();
			ev.stopPropagation();

			const $btn = this.$(ev.currentTarget);

			if ($btn.hasClass('edit')) {
				this.edit();
			} else if ($btn.hasClass('save')) {
				this.save();
			} else {
				this.cancel();
			}
		},
		bindEvents: function() {
			this.$('.action').on('click', _.bind(this.onButtonClick, this));
		},
		loadMarketingStatusSelect: async function() {
			const component = 'marketing-ui:marketingStatusSelect';

			const updateStatus = (value) => {
				this.editableValue = value;
			};

			const MicroFEComponent = await componentLoader.load('froot:MicroFEComponent');

			this.render();

			try {
				ReactDOM.render(
					<MicroFEComponent
						componentName={component}
						componentProps={{ value: this.editableValue, onChange: updateStatus }}
					/>,
					this.$('.fieldLoader').get(0)
				);
			} catch (err) {
				logger.log('Could not load service: marketing-ui:marketingStatusSelect', {
					error_message: err
				});
			}
		},
		afterRender: function() {
			const target = this.$el.find('#marketing-inline-info');

			try {
				ReactDOM.render(
					<InlineInfo
						placement="right-start"
						text={_.gettext(
							"The email is pulled from the contact's email (the first one, if there are multiple)"
						)}
						showLinkIcon
					/>,
					target.get(0)
				);
			} catch (err) {
				logger.log('Could not load component: InlineInfo', {
					error_message: err
				});
			}
		},
		getEmailValue: function(emails) {
			if (!emails || !emails.length) return '-';

			const primaryEmail = emails.find((email) => email.primary);

			return primaryEmail ? primaryEmail.value : emails[0].value;
		},
		selfRender: function() {
			const emails = this.model.get('email');

			let canChangeMarketingStatus = checkMarketingStatusChangeRights(emails, this.status);

			let marketingStatusOption = {};

			let errorMessage = null;

			const marketingStatusDef = User.fields
				.get('person')
				.find((field) => field.key === 'marketing_status');

			if (marketingStatusDef) {
				marketingStatusOption = marketingStatusDef.options.find(
					(option) => option.id === this.status
				);
			} else {
				errorMessage = _.gettext('Marketing status field not defined');
				canChangeMarketingStatus = false;
			}

			const items = [
				{
					key: 'email',
					label: _.gettext('Email'),
					value: this.getEmailValue(emails),
					editable: false,
					state: fieldStates.READ
				},
				{
					key: 'marketing-status',
					label: _.gettext('Status'),
					value: this.status,
					editable: canChangeMarketingStatus,
					state: this.state
				}
			];

			this.$el.html(
				this.template(
					_.assignIn(this, {
						items,
						marketingStatusOption,
						errorMessage
					})
				)
			);

			if (canChangeMarketingStatus) {
				this.bindEvents();
			}
		}
	}
);
