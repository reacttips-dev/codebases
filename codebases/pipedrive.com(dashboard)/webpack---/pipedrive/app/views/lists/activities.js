'use strict';

const _ = require('lodash');
const moment = require('moment');
const $ = require('jquery');
const Pipedrive = require('pipedrive');
const User = require('models/user');
const ListView = require('views/lists/main');
const ActivitiesCollection = require('collections/activities');
const BulkEditUtils = require('utils/bulk-edit-utils');
const activitiesListTemplate = require('templates/lists/activities-page.html');
const ListSettings = require('models/list-settings');
const QuickFiltersView = require('views/lists/quick-filters');
const ActivityTypeFilter = require('views/activity-type-filter/index');
const statusFilters = require('utils/status-filters');
const PDMetrics = require('utils/pd-metrics');
const MomentHelper = require('utils/helpers-moment');
const SchedulerButtonTemplate = require('components/scheduler-2/schedule-picker/activities-button.html');
const SendGroupEmailView = require('pages/mail/views/send-group-email/send-group-email');
const componentLoader = require('webapp-component-loader');
const {
	isContextualViewFeatureEnabled,
	isContextualViewUserSettingsEnabled,
	contextualViewNewUsers,
	isLeadsInActivityListFeatureEnabled
} = require('utils/contextual-view');
const { isLeadColumnsInActivityListFeatureEnabled } = require('utils/columns-utils');
const { trackActivityStatusFilterApplied } = require('utils/analytics/activity-analytics');
const ActivityAnalytics = require('utils/analytics/activity-analytics');
const { isEmpty } = require('lodash');
const momentLocale = MomentHelper.LOCALE;
const CONTEXTUAL_VIEW_ID = 'activity_list_view';

let locals;

