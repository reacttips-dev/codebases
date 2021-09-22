const $ = require('jquery');

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const filterUtils = require('utils/filter-utils');
const User = require('models/user');
const GridView = require('views/grid-react/grid-react');
const DropMenu = require('views/ui/dropmenu');
const AsyncBulkEdit = require('components/bulk-actions');
const FiltersView = require('views/shared/filters');
const AlphabetView = require('views/lists/alphabet');
const EmptyListView = require('views/lists/empty-list');
const SummaryView = require('views/lists/summary');
const SendCampaignView = require('views/lists/send-campaign');
const ConvertToLeadView = require('views/lists/bulk-edit/convert-to-lead');
const ListViewAnalytics = require('utils/analytics/list-view-analytics');
const BulkEditUtils = require('utils/bulk-edit-utils');
const errorMessageTemplate = require('templates/lists/error-message.html');
const MarketplaceAppExtensions = require('views/shared/marketplace-app-extensions/index');
const componentLoader = require('webapp-component-loader');
const modals = require('utils/modals');
const { isContextualViewUserSettingsEnabled } = require('utils/contextual-view');
const { marketingStatusCoachMark } = require('views/shared/marketing-status-utils');
const PDMetrics = require('utils/pd-metrics');
const dealsUpsellDialog = require('components/deals-capping/upsellDialog');

/**
 * Static members of {@link views/ListView ListView}
 * @lends views/ListView
 */

const ListViewStatics = {
	/**
	 * Default options for ListView
	 * @memberOf views/ListView
	 * @enum {String}
	 */
	defaultOptions: {
		listSettings: null,
		/**
		 * Enable alphabet (if available)
		 * @type {Boolean}
		 * @default
		 */
		showAlphabet: false
	}
};

const getContextualViewToggleTooltipData = () => {
	return {
		preDelay: 200,
		postDelay: 200,
		zIndex: 20000,
		fadeOutSpeed: 100,
		position: 'bottom',
		clickCloses: true
	};
};

let local;

