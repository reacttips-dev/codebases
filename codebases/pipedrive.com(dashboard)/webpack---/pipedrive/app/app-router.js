const Pipedrive = require('pipedrive');
const ViewStack = require('components/routing/view-stack');
const _ = require('lodash');
const moment = require('moment');
const User = require('models/user');
const Helpers = require('utils/helpers');
const $ = require('jquery');
const logger = new Pipedrive.Logger(`webapp.${app.ENV}`, 'router');

const AppRouter = {
	lastRoute: '',

	initialize: function() {
		this.viewStack = new ViewStack({
			container: $('#application')
		});
	},

	setLastRoute: function(lastRoute) {
		this.lastRoute = lastRoute;
		app.router.lastRoute = lastRoute;
	},

	switchCurrentView: function(View, viewKey, opts) {
		if (viewKey.includes('undefined') || viewKey.includes('/user')) {
			return;
		}

		const currentView = this.viewStack.getCurrent();

		if (currentView && currentView.key === viewKey) {
			return;
		}

		let view = this.viewStack.get(viewKey);

		// See if the currentView is stackable, if not remove rather than hide

		if (currentView) {
			if (currentView.instance.stackable) {
				this.viewStack.hide(currentView);
			} else {
				this.viewStack.remove(currentView);
			}
		}

		// Check if the desired view is already present in the view stack.
		if (view) {
			// If desired view is found then set it first and show it.
			this.viewStack.setCurrent(view);
			this.viewStack.show(view);
		} else {
			// If the desired view is not found, instantiate it and show that.
			view = this.viewStack.create(viewKey, View, opts);
		}

		this.currentView = view.instance;
	},

	redirect: function() {
		// Handled in Router.go
		return true;
	},

	timeline: async function(interval, date, settings) {
		logger.log('timeline called');

		if (this.lastRoute === 'timeline') {
			this.currentView.reset();

			return;
		}

		if (
			typeof date === 'undefined' &&
			typeof interval !== 'undefined' &&
			moment(interval).isValid()
		) {
			date = interval;
		}

		const { default: Timeline } = await import(
			/* webpackChunkName: "page-timeline" */
			'views/timeline/timeline'
		);

		this.switchCurrentView(Timeline, 'timeline', {
			interval,
			date,
			settings
		});
	},

	mail: async function(path) {
		logger.log('mail called');

		const router = this.currentView?.router;

		if (path && router) {
			router.go(path);
		} else {
			const { default: Mail } = await import(
				/* webpackChunkName: "page-mail" */
				'pages/mail/index'
			);

			this.switchCurrentView(Mail, 'mail', {});
			this.currentView.router.go(path);
		}
	},

	dashboard: async function(period, pipelineId) {
		const insightsReportingOnly = User.companyFeatures.get('insights_reporting_only');

		if (insightsReportingOnly) {
			return app.router.go(null, '/progress/insights', { trigger: false, replace: true });
		} else {
			const { default: Dashboard } = await import(
				/* webpackChunkName: "page-dashboard" */
				'views/dashboard'
			);

			if (this.lastRoute === 'dashboard' && this.currentView instanceof Dashboard) {
				this.currentView.update(period, pipelineId);
			} else {
				this.switchCurrentView(Dashboard, 'dashboard', {
					period,
					pipelineId
				});
			}
		}
	},

	deal: async function(id) {
		if (_.isUndefined(id)) {
			return this.redirect();
		}

		const opts = {
			id
		};

		const { default: DealView } = await import(
			/* webpackChunkName: "page-deal" */
			'views/deal/main'
		);

		this.switchCurrentView(DealView, `deal/${id}`, opts);
	},

	dealTab: async function(id, tab) {
		const opts = {
			id,
			tab
		};

		const { default: DealView } = await import(
			/* webpackChunkName: "page-deal" */
			'views/deal/main'
		);

		this.switchCurrentView(DealView, `deal/${id}`, opts);
	},

	person: async function(id) {
		const { default: PersonView } = await import(
			/* webpackChunkName: "page-person" */
			'views/person/main'
		);

		this.switchCurrentView(PersonView, `person/${id}`, { id });
	},

	organization: async function(id) {
		const { default: OrganizationView } = await import(
			/* webpackChunkName: "page-organization" */
			'views/organization/main'
		);

		this.switchCurrentView(OrganizationView, `organization/${id}`, {
			id
		});
	},

	// Deals list view
	deals: async function(filterType, filter, action) {
		const opts = {
			action: null,
			loadingStart: $.now()
		};

		this.setFilterOptions(opts, filterType, filter, action);

		if (this.lastRoute === 'deals' && _.isObject(this.currentView)) {
			this.currentView.listView.update(opts);
		} else {
			const { default: DealsListView } = await import(
				/* webpackChunkName: "page-lists-deals" */
				'views/lists/deals'
			);

			this.switchCurrentView(DealsListView, 'dealsList', opts);

			if (this.currentView && this.currentView.listView && this.currentView.listView.update) {
				this.currentView.listView.update(opts);
			}
		}

		Helpers.title.set(_.gettext('Deals'));
	},

	persons: async function(filterType, filter, action) {
		const opts = {
			action: null,
			loadingStart: $.now()
		};

		this.setFilterOptions(opts, filterType, filter, action);

		if (this.lastRoute === 'persons' && _.isObject(this.currentView)) {
			this.currentView.listView.update(opts);
		} else {
			const { default: PersonsListView } = await import(
				/* webpackChunkName: "page-lists-persons" */
				'views/lists/persons'
			);

			this.switchCurrentView(PersonsListView, 'personsList', opts);
			this.currentView?.listView?.update(opts);
		}

		Helpers.title.set(_.gettext('People'));
	},

	organizations: async function(filterType, filter, action) {
		const opts = {
			action: null,
			loadingStart: $.now()
		};

		this.setFilterOptions(opts, filterType, filter, action);

		if (this.lastRoute === 'organizations' && _.isObject(this.currentView)) {
			this.currentView.listView.update(opts);
		} else {
			const { default: OrganizationsListView } = await import(
				/* webpackChunkName: "page-lists-organizations" */
				'views/lists/organizations'
			);

			this.switchCurrentView(OrganizationsListView, 'organizationsList', opts);
			this.currentView?.listView?.update(opts);
		}

		Helpers.title.set(_.gettext('Organizations'));
	},

	activities: async function(filterType, filter, action) {
		const opts = {
			action: null,
			loadingStart: $.now(),
			afterLoadDialog: location.hash.match(/#dialog\/activity\/(.*)$/)
		};

		this.setFilterOptions(opts, filterType, filter, action);

		if (this.lastRoute === 'activities' && _.isObject(this.currentView)) {
			this.currentView.activitySubView.update(opts);
		} else {
			const [
				{ default: ActivityWrapperView },
				{ default: ActivityListView }
			] = await Promise.all([
				import(
					/* webpackChunkName: "page-activity-wrapper" */ 'views/activity/activity-wrapper'
				),
				import(/* webpackChunkName: "page-lists-activities" */ 'views/lists/activities')
			]);

			opts.activityView = ActivityListView;
			this.switchCurrentView(ActivityWrapperView, 'activities-wrapper-list', opts);
		}

		Helpers.title.set(_.gettext('Activities'));
	},

	product: async function(id) {
		const { default: ProductDetailsView } = await import(
			/* webpackChunkName: "page-product" */
			'views/product'
		);

		this.switchCurrentView(ProductDetailsView, `product/${id}`, {
			id
		});
	},

	products: async function(filterType, filter, action) {
		const opts = {
			action: null
		};

		this.setFilterOptions(opts, filterType, filter, action);

		if (this.lastRoute === 'products' && _.isObject(this.currentView)) {
			this.currentView.listView.update(opts);
		} else {
			const { default: ProductsListView } = await import(
				/* webpackChunkName: "page-lists-products" */
				'views/lists/products'
			);

			this.switchCurrentView(ProductsListView, 'productsList', opts);
		}

		Helpers.title.set(_.gettext('Products'));
	},

	calendar: async function(filterType, filter) {
		const opts = {
			action: null,
			loadingStart: $.now(),
			afterLoadDialog: location.hash.match(/#dialog\/activity\/(.*)$/)
		};
		const switchViewCallback = function(ActivityWrapperView, ActivityCalendarView) {
			opts.activityView = ActivityCalendarView;
			this.switchCurrentView(ActivityWrapperView, 'activities-wrapper-calendar', opts);
		}.bind(this);

		this.setFilterOptions(opts, filterType, filter);

		const [
			{ default: ActivityWrapperView },
			{ default: ActivityListView }
		] = await Promise.all([
			import(
				/* webpackChunkName: "page-activity-wrapper" */ 'views/activity/activity-wrapper'
			),
			import(
				/* webpackChunkName: "page-activities-calendar-v2" */ 'views/activities-calendar-v2/index'
			)
		]);

		switchViewCallback(ActivityWrapperView, ActivityListView);

		Helpers.title.set(_.gettext('Calendar'));
	},

	setFilterOptions: function(opts, filterType, filter, action) {
		const userFilter = filterType === 'user';
		const userOrFilterType = ['user', 'filter'].includes(filterType);

		if (filter && userOrFilterType) {
			opts.filter = {
				type: filterType,
				value: filter
			};

			if (!(userFilter && filter === 'everyone')) {
				opts.filter.value = parseInt(opts.filter.value, 10);
			}

			if (userFilter && filter === 'all_users') {
				opts.filter.value = 'everyone';
			}
		}

		if (_.isString(action) && opts.filter) {
			opts.filter.action = action;
		}
	},

	flags: {
		/**
		 * If set to "true", next link clicks browser default action will not be prevented and the page will be reloaded.
		 * The flag is set to "true" when a global socket message with property "action" set to "deploy" is received.
		 *
		 * @type {Boolean}
		 */
		pageReloadNeeded: false
	},

	setFlag: function(flag, bool) {
		if (!this.flags.hasOwnProperty(flag)) {
			logger.log('Tried to set an unexpected flag "', flag, '" with value:', bool);

			return;
		}

		logger.log('Setting value', bool, `to flag "${flag}".`);
		this.flags[flag] = bool;
	}
};

module.exports = AppRouter;