const ActivitiesListView = Pipedrive.View.extend(
	/** @lends views/deals/ActivitiesListView.prototype */ {
		stackable: true,

		events: {
			'click .calendarLinkIcon': 'onViewSwitched',
			'click .schedulingButton': 'onSchedulingBtnClicked'
		},

		/**
		 * Activities List View
		 *
		 * @class  Activities List View
		 * @constructs
		 * @augments module:Pipedrive.View
		 *
		 * @param {Object} options Options to set for the List view
		 * @returns {view/ActivitiesListView} Returns itself for chaining
		 */
		initialize: function(options) {
			this.options = options || {};
			this.collection = new ActivitiesCollection([], {
				statusFilterDisabled: _.bind(this.statusFilterDisabled, this)
			});
			this.listSettings = new ListSettings({
				customView: User.customViews.getView('activity'),
				collection: this.collection,
				filterSettingsName: 'filter_activities',
				customFilterParams: _.bind(this.getCustomFilterParams, this),
				columnPickerAvailableTypes: this.getColumnPickerAvailableTypes(),
				useIconsForTypes: isLeadColumnsInActivityListFeatureEnabled(),
				addButtonId: 'activitiesAddActivity'
			});

			this.listSettings.on('before:changed:filter', locals.onFilterChanged, this);
			this.listSettings.collection.on('selected', locals.onCheckboxSelected, this);

			this.initChildViews();
			this.bindMarkDoneEvents();
			this.onFocus();
			this.openContextualViewOnboardingDialog();

			return this;
		},

		getColumnPickerAvailableTypes: function() {
			const columnPickerTypes = ['activity', 'lead', 'deal', 'person', 'organization'];

			if (isLeadColumnsInActivityListFeatureEnabled()) {
				return columnPickerTypes;
			}

			return columnPickerTypes.filter((t) => t !== 'lead');
		},

		openContextualViewOnboardingDialog: async function() {
			if (
				contextualViewNewUsers() ||
				(!isContextualViewUserSettingsEnabled() &&
					User.companyFeatures.get('contextual_view_release_2'))
			) {
				const iamClient = await componentLoader.load('iam-client');

				let modalOpen = false;

				const coachmark = new iamClient.Coachmark({
					tag: 'contextualView_dialog',
					onReady: async function({ active }) {
						if (active) {
							modalOpen = false;
							const modals = await componentLoader.load('froot:modals');

							modals.open('froot:CVOnboardingDialog', {
								visible: true,
								onClose: () => {
									coachmark.close();

									const isEnabled = isContextualViewUserSettingsEnabled();

									if (!isEnabled) {
										User.settings.save({ contextual_view: true });
										PDMetrics.trackUsage(null, 'contextual_view', 'toggled', {
											toggle: true
										});

										const button = document.querySelectorAll(
											'.contextualViewToggle a'
										)[0];

										button?.classList.add('cui4-button--active');
										$(button).tooltip({
											tip: _.gettext('Open details in full view'),
											preDelay: 200,
											postDelay: 200,
											zIndex: 20000,
											fadeOutSpeed: 100,
											position: 'bottom',
											clickCloses: true
										});
									}
								}
							});

							modalOpen = true;
						}
					},
					onChange: async function(data) {
						if (!data.active && modalOpen) {
							const modals = await componentLoader.load('froot:modals');

							modals.close();

							modalOpen = false;
						}
					},
					__debug: false
				});
			}
		},

		loadContextualView: async function() {
			this.contextualView = await componentLoader.load('froot:contextualView');
		},

		onLoad: function() {
			this.trackViewOpened();
		},

		update: function(opts) {
			this.listView.update(opts);
		},

		trackViewOpened: function() {
			const summaryModel = this.listSettings.getSummary();

			summaryModel.on(
				'sync',
				function() {
					const filterData = this.listSettings.filter;

					let activeFilterType = null;

					if (filterData.type === 'user') {
						activeFilterType = filterData.value === 'everyone' ? 'everyone' : 'user';
					} else if (filterData.type === 'filter') {
						activeFilterType = 'custom';
					}

					app.global.fire('track.activity.view.loaded', {
						activity_count: summaryModel.get('total_count'),
						active_filter_type: activeFilterType,
						view_type: 'activities-list'
					});
				},
				this
			);
		},

		onFocus: function() {
			this.listView.trackViewOpened();

			if (isContextualViewFeatureEnabled()) {
				this.handleContextualView(window.location.search);
				this.router?.on('searchChange', this.onSearchChange);
			}
		},
		statusFilterDisabled: function() {
			return this.statusFilterView.disabled;
		},
		bindMarkDoneEvents: function() {
			const self = this;

			this.$el.on('change', '[data-field="done"] input[type="checkbox"]', function() {
				const elementWithData = $(this).closest('[data-id]');
				const activityId = elementWithData.data('id');
				const activity = self.collection.get(parseInt(activityId, 10));

				if (activity) {
					activity.toggleDoneState();
				}
			});
		},
		wireUpContextualView: function() {
			componentLoader.load('froot:router').then((router) => {
				this.router = router;
				this.onSearchChange = this.onSearchChange.bind(this);
				this.removeContextualView = this.removeContextualView.bind(this);
				this.router.on('searchChange', this.onSearchChange);
				this.collection.once('sync', this.checkContextualViewRequested, this);
				this.collection.on('selected', this.onSelected, this);
				this.bindGlobalEvents();
			});
		},
		removeContextualView: function() {
			this.contextualView?.isOpen(CONTEXTUAL_VIEW_ID) && this.contextualView?.close();
		},
		bindGlobalEvents: function() {
			app.global.bind('deal.model.*.*', this.onSocketEvent, this);
			app.global.bind('person.model.*.*', this.onSocketEvent, this);
			app.global.bind('organization.model.*.*', this.onSocketEvent, this);
			app.global.bind('activity.model.*.*', this.onSocketEvent, this);
		},
		unbindGlobalEvents: function() {
			app.global.unbind('deal.model.*.*', this.onSocketEvent, this);
			app.global.unbind('person.model.*.*', this.onSocketEvent, this);
			app.global.unbind('organization.model.*.*', this.onSocketEvent, this);
			app.global.unbind('activity.model.*.*', this.onSocketEvent, this);
		},
		isSocketEventRelevant: function(event) {
			// for marking activity as done, `meta` is limited
			if (event?.get('done') === true) {
				return true;
			}

			if (event?.meta.action === 'added') {
				return event.meta.object === 'activity';
			}

			const updatedEntityId = event?.get('id');

			switch (event?.meta.object) {
				case 'deal':
					return this.contextualViewModel.get('deal_id') === updatedEntityId;
				case 'person':
					return this.contextualViewModel.get('person_id') === updatedEntityId;
				case 'organization':
					return this.contextualViewModel.get('org_id') === updatedEntityId;
				case 'activity':
					return this.contextualViewModel.get('id') === updatedEntityId;
			}

			return false;
		},
		onSocketEvent: function(...rest) {
			if (!this.contextualViewModel || !isContextualViewUserSettingsEnabled()) {
				return false;
			}

			// for `delete action, event comes second
			const event = rest[1] || rest[0];

			if (isEmpty(event)) {
				return;
			}

			if (this.isSocketEventRelevant(event)) {
				this.checkContextualViewRequested();
			}
		},
		checkContextualViewRequested: function() {
			const search = window.location.search;

			this.handleContextualView(search);
		},
		onSearchChange: function({ search }) {
			this.handleContextualView(search);
		},
		onSelected: function(selected) {
			// Close contextual view if bulk edit is activated
			if (selected) {
				this.closeContextualView();
			}
		},
		handleContextualView: function(search) {
			if (!isContextualViewUserSettingsEnabled()) {
				return;
			}

			const urlParams = new URLSearchParams(search);
			const selectedIdStr = urlParams.get('selected');
			const selectedTab = urlParams.get('tab') || 'activity';

			if (selectedIdStr) {
				this.openContextualView(parseInt(selectedIdStr, 10), selectedTab);
			}
		},
		openContextualView: async function(activityId, selectedItem) {
			const model = this.collection.get(activityId);

			if (!model) {
				this.closeContextualView();

				return;
			}

			const dealOrLeadType = (activity) => {
				const leadsInActivityListFeatureEnabled = isLeadsInActivityListFeatureEnabled();
				const isLead = activity.get('lead_id');
				const isDeal = activity.get('deal_id');

				return isLead && !isDeal && leadsInActivityListFeatureEnabled ? 'lead' : 'deal';
			};

			// Clear bulk edit selection
			this.listView.gridView?.bulkEditSettings.selectAll(false);

			this.contextualViewModel = model;
			this.contextualViewTab = selectedItem;
			this.setContextualViewSelection(model);

			this.getDealOrLeadTabContent = (dealId, leadId) => {
				if (dealId) {
					return {
						componentName: 'webapp:deal-details-view',
						componentOptions: {
							id: dealId,
							isContextualView: true
						}
					};
				}

				if (leadId) {
					return {
						componentName: 'leadbox-fe:lead-details-view',
						componentOptions: {
							leadUuid: leadId,
							onUpdate: (updatedLead) => {
								this.handleLeadUpdate(updatedLead);
							}
						}
					};
				}

				return this.getDealOrLeadLinkEntity();
			};

			this.handleLeadUpdate = ({ title }) => {
				const leadModel = model.getRelatedModel('lead', model.get('lead_id'));

				if (!leadModel) {
					return;
				}

				// update lead_title column for all activities
				app.global.fire(
					`lead.model.${leadModel.get('id')}.update`,
					leadModel.set({ title })
				);

				// update contextual view tab title
				this.checkContextualViewRequested();
			};

			this.getDealOrLeadLinkEntity = () => {
				const prefill = {};
				const relatedOrg = model.getRelatedModel('organization', model.get('org_id'));
				const relatedPerson = model.getRelatedModel('person', model.get('person_id'));

				if (relatedOrg) {
					prefill.org_id = {
						id: relatedOrg.get('id'),
						name: relatedOrg.get('name')
					};
					prefill.related_org_id = {
						id: relatedOrg.get('id'),
						name: relatedOrg.get('name')
					};
				}

				if (relatedPerson) {
					prefill.person_id = {
						id: relatedPerson.get('id'),
						name: relatedPerson.get('name')
					};
					prefill.related_person_id = {
						id: relatedPerson.get('id'),
						name: relatedPerson.get('name')
					};
				}

				return {
					componentName: 'froot:LinkEntity',
					componentOptions: {
						entityType: isLeadsInActivityListFeatureEnabled() ? 'DealOrLead' : 'Deal',
						onLink: (e) => this.handleLinkedDealOrLead(e),
						rootEntityId: activityId,
						prefill
					}
				};
			};

			this.getPersonTabContent = (personId) => {
				if (personId) {
					return {
						componentName: 'webapp:person-details-view',
						componentOptions: {
							id: personId,
							isContextualView: true
						}
					};
				}

				const prefill = {};
				const relatedOrg = model.getRelatedModel('organization', model.get('org_id'));

				if (relatedOrg) {
					prefill.org_id = {
						id: relatedOrg.get('id'),
						name: relatedOrg.get('name')
					};
				}

				return {
					componentName: 'froot:LinkEntity',
					componentOptions: {
						entityType: 'Person',
						onLink: (e) => this.handleLinkedPerson(e),
						rootEntityId: activityId,
						prefill
					}
				};
			};

			this.getOrganizationTabContent = (orgId) => {
				if (orgId) {
					return {
						componentName: 'webapp:organization-details-view',
						componentOptions: {
							id: orgId,
							isContextualView: true
						}
					};
				}

				return {
					componentName: 'froot:LinkEntity',
					componentOptions: {
						entityType: 'Organization',
						onLink: (e) => this.handleLinkedOrganization(e),
						rootEntityId: activityId
					}
				};
			};

			this.setSelectedTabType = (newType) => {
				if (newType !== this.contextualViewTab) {
					const search = window.location.search;
					const urlParams = new URLSearchParams(search);

					urlParams.set('tab', newType);

					this.router.navigateTo(`${window.location.pathname}?${urlParams.toString()}`, {
						replace: true,
						silent: true
					});

					this.contextualViewTab = newType;
				}
			};

			this.getAdjacentActivity = (isNext, index) => {
				const adjacentItemIndex = isNext ? index + 1 : index - 1;

				const isNotInCollectionAnymore = this.collection.indexOf(model) < 0;

				if (isNotInCollectionAnymore) {
					if (isNext) {
						return this.collection.at(index);
					}

					return this.collection.at(index - 1);
				}

				const adjacentItem = this.collection.at(adjacentItemIndex);

				return adjacentItem;
			};

			this.hasDataForTab = (model, tabType) => {
				switch (tabType) {
					case 'activity':
						return true;
					case 'organization':
						return model.has('org_id');
					case 'person':
						return model.has('person_id');
					case 'deal':
						return model.has('deal_id');
					case 'lead':
						return model.has('lead_id');
					default:
						return false;
				}
			};

			this.changeSelectedItem = (activityId, selectedTabType) => {
				const urlParams = new URLSearchParams(window.location.search);

				urlParams.set('selected', activityId);

				this.router.navigateTo(`${window.location.pathname}?${urlParams.toString()}`, {
					search: `?${urlParams.toString()}`
				});

				this.openContextualView(activityId, selectedTabType);
			};

			this.getTrackingData = (isNext, index) => {
				const adjacentActivity = this.getAdjacentActivity(isNext, index);
				const selectedTabType = this.contextualViewTab;

				if (!adjacentActivity) {
					return { selectedTabType, hasDataForSelectedTab: false };
				}

				const adjacentActivityId = adjacentActivity.get('id');
				const selectedTabSubType =
					selectedTabType === 'deal' ? dealOrLeadType(adjacentActivity) : null;

				const hasDataForSelectedTab = this.hasDataForTab(
					adjacentActivity,
					selectedTabSubType || selectedTabType
				);

				this.changeSelectedItem(adjacentActivityId, selectedTabType);

				return { selectedTabType, selectedTabSubType, hasDataForSelectedTab };
			};

			const getContextualViewValues = () => {
				const leadsInActivityListFeatureEnabled = isLeadsInActivityListFeatureEnabled();
				const deal = model.getRelatedModel('deal', model.get('deal_id'));
				const lead =
					leadsInActivityListFeatureEnabled &&
					model.getRelatedModel('lead', model.get('lead_id'));
				const person = model.getRelatedModel('person', model.get('person_id'));
				const organization = model.getRelatedModel('organization', model.get('org_id'));

				const dealOrLeadTab = () => {
					// if feature flag is not enabled, lead will be false
					const linkedTabTitle = deal?.get('title') || (lead && lead.get('title'));
					const linkedTabSubType = lead && !deal ? 'lead' : 'deal';
					const unlinkedTabTitle = leadsInActivityListFeatureEnabled
						? _.gettext('Deal or lead')
						: _.gettext('Deal');

					return {
						tabType: 'deal',
						tabSubType: linkedTabSubType,
						tabTitle: linkedTabTitle || unlinkedTabTitle,
						tabIcon: linkedTabSubType,
						tabLink: deal?.getLink() || (lead && lead.getLink()),
						content: this.getDealOrLeadTabContent(
							model.get('deal_id'),
							leadsInActivityListFeatureEnabled && model.get('lead_id')
						)
					};
				};

				return {
					componentName: 'froot:TabbedComponents',
					id: CONTEXTUAL_VIEW_ID,
					componentOptions: {
						defaultTab: this.contextualViewTab,
						onTabActivation: this.setSelectedTabType,
						tabs: [
							{
								tabType: 'activity',
								tabTitle: model.getDynamicSubject(),
								tabIcon: `ac-${model.getTypeIcon()}`,
								content: {
									componentName: 'activities-components:activities-modal',
									componentOptions: {
										activityId: model.id,
										isContextualView: true,
										onClose: () => this.closeContextualView()
									}
								}
							},
							dealOrLeadTab(),
							{
								tabType: 'person',
								tabTitle: person?.get('name') || _.gettext('Person'),
								tabIcon: 'person',
								tabLink: person?.getLink(),
								content: this.getPersonTabContent(model.get('person_id'))
							},
							{
								tabType: 'organization',
								tabTitle: organization?.get('name') || _.gettext('Organization'),
								tabIcon: 'organization',
								tabLink: organization?.getLink(),
								content: this.getOrganizationTabContent(model.get('org_id'))
							}
						]
					}
				};
			};

			this.open = () => {
				const currentItemIndex = this.collection.indexOf(model);
				const hasNextActivity = !!this.getAdjacentActivity(true, currentItemIndex);
				const hasPreviousActivity = !!this.getAdjacentActivity(false, currentItemIndex);

				if (!this.contextualView) {
					this.loadContextualView();
				}

				this.contextualView.open({
					...getContextualViewValues(),
					onClose: () => {
						this.removeContextualView();
						this.closeContextualView();
					},
					onNext:
						hasNextActivity &&
						(() => {
							return { trackingData: this.getTrackingData(true, currentItemIndex) };
						}),
					onPrevious:
						hasPreviousActivity &&
						(() => {
							return { trackingData: this.getTrackingData(false, currentItemIndex) };
						})
				});
			};

			this.handleLinkedPerson = (person) => {
				const changes = { person_id: person.id };

				if (!model.has('org_id')) {
					changes.org_id = person.org_id;
				}

				model.saveChanges(changes);

				ActivityAnalytics.trackActivityFormSaved({
					model: model.attributes,
					previous: model._previousAttributes,
					isNew: false,
					linkedRelatedObject: 'person'
				});
				this.open();
			};

			this.handleLinkedOrganization = (org) => {
				const changes = { org_id: org.id };

				if (!model.has('person_id')) {
					changes.person_id = org.person_id;
				}

				model.saveChanges(changes);

				ActivityAnalytics.trackActivityFormSaved({
					model: model.attributes,
					previous: model._previousAttributes,
					isNew: false,
					linkedRelatedObject: 'organization'
				});
				this.open();
			};

			this.handleLinkedDealOrLead = (dealOrLead) => {
				const isLead = dealOrLead.type === 'lead';
				const changes = isLead ? { lead_id: dealOrLead.id } : { deal_id: dealOrLead.id };

				if (!model.has('org_id')) {
					changes.org_id = dealOrLead.org_id;
				}

				if (!model.has('person_id')) {
					changes.person_id = dealOrLead.person_id;
				}

				model.saveChanges(changes);

				ActivityAnalytics.trackActivityFormSaved({
					model: model.attributes,
					previous: model._previousAttributes,
					isNew: false,
					linkedRelatedObject: isLead ? 'lead' : 'deal'
				});
				this.open();
			};

			this.open();
		},
		triggerToggleCoachMark: async function() {
			if (isContextualViewFeatureEnabled()) {
				const iamClient = await componentLoader.load('iam-client');

				const coachmark = new iamClient.Coachmark({
					tag: 'contextualView_toggle',
					parent: document.getElementById('contextualViewToggleParent'),
					content: _.gettext(
						'Toggle between showing details on the side and navigating to the full view'
					),
					appearance: {
						placement: 'bottom',
						zIndex: 10,
						width: 320
					},
					__debug: false
				});

				return coachmark;
			}
		},
		closeContextualView: function() {
			const urlParams = new URLSearchParams(window.location.search);
			const selectedIdStr = urlParams.get('selected');

			this.setContextualViewSelection(null);

			if (selectedIdStr) {
				urlParams.delete('selected');
				this.router.navigateTo(window.location.pathname, {
					search: `?${urlParams.toString()}`
				});
				this.triggerToggleCoachMark();

				return;
			}

			this.removeContextualView();
		},
		setContextualViewSelection: function(model) {
			this.collection
				.where({ highlighted_in_list: true })
				?.forEach((model) => model.set({ highlighted_in_list: false }, { silent: true }));

			if (model) {
				model.set('highlighted_in_list', true);
			}

			this.listView.gridView?.gridReactStore.updateSelection();
		},
		initChildViews: function() {
			const listViewSettings = {
				el: this.el,
				listUrl: `/activities/list${location.hash}`,
				collection: this.collection,
				listSettings: this.listSettings,
				canBulkDelete: User.settings.get('can_delete_activities'),
				dropMenuData: this.getDropMenuData(),
				additionalActionsSettings: {
					hideMapLink: true
				},
				columnDependencies: {
					person_id: _.bind(this.collection.getRelatedColumns, this.collection, 'person'),
					org_id: _.bind(
						this.collection.getRelatedColumns,
						this.collection,
						'organization'
					),
					deal_id: _.bind(this.collection.getRelatedColumns, this.collection, 'deal')
				},
				loadingStart: this.options.loadingStart,
				getExtraExportParams: this.getCustomFilterParams.bind(this),
				afterLoadDialog: this.options.afterLoadDialog
			};

			this.listView = new ListView(listViewSettings);
			this.typeFilterView = this.buildActivityTypesFilter();
			this.statusFilterView = this.buildActivityStatusFilter();

			this.listView.addView({
				'.types': this.typeFilterView,
				'.statuses': this.statusFilterView
			});

			if (User.companyFeatures.get('group_emailing_beta')) {
				this.sendGroupEmailView = new SendGroupEmailView();
				this.listView.addView({ '.sendGroupEmail': this.sendGroupEmailView });

				this.collection.on('selected sorted', () =>
					this.sendGroupEmailView.onSelected(
						'activity',
						this.collection,
						this.listSettings.summaryModel.get('total_count')
					)
				);
			}

			if (isContextualViewFeatureEnabled()) {
				this.loadContextualView();
				this.wireUpContextualView();
			}

			this.listView.template = _.template(activitiesListTemplate);
			this.listView.render();

			this.initScheduler();

			PDMetrics.trackPage('Activities list');
		},

		prepareTypeFilterValues: function(includedTypes, excludedTypes) {
			if (includedTypes.length < excludedTypes.length) {
				this.activityTypeFilter = includedTypes.join(',');
				this.activityTypeExcludeFilter = null;
			} else {
				this.activityTypeFilter = null;
				this.activityTypeExcludeFilter = excludedTypes.join(',');
			}
		},

		buildActivityTypesFilter: function() {
			const activityTypes = _.map(User.getActivityTypes(), 'key_string');
			const userSettingValue = User.settings.get('activity_quickfilter_excluded_types');
			const excludedTypes = userSettingValue ? userSettingValue.split(',') : [];
			const shouldShowDeactivatedTypes = locals.shouldShowDeactiveTypes(
				activityTypes,
				excludedTypes
			);
			const ignoredTypes = shouldShowDeactivatedTypes
				? excludedTypes
				: _.union(excludedTypes, User.getDeactivatedActivityTypeNames());
			const includedTypes = _.difference(activityTypes, ignoredTypes);

			this.prepareTypeFilterValues(includedTypes, excludedTypes);

			return new ActivityTypeFilter({
				disabled: false,
				onChange: function(includedTypes, excludedTypes) {
					this.prepareTypeFilterValues(includedTypes, excludedTypes);

					this.listSettings.customFilterParamsChanged();

					User.settings.set(
						'activity_quickfilter_excluded_types',
						excludedTypes.join(',')
					);
					User.settings.save();
					app.global.fire('track.activity.typeFilter.click', includedTypes.join(','));
				}.bind(this)
			});
		},

		buildActivityStatusFilter: function() {
			const defaultStatusFilter = locals.getStatusFilter();
			const opts = locals.getCustomTimeRangeFilter();

			this.statusFilter = locals.createStatusFilter(defaultStatusFilter, opts);
			this.statusFilter.start_date = locals.getLocalizedDate(this.statusFilter.start_date);
			this.statusFilter.end_date = locals.getLocalizedDate(this.statusFilter.end_date);

			const quickFilterView = new QuickFiltersView({
				filters: locals.selectQuickFilter(defaultStatusFilter, statusFilters.descriptions),
				key: 'status',
				customDates: opts,
				collection: this.collection,
				onChange: _.bind(function(filter, opts) {
					this.options.loadingStart = $.now();
					this.statusFilter = locals.createStatusFilter.call(this, filter, opts);
					this.statusFilter.start_date = locals.getLocalizedDate(
						this.statusFilter.start_date
					);
					this.statusFilter.end_date = locals.getLocalizedDate(
						this.statusFilter.end_date
					);
					this.listSettings.customFilterParamsChanged();

					let keyString;

					if (opts) {
						const dateFrom = moment(opts.dateFrom, 'L')
							.locale(momentLocale)
							.format('YYYY-MM-DD');
						const dateTo = moment(opts.dateTo, 'L')
							.locale(momentLocale)
							.format('YYYY-MM-DD');

						keyString = `customTimeRange ${dateFrom} ${dateTo}`;
					} else {
						keyString = filter;
					}

					User.settings.set('activity_quickfilter_range', keyString);
					User.settings.save();
					trackActivityStatusFilterApplied(filter, this.listSettings.getSummary());
				}, this)
			});

			if (defaultStatusFilter === 'customTimeRange') {
				quickFilterView.setCustomTimeRangeLabelText(opts);
			}

			return quickFilterView;
		},

		initScheduler: function() {
			const SchedulePicker = require('components/scheduler-2/schedule-picker/index');
			const schedulerButtonTemplate = _.template(SchedulerButtonTemplate);

			this.schedulePicker = new SchedulePicker({
				type: 'popover',
				entryPointName: 'activitiesList',
				popoverPlacement: 'bottom-start',
				popoverButtonTemplate: schedulerButtonTemplate
			});

			this.listView.addView({ '.schedulingButton': this.schedulePicker });
		},

		getCustomFilterParams: function() {
			const params = {
				get_summary: 1,
				type: null,
				start_date: '',
				end_date: '',
				done: null,
				exclude_type: null
			};

			if (!this.typeFilterView.disabled) {
				params.type = this.activityTypeFilter;
				params.exclude_type = this.activityTypeExcludeFilter;
			}

			if (!this.statusFilterView.disabled) {
				params.start_date = locals.getLocalizedDate(this.statusFilter.start_date);
				params.end_date = locals.getLocalizedDate(this.statusFilter.end_date);
				params.done = this.statusFilter.done;
			}

			return params;
		},

		onSettingsClicked: async function(e) {
			e.preventDefault();

			app.global.fire('track.activity.activitySettings.click');

			componentLoader
				.load('froot:router')
				.then((router) => router.navigateTo(`/settings/activity_settings`));
		},

		getDropMenuData: function() {
			if (User.get('is_admin')) {
				return [
					{
						title: _.gettext('Activity settings'),
						className: 'activityTypes',
						href: '#',
						click: (e) => this.onSettingsClicked(e)
					}
				];
			}
		},

		onBlur: function() {
			if (isContextualViewFeatureEnabled()) {
				this.router?.off('searchChange', this.onSearchChange);
				this.setContextualViewSelection(null);
				this.removeContextualView();
			}
		},

		onUnload: function() {
			this.listView.destroy(true);
			this.typeFilterView.destroy();
			this.router?.off('searchChange', this.onSearchChange);
			this.collection.off('sync', this.checkContextualViewRequested, this);
			this.collection.off('selected', this.onSelected, this);
			this.unbindGlobalEvents();
		},

		onViewSwitched: function() {
			app.global.fire('track.activity.viewSwitch.click', 'activity_calendar_view');
		},

		onSchedulingBtnClicked: function() {
			app.global.fire('track.activity.schedulingButton.click', 'activity_list_view');
		}
	}
);

