'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const CombinedObjects = require('collections/combined-objects');
const ListView = require('views/lists/main');
const ListSettings = require('models/list-settings');
const personsListTemplate = require('templates/lists/persons-page.html');
const PDMetrics = require('utils/pd-metrics');
const SendGroupEmailView = require('pages/mail/views/send-group-email/send-group-email');
const ContactSyncMessageView = require('views/contact-sync-message');
const modals = require('utils/modals');
const componentLoader = require('webapp-component-loader');
const PersonsListView = Pipedrive.View.extend(
	/** @lends views/deals/PersonsListView.prototype */ {
		stackable: true,

		/**
		 * Persons List View
		 *
		 * @class  Persons List View
		 * @constructs
		 * @augments module:Pipedrive.View
		 *
		 * @param {Object} options Options to set for the List view
		 * @returns {view/PersonsListView} Returns itself for chaining
		 */
		initialize: function(options) {
			this.options = options || {};

			this.collection = new CombinedObjects(null, {
				type: 'person',
				alphabet: true
			});

			this.listSettings = new ListSettings({
				customView: User.customViews.getView('person'),
				collection: this.collection,
				filterSettingsName: 'filter_people',
				summaryParams: {
					get_alphabet: 1
				},
				columnPickerAvailableTypes: ['person', 'organization'],
				addButtonId: 'personsAddPerson'
			});

			this.initChildViews();
			this.onFocus();

			return this;
		},
		getDropMenuData: function() {
			const data = [];

			if (User.companyFeatures.get('contact_sync')) {
				data.push({
					title: _.gettext('Contact Sync'),
					href: '/settings/contact-sync'
				});
			}

			if (User.companyFeatures.get('merge_duplicates')) {
				data.push({
					title: _.gettext('Merge duplicates'),
					href: '/settings/duplicates?type=person'
				});
			}

			if (!!User.get('is_admin') || User.settings.get('can_export_data_from_lists')) {
				data.push({
					title: _.gettext('Export to MailChimp'),
					className: 'mailChimp',
					click: _.bind(function() {
						modals.open('webapp:modal', {
							modal: 'mailchimp/export',
							params: {
								personsCollection: this.collection,
								summary: this.listView.summaryView.getFormatted()
							}
						});
					}, this)
				});
			}

			return data;
		},

		/**
		 * Initialize ListView and other child views
		 * @void
		 */
		initChildViews: function() {
			this.listView = new ListView({
				el: this.el,
				listUrl: '/persons/list',
				collection: this.collection,
				listSettings: this.listSettings,
				showAlphabet: true,
				canBulkDelete: !!User.get('is_admin'),
				dropMenuData: this.getDropMenuData(),
				canAccessMarketingApp:
					!!User.companyFeatures.get('marketing_app') && User.hasSuite('MARKETING'),
				columnDependencies: {
					org_id: _.bind(
						this.collection.getRelatedColumns,
						this.collection,
						'organization'
					)
				},
				loadingStart: this.options.loadingStart
			});

			if (User.companyFeatures.get('marketing_app')) {
				componentLoader.load('marketing-ui:marketingStatusSelect');
			}

			if (User.companyFeatures.get('contact_sync')) {
				this.listView.addView({ '.contactSyncMessage': new ContactSyncMessageView() });
			}

			if (User.companyFeatures.get('group_emailing_beta')) {
				this.sendGroupEmailView = new SendGroupEmailView();
				this.listView.addView({ '.sendGroupEmail': this.sendGroupEmailView });

				this.collection.on('selected sorted', () => {
					this.sendGroupEmailView.onSelected(
						'person',
						this.collection,
						this.listSettings.summaryModel.get('total_count')
					);
				});
			}

			this.listView.template = _.template(personsListTemplate);
			this.listView.render();

			PDMetrics.trackPage('Contacts people list');
		},

		onUnload: function() {
			this.listView.destroy(true);
		},

		onFocus: function() {
			this.listView.trackViewOpened();
		}
	}
);

module.exports = PersonsListView;