const ListView = Pipedrive.View.extend(
	{
		/**
		 * Default full page list view template
		 * @const {function}
		 * @default
		 */
		template: null,
		errorMessageTemplate: _.template(errorMessageTemplate),

		listSettings: null,

		/**
		 * List View
		 *
		 * @class Full page List View
		 * @constructs
		 * @augments module:Pipedrive.View
		 *
		 * @example
		 * <caption>Example of how ListView page is put together. It requires a
		 * collection and view configuration.</caption>
		 *
		 * var dealsListView = new ListView({
		 *     // Options for creating DealsListView
		 *     collection: this.collection,
		 *     // Show extended summary if available
		 *     showSummary: true
		 * });
		 * collectionView.render();
		 *
		 * @param {Object} options Options to set for the List view
		 * @returns {view/DealsListView} Returns itself for chaining
		 */
		initialize: function(options) {
			/**
			 * Options used in the List View.
			 *
			 * @type {Object}
			 * @prop {module:Pipedrive.Collection} collection Collection to use
			 * @prop {module:Pipedrive.View} childView Child View to render for each model
			 */

			this.options = _.assignIn({}, ListView.defaultOptions, options);
			this.listSettings = this.options.listSettings;

			this.components = {};
			this.listUrl = options.listUrl || '/';
			this.filtersLoaded = false;
			this.showAdditionalActions = this.getNeedAdditionalActions();
			this.hasErrorMessage = false;

			this.hasContextualViewFeatureFlagEnabled = User.companyFeatures.get(
				'contextual_view_release_2'
			);

			this.contextualViewToggleActive = isContextualViewUserSettingsEnabled();
			// Load filter info
			this.initFilters();

			this.listSettings.once('changed:filter', this.initChildViews, this);
			this.listSettings.once('changed:filter', this.showAfterLoadDialog, this);

			this.listSettings.on('changed:filter', local.handleFilterChange, this);

			if (this.options.showAlphabet) {
				this.collection.on('remove', local.onItemRemoved, this);
			}

			this.collection.on('add remove reset', local.onCollectionChanged, this);
			this.collection.on('remove', this.showActions, this);
			this.collection.on('error sync', local.hideSpinner, this);
			this.collection.on('error', local.onCollectionFetchingError, this);
			this.collection.on('request', local.showSpinner, this);
			this.collection.on('selected', local.onCheckboxSelected, this);

			this.summaryView = new SummaryView({
				type: this.collection.type,
				listSettings: this.listSettings
			});

			// Preload async bulk delete components
			Promise.all([
				componentLoader.load('froot:bulkActions'),
				componentLoader.load('froot:BulkProgressbar')
			]);

			this.showSendCampaign();

			// For chaining
			return this;
		},

		showAfterLoadDialog: function() {
			const dialogDetails = this.options.afterLoadDialog;

			if (!dialogDetails) {
				return;
			}

			const params = Object.fromEntries(new URLSearchParams(location.search));

			app.router.go(null, location.hash, false, false, params);
		},

		toggleContextualViewSettings: function(ev) {
			ev.preventDefault();

			const isCurrentlyOn = isContextualViewUserSettingsEnabled();

			PDMetrics.trackUsage(null, 'contextual_view', 'toggled', {
				toggle: !isCurrentlyOn
			});

			if (isCurrentlyOn) {
				User.settings.save({ contextual_view: false });
				ev.currentTarget.classList.remove('cui4-button--active');
				$(ev.currentTarget).tooltip({
					tip: _.gettext('Show details on the side'),
					...getContextualViewToggleTooltipData()
				});
			} else {
				User.settings.save({ contextual_view: true });
				ev.currentTarget.classList.add('cui4-button--active');
				$(ev.currentTarget).tooltip({
					tip: _.gettext('Open details in full view'),
					...getContextualViewToggleTooltipData()
				});
			}
		},

		createDropdownMenu: function() {
			const self = this;
			const additionalActionsView = new MarketplaceAppExtensions({
				type: 'action',
				resource: self.summaryView.type,
				view: 'list',
				collection: self.collection
			});

			this.selectSettings = new DropMenu({
				target: this.$('.selectSettings'),
				ui: 'arrowDropmenu',
				alignRight: true,
				getContentOnOpen: true,
				activeOnClick: false,
				additionalActionsView,
				onOpen: function(d, dropMenuCallback) {
					let data = local.getDefaultDropMenuData.call(self);

					if (self.options.dropMenuData) {
						data = data.concat(self.options.dropMenuData);
					}

					d.config.data = data;

					if (additionalActionsView && additionalActionsView.refresh) {
						additionalActionsView.refresh();
					}

					dropMenuCallback();
				}
			});
		},

		initChildViews: function() {
			this.initGridView();
			this.render();
			local.trackPageLoad.call(this);
		},

		initFilters: function() {
			this.getFilterUrl = this.options.getFilterUrl || this.getFilterUrl;

			// Filter add/edit dialog needs these
			this.pipeline = User.settings.get('current_pipeline_id');

			this.listSettings.loadFiltersCollection(() => {
				this.filtersLoaded = true;
				this.createFiltersView();
			});
		},

		initGridView: function() {
			this.hasAlphabet = this.getNeedAlphabet();
			this.hasEmptyView = this.getNeedEmptyView();
			this.hasBulkEdit = this.getNeedBulkEdit();

			this.gridView = new GridView({
				listSettings: this.listSettings,
				collection: this.collection,
				selectableRows: this.hasBulkEdit,
				onEditColumns: _.bind(local.onEditColumns, this),
				summary: this.summaryView
			});

			this.gridView.render();

			local.showAlphabet.call(this);
			local.showEmptyView.call(this);

			this.addView({
				'.grid': this.gridView,
				'.alphabetContainer': this.alphabetView,
				'.listSummaryContainer': this.summaryView,
				'.emptyView': this.emptyView
			});
		},

		/**
		 * Returns if the list page should be in empty view mode
		 * @return {Boolean} Returns `true` or `false`
		 */
		getNeedEmptyView: function() {
			return this.collection.length === 0 && this.collection.isPulled();
		},

		/**
		 * Returns if the list page should show alphabet or not
		 * @return {Boolean} Returns `true` or `false`
		 */
		getNeedAlphabet: function() {
			return !!this.collection.length && this.options.showAlphabet;
		},

		getNeedBulkEdit: function() {
			const isProductList = this.collection.type === 'product';
			const canEditProducts = User.settings.get('can_edit_products');
			const canBulkEdit = User.settings.get('can_bulk_edit_items');
			const isHideBulkEdit = this.options.hideBulkEdit;

			return (!isProductList || canEditProducts) && canBulkEdit && !isHideBulkEdit;
		},

		getNeedAlphabetReset: function() {
			return (
				this.hasAlphabet && !this.collection.length && this.collection.options.firstLetter
			);
		},

		/**
		 * Returns if the addtional actions option should be visible in list view
		 * @return {Boolean}
		 */
		getNeedAdditionalActions: function() {
			return (
				local.getDefaultDropMenuData.call(this).length > 0 || this.options.dropMenuData > 0
			);
		},

		/**
		 * Creates Filter dropdown view
		 * @void
		 */
		createFiltersView: function() {
			if (this.filtersView) {
				return;
			}

			this.filtersView = new FiltersView({
				customView: this.listSettings.getCustomView(),
				collection: this.listSettings.filtersCollection,
				defaultFilter: this.listSettings.getFilter(),
				getFilterUrl: _.bind(this.getFilterUrl, this),
				onFilterChange: _.bind(this.listSettings.setFilter, this.listSettings),
				filterType: this.collection.type
			});
			this.filtersView.render();
			this.addView('.filterMenuContainer', this.filtersView);
		},

		/**
		 * Called from FiltersView when filter is changed or URL is
		 * changed, it is called via Router
		 *
		 * @param {Object} config Configuration object (same format as with
		 *                        initialize).
		 * @void
		 */
		update: function(config) {
			if (config.filter && this.filtersView) {
				this.filtersView.updateSelectedFilter(config.filter);
			}
		},

		/**
		 * Returns URI for current list page with filter info
		 * @param  {String}        filterMode Indicating type of filter to use
		 *                                    (can be `filter` or `user`)
		 * @param  {Number|String} itemId     ID of the item
		 * @param  {String}        action     If filters dialog is open, this is
		 *                                    set to either `add` or `edit`
		 * @return {String}        Returns URL to use for current view state
		 */
		getFilterUrl: function(filterMode, itemId, action) {
			let returnVal = `${this.listUrl}/${filterMode}/${itemId}`;

			if (itemId === 'everyone') {
				returnVal = `${this.listUrl}/user/everyone`;
			}

			if (!_.isEmpty(action)) {
				returnVal += `/${action}`;
			}

			return returnVal;
		},

		selfRender: function() {
			this.hasAlphabet = this.getNeedAlphabet();
			this.hasEmptyView = this.getNeedEmptyView();
			this.hasBulkEdit = this.getNeedBulkEdit();

			if (this.emptyView && this.hasEmptyView) {
				this.emptyView.setFilter(this.filtersView.filter);
				this.emptyView.render();
			}

			if (this.asyncBulkEdit) {
				this.removeView('.selectedPillContainer');
			}

			if (this.convertToLeadView) {
				this.hideConvertToLead();
			}

			this.$el.html(this.template(this));

			if (this.hasErrorMessage) {
				this.$el.find('.errorMessage').html(this.errorMessageTemplate());
			}

			this.$('[data-text]').each(function() {
				$(this).tooltip({
					tip: this.getAttribute('data-text'),
					preDelay: 200,
					postDelay: 200,
					zIndex: 20000,
					fadeOutSpeed: 100,
					position: 'bottom'
				});
			});
			this.$('[data-conditional]').each(function() {
				$(this).tooltip({
					tip: this.getAttribute('data-text'),
					...getContextualViewToggleTooltipData()
				});
			});

			if (this.showAdditionalActions) {
				this.createDropdownMenu();
			}

			if (_.isFunction(this.options.onRender)) {
				this.options.onRender.call(this);
			}

			return this;
		},

		onUnload: function() {
			if (_.isFunction(this.collection.unbindSocketEvents)) {
				this.collection.unbindSocketEvents();
			}
		},
		getMapData: function() {
			const fields = local.getAddressFieldKey.call(this);
			const data = {
				fields: fields || [],
				items: {}
			};

			_.forEach(
				fields,
				_.bind(function(field) {
					data.items[field.key] = _.transform(
						this.collection.models,
						(collection, model) => {
							collection.push(model);
						},
						[]
					);
				}, this)
			);

			return data;
		},
		showMap: function() {
			const mapData = this.getMapData();

			modals.open('webapp:modal', {
				modal: 'map',
				params: {
					type: this.collection.type,
					field: mapData.fields[0],
					model: mapData.fields[0] ? mapData.items[mapData.fields[0].key][0] : null,
					fields: mapData.fields,
					collection: mapData.items,
					userSettings: User.settings
				}
			});
		},
		showActions: function() {
			this.$('.listSummaryContainer').removeClass('hidden');
			this.$('.filterMenuContainer').removeClass('hidden');
			this.$(`#${this.listSettings.addButtonId}`).removeClass('hidden');
		},
		hideActions: function() {
			this.$('.listSummaryContainer').addClass('hidden');
			this.$('.filterMenuContainer').addClass('hidden');
			this.$(`#${this.listSettings.addButtonId}`).addClass('hidden');
		},
		showBulkEdit: function() {
			this.asyncBulkEdit = new AsyncBulkEdit({
				collection: this.collection,
				listSettings: this.listSettings,
				canBulkDelete: this.options.canBulkDelete,
				bulkDeleteEl: this.$('.bulkDelete').get(0)
			});

			this.$('.additionalActions').css({
				position: 'absolute',
				right: '368px'
			});
		},
		hideBulkEdit: function() {
			if (this.asyncBulkEdit) {
				this.asyncBulkEdit.close();
				this.asyncBulkEdit = null;
				this.$('.additionalActions').css({ position: 'relative', right: 'unset' });
			}
		},
		showSendCampaign: function() {
			this.sendCampaignView = new SendCampaignView({
				collection: this.collection,
				listSettings: this.listSettings,
				container: this.$el,
				canAccessMarketingApp: this.options.canAccessMarketingApp
			});
			this.addView({
				'.sendCampaign': this.sendCampaignView
			});
			marketingStatusCoachMark.show('PROMOTE_MARKETING_CAMPAIGN');
		},
		hideSendCampaign: function() {
			this.sendCampaignView.remove();
			marketingStatusCoachMark.hide('PROMOTE_MARKETING_CAMPAIGN');
		},
		showConvertToLead: function() {
			if (this.convertToLeadView) {
				this.hideConvertToLead();
			}

			this.convertToLeadView = new ConvertToLeadView({
				listSettings: this.listSettings,
				collection: this.collection,
				summary: this.summaryView.getFormatted(),
				container: this.$el,
				canConvertToLead: this.options.canConvertToLead
			});

			this.addView({
				'.convertToLead': this.convertToLeadView
			});
		},
		hideConvertToLead: function() {
			this.convertToLeadView?.remove();
		},
		showToolbarSeparator: function() {
			if (
				User.companyFeatures.get('group_emailing_beta') ||
				this.options.canBulkDelete ||
				this.options.canConvertToLead
			) {
				this.$('.separator').show();
			}
		},
		hideToolbarSeparator: function() {
			this.$('.separator').hide();
		},
		trackViewOpened: function() {
			ListViewAnalytics.trackListViewOpened(this.listSettings);
		}
	},
	ListViewStatics
);