locals = {
	selectQuickFilter: function(filter, filters) {
		const selectedFilter = _.find(filters, { key_string: filter });

		if (selectedFilter) {
			selectedFilter.checked = true;
		}

		return filters;
	},
	getStatusFilter: function() {
		const filterSettings = User.settings.get('activity_quickfilter_range');

		return filterSettings ? filterSettings.split(' ')[0] : 'planned';
	},
	getCustomTimeRangeFilter: function() {
		let filterData = {};

		const filterSettings = User.settings.get('activity_quickfilter_range');

		if (filterSettings && filterSettings.split(' ').length === 3) {
			filterData = {
				dateFrom: moment(filterSettings.split(' ')[1]).format('L'),
				dateTo: moment(filterSettings.split(' ')[2]).format('L')
			};
		}

		return filterData;
	},
	createStatusFilter: function(filter, opts) {
		if (statusFilters.filters[filter]) {
			return statusFilters.filters[filter](opts);
		}

		return statusFilters.filters.planned();
	},
	getLocalizedDate: function(date) {
		if (!date) {
			return date;
		}

		return moment(date)
			.locale('en')
			.format('YYYY-MM-DD HH:mm');
	},

	onFilterChanged: function() {
		const self = this;
		const filter = this.listSettings.getFilterModel();

		if (filter) {
			if (filter.get('conditions')) {
				locals.disableQuickFilters.call(self, false, filter);
			} else {
				filter.pull({
					success: _.bind(locals.disableQuickFilters, self, true)
				});
			}
		} else {
			locals.setTypeFilterVisibility.call(this, true);
			locals.setStatusFilterVisibility.call(this, true);
		}
	},

	disableQuickFilters: function(conditionsFetched, filter) {
		const filterFields = [];
		const activityFields = User.fields.get('activity');

		_.forEach(filter.get('conditions').conditions, (condition) => {
			_.forEach(condition.conditions, (condition) => {
				filterFields.push(parseInt(condition.field_id, 10));
			});
		});

		const typeField = _(activityFields).find({ key: 'type' }).id;
		const statusFields = _.reduce(
			activityFields,
			(result, o) => {
				if (['due_date', 'marked_as_done_time'].includes(o.key)) {
					result.push(o.id);
				}

				return result;
			},
			[]
		);

		locals.setTypeFilterVisibility.call(
			this,
			_.indexOf(filterFields, typeField) < 0,
			conditionsFetched
		);
		locals.setStatusFilterVisibility.call(
			this,
			_.isEmpty(_.intersection(filterFields, statusFields)),
			conditionsFetched
		);
	},

	setTypeFilterVisibility: function(isEnabled, conditionsFetched) {
		const disabled = !isEnabled;

		this.typeFilterView.disabled = disabled;
		this.typeFilterView.renderActivityTypeFilter();

		locals.checkPullCollection.call(this, conditionsFetched);
	},

	setStatusFilterVisibility: function(isEnabled, conditionsFetched) {
		if (isEnabled) {
			this.statusFilterView.disabled = false;
			this.statusFilterView.enable();
		} else {
			this.statusFilterView.disabled = true;
			this.statusFilterView.disable();

			locals.createTooltip({
				el: this.$el.find('.statuses .quickFilters > div'),
				text: _.gettext('Date field already selected in current filter'),
				position: 'bottom'
			});
		}

		locals.checkPullCollection.call(this, conditionsFetched);
	},

	createTooltip: function(options) {
		$(options.el).tooltip({
			tip: options.text,
			tipHtml: options.tipHtml,
			preDelay: 0,
			postDelay: 0,
			zIndex: 20000,
			fadeOutSpeed: 100,
			position: options.position,
			maxWidth: options.maxWidth
		});
	},

	checkPullCollection: function(conditionsFetched) {
		if (!conditionsFetched) {
			return;
		}

		if (this.listSettings.collection.pulling()) {
			this.listSettings.collection.lastFetchRequest.abort();
		}

		this.listSettings.pullCollection();
	},

	/**
	 * Deactivated activity types should be shown in the list only if all types of activities are
	 * selected (nothing is excluded) or all types are unselected, in which case we also show everything.
	 */
	shouldShowDeactiveTypes: function(activityTypes, excludedTypes) {
		return excludedTypes.length === 0 || _.isEqual(activityTypes, excludedTypes);
	},

	/**
	 * Handles statuses quickfilters visibility state
	 * @void
	 */
	onCheckboxSelected: function() {
		if (
			BulkEditUtils.hasSelectedItems(
				this.collection,
				this.listSettings.getSummary().get('total_count')
			)
		) {
			this.$('.statuses').addClass('hidden');
			this.$('.schedulingButton').addClass('hidden');
		} else {
			this.$('.statuses').removeClass('hidden');
			this.$('.schedulingButton').removeClass('hidden');
		}
	}
};

module.exports = ActivitiesListView;