/**
 * Private methods of {@link views/ListView}
 * @memberOf views/ListView.prototype
 * @type {Object}
 * @enum {function}
 * @private
 */
local = {
	onCollectionChanged: function() {
		const alphabetChanged = this.hasAlphabet !== this.getNeedAlphabet();
		const bulkEditChanged = this.hasBulkEdit !== this.getNeedBulkEdit();
		const emptyViewChanged = this.hasEmptyView !== this.getNeedEmptyView();

		if (emptyViewChanged || alphabetChanged || bulkEditChanged || this.hasErrorMessage) {
			if (this.alphabetView && this.getNeedAlphabetReset()) {
				this.alphabetView.resetFirstLetter();

				return;
			}

			this.hasErrorMessage = false;
			this.render();
		}
	},

	onItemRemoved: function() {
		if (this.getNeedAlphabetReset()) {
			this.alphabetView.resetFirstLetter();
		}
	},

	showSpinner: function() {
		this.$('.activityIndicator').show();
	},

	hideSpinner: function() {
		this.$('.activityIndicator').hide();
	},

	getExportParams: function() {
		const exportParams = {
			collection: this.collection,
			summary: this.summaryView.getFormatted()
		};

		if (_.isFunction(this.options.getExtraExportParams)) {
			exportParams.extraParams = this.options.getExtraExportParams();
		}

		return exportParams;
	},
	/* eslint-disable complexity */

	getDefaultDropMenuData: function() {
		const data = [];
		const settings = this.options.additionalActionsSettings || {};

		if (!settings.hideExportLink && User.settings.get('can_export_data_from_lists')) {
			const exportModalType = this.options.isModalList ? 'details' : 'list';

			data.push({
				title: _.gettext('Export filter results...'),
				className: 'exportResults',
				click: () => {
					modals.open('webapp:modal', {
						modal: `export/${exportModalType}-export-modal`,
						params: local.getExportParams.call(this)
					});
				}
			});
		}

		if (User.get('is_admin') && !settings.hideImportLink) {
			data.push({
				title: _.gettext('Data import...'),
				className: 'imnportData',
				href: '/import'
			});
		}

		if (
			this.collection &&
			this.collection.type === 'deal' &&
			!this.collection?.options?.filter?.everyone && // disable for 'everyone' filter
			(User.settings.get('can_convert_deals_to_leads') || User.get('is_admin'))
		) {
			data.push({
				title: _.gettext('Convert filter results to Leads'),
				className: 'convertResults',
				click: _.bind(async function() {
					const filter = this.collection?.options?.filter;

					let options;

					if (filter.user_id) {
						options = { userId: filter.user_id };
					} else if (filter.filter_id) {
						options = { filterId: filter.filter_id };
					} else {
						return;
					}

					const dealsCount = this.listSettings.getSummary().get('total_count');

					modals.open('leadbox-fe:convert-modal', {
						filterBy: options,
						view: 'Filter',
						dealsCount
					});
				}, this)
			});
		}

		if (!settings.hideMapLink && local.getAddressFieldKey.call(this).length) {
			data.push({
				title: _.gettext('Show on map'),
				className: 'showOnMap',
				click: _.bind(this.showMap, this)
			});
		} else if (!settings.hideMapLink) {
			data.push({
				title: _.gettext('Show on map'),
				className: 'showOnMap'
			});
		}

		return data;
	},

	getAddressFieldKey: function() {
		let fields = [];

		const customView = this.listSettings.getCustomView();
		const viewColumns = customView.getColumnsFieldsArray();

		_.forEach(viewColumns, (field) => {
			if (field.column.field_type === 'address') {
				fields.push(field.column);
			}
		});

		fields = _.uniqBy(fields, 'key');

		return fields;
	},

	/**
	 * Callback to handle changed filter information
	 * @void
	 */
	handleFilterChange: function() {
		if (!window.location.href.includes(this.listUrl)) {
			return;
		}

		const filter = this.listSettings.filter;

		if (!filter.isTemp) {
			const filtersSettingsName = this.listSettings.filterSettingsName;
			const currentFilter = User.settings.get(filtersSettingsName);
			const filterSetting = filterUtils.stringify(filter);

			if (currentFilter !== filterSetting) {
				User.settings.set(filtersSettingsName, filterSetting);
				User.settings.save();
			}

			let url = `${this.listUrl}/${filter.type}/${filter.value}`;

			if (filter.isEdit) {
				url += '/edit';
			}

			url += window.location.search;

			if (window.location.href.includes(this.listUrl)) {
				app.router.go(null, url, true, true);
			}
		}
	},

	/**
	 * Opens column picker based on current custom view
	 *
	 * @param  {Event} ev Browser event used to open popover
	 * @void
	 */
	onEditColumns: async function(ev) {
		if (!this.listSettings.getCustomView()) {
			return;
		}

		const popover = await componentLoader.load('webapp:popover');

		popover.open({
			popover: 'column-picker',
			params: {
				listSettings: this.listSettings,
				position: 'left-start',
				target: ev.currentTarget
			}
		});
	},

	/**
	 * Shows alphabet if enabled
	 * @void
	 */
	showAlphabet: function() {
		// Alphabet view
		if (this.options.showAlphabet) {
			if (!this.alphabetView) {
				this.alphabetView = new AlphabetView({
					listSettings: this.listSettings
				});
				this.alphabetView.render();
			}
		}
	},

	/**
	 * Creates empty view
	 * @void
	 */
	showEmptyView: function() {
		// Handle empty view
		this.emptyView = new EmptyListView({
			collection: this.collection,
			listSettings: this.listSettings,
			listUrl: this.listUrl,
			showFilter: _.bind(local.editActiveFilter, this)
		});
	},

	/**
	 * Show edit filter dialog if clicked in EmptyView
	 * @void
	 */
	editActiveFilter: function(ev) {
		ev.preventDefault();
		ev.stopPropagation();

		const filter = this.listSettings.getFilter();

		modals.open('webapp:modal', {
			modal: 'filter/add',
			params: {
				listSettings: this.listSettings,
				filtersCollection: this.listSettings.filtersCollection,
				filterType: this.collection.type,
				filterModel: this.listSettings.filtersCollection.get(parseInt(filter.value, 10)),
				onFilterUpdate: _.bind(this.listSettings.setFilter, this.listSettings)
			},
			onAfterClose: false
		});
	},

	/**
	 * Shows Bulk edit if enabled
	 * @void
	 */
	onCheckboxSelected: function() {
		if (
			BulkEditUtils.hasSelectedItems(
				this.collection,
				this.listSettings.getSummary().get('total_count')
			)
		) {
			this.showBulkEdit();
			this.hideSendCampaign();
			this.showToolbarSeparator();
			this.showConvertToLead();
			this.hideActions();
		} else if (this.asyncBulkEdit) {
			this.hideBulkEdit();
			this.hideToolbarSeparator();
			this.hideConvertToLead();
			this.showActions();
			this.showSendCampaign();
		}
	},

	/**
	 * Track all list view page loads
	 */
	trackPageLoad: function() {
		_.defer(
			_.bind(ListViewAnalytics.trackPageLoad, this, {
				listType: this.collection.type,
				loadingStart: this.options.loadingStart
			})
		);
	},

	onCollectionFetchingError: function(collection, response) {
		if (response.responseJSON.code === 'feature_capping_deals_limit') {
			const element = this.$el.append($('<span class="dealsUpsellDialog" />'))[0];

			dealsUpsellDialog.render(element);

			return;
		}

		// Error message should not be shown in case the request was cancelled
		if (response.status === 0) {
			return;
		}

		this.hasErrorMessage = true;
		this.render();
	}
};

module.exports = ListView;
