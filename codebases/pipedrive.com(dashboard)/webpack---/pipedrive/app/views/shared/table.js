const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const StickyHeader = require('views/shared/sticky-table-header');
const CollectionView = require('views/collectionview');
const TableRowView = require('views/shared/table-row');
const TableRowPlaceholderView = require('views/shared/table-row-placeholder');
const TableSorting = require('utils/table-sorting');
const ClickAndDrag = require('utils/click-and-drag-to-select');
const Helpers = require('utils/helpers');
const DropMenu = require('views/ui/dropmenu');
const ListSettings = require('models/list-settings');
const tableTemplate = require('templates/shared/table.html');
const tableRowMoreTemplate = require('templates/shared/table-row-more.html');
const fakeMouseEvent = require('utils/mouse-event-polyfill');
const sortUtils = require('utils/sort-utils');
const $ = require('jquery');

let local;

const TableView = Pipedrive.View.extend(
	/** @lends views/shared/Table.prototype */ {
		template: _.template(tableTemplate),

		collectionView: null,
		collection: null,

		sorting: null,
		listSettings: null,
		hiddenSelectedItems: null,

		$scroller: null,

		autoLoadMoreTimeout: null,

		allowStickyHeaderResize: true,

		predefinedSortOrder: {},

		/**
		 * Basic Table view core class
		 *
		 * @class Basic Table view
		 * @constructs
		 * @augments module:Pipedrive.View
		 *
		 * @example
		 * <caption>Simple usage of Table view based on people list</caption>
		 *
		 * (new TableView({
		 *     collection: peopleCollection,
		 *     columns: {
		 *         'id': 'ID',
		 *         'name': 'Name'
		 *     }
		 * })).render();
		 *
		 * @param {Object} options Options to set for the Table view
		 * @returns {views/shared/Table} Returns itself for chaining
		 */
		initialize: function(options) {
			/**
			 * Options used for generating table view
			 * @type {Object}
			 * @prop {Object} columns `key:value` pairs of columns to render
			 * @prop {module:Pipedrive.Collection} collection Collection to use
			 *       for data
			 * @prop {boolean} showActions Toggles whether to display actions
			 *       column or not
			 */
			this.options = _.assignIn({}, TableView.defaultOptions, options);

			this.collection = this.options.collection;
			this.listSettings =
				this.options.listSettings ||
				new ListSettings({
					collection: this.collection
				});
			this.hiddenSelectedIds = [];

			this.updateColumnsAndSortOrder();

			this.predefinedSortOrder = this.getDefaultSortOrders();

			if (this.options.sorting) {
				this.sorting = new TableSorting({
					defaultSortOrder: this.predefinedSortOrder || {}
				});
				this.sorting.on('change', this.onSortingChanged, this);
			}

			this.initChildViews();
			this.checkSelectedColumnIsSortable();

			if (this.options.sorting && this.options.sortOrder) {
				this.sorting.updateColumnsDefaultSortOrder(this.predefinedSortOrder);
				this.sorting.setSortOrder(sortUtils.trimSortKey(this.options.sortOrder));
			}

			// If callCollectionPull is not set, it’s the same as paging options
			if (_.isUndefined(this.options.callCollectionPull)) {
				this.options.callCollectionPull = this.options.paging;
			}

			// collection view handles pulling unless paging is turned on
			const isEmptyCollection = !this.collection.length && !this.collection.pulling();

			if (this.options.callCollectionPull && isEmptyCollection) {
				this.loadNextPage(true);
			}

			this.collection.on('afterPull', local.handleCollectionPull, this);
			this.collection.on('sync modelChange remove', local.resizeStickyHeader, this);
			this.collection.on('sync', local.checkScrollForMore, this);

			this.listSettings.on('changed:custom-view', this.setColumns, this);

			this.onWindow('resize.table', _.debounce(_.bind(this.checkScrollForMore, this), 100));

			app.global.bind('*.model.*.update', local.resizeStickyHeader, this);

			app.global.bind('ui.event.router.change', this.remove, this);
			app.global.bind('ui.modal.dialog.close', this.remove, this);

			return this;
		},

		/**
		 * Checks if accidentally there's a column chosen that is not sortable and breaks modal
		 * If that is the case then choose a random column and set it as default sorted column to avoid breaking
		 * @void
		 */
		checkSelectedColumnIsSortable: function() {
			const selectedColumnSort = this.options.sortOrder.split(' ')[0];

			const columns = this.options.columns;

			if (columns[selectedColumnSort] && !columns[selectedColumnSort].sortable_flag) {
				const randomColumnKey = Object.keys(this.predefinedSortOrder)[0];

				this.options.sortOrder = `${randomColumnKey} ${this.predefinedSortOrder[randomColumnKey]}`;
			}
		},

		/**
		 * Move table columns
		 *
		 * @void
		 */
		setColumns: function() {
			if (this.options.nonBlockingLoading) {
				local.hideStickyHeader.call(this);
			}

			this.updateHeaderData();
			this.collection.trigger('reset');
			this.render();
			local.resizeStickyHeader.call(this);
		},

		/**
		 * Update table and collectionview with new column data
		 *
		 * @void
		 */
		updateHeaderData: function() {
			this.updateColumnsAndSortOrder();
			this.collectionView.updateColumns(this.options.columns);

			if (this.sorting) {
				const defaultSortOrders = this.getDefaultSortOrders();

				this.sorting.updateColumnsDefaultSortOrder(defaultSortOrders);
				this.sorting.setSortOrder(this.options.sortOrder);
			}
		},

		updateColumnsAndSortOrder: function() {
			const customView = this.listSettings.getCustomView();

			if (customView) {
				this.options.columns = customView.getColumnsFields();
				this.options.sortOrder = customView.getColumnsSortOrder();
			}
		},

		/**
		 * Loads more list items if there are more on the server and is scrolled to the bottom of the page.
		 * Also, toggles "Loading more rows" messages.
		 *
		 * @private
		 * @void
		 */
		checkScrollForMore: function() {
			const hasScroller = this.$scroller && !!this.$scroller.length;

			const hasMore = this.collection.isPulled() && this.collection.hasMore();

			if (!this.options.paging || !hasMore || !hasScroller || !this.isScrolledToBottom()) {
				local.hideLoadMore.call(this);
			} else {
				local.showLoadMore.call(this);
				this.loadNextPage();
			}
		},

		/**
		 * Checks whether the scrolling container is scrolled to the bottom
		 *
		 * @return {Boolean}
		 */
		isScrolledToBottom: function() {
			if (this.$el.is(':hidden')) {
				return false;
			}

			let isScrolledToBottom = false;

			const hasScrollbar = this.$scroller.height() < this.$scroller.get(0).scrollHeight;

			if (hasScrollbar) {
				const detectionHeight = 50;

				const scrollCurrent = this.$scroller.scrollTop() + this.$scroller.height();

				const scrollTotal = this.$scroller.get(0).scrollHeight;

				if (scrollCurrent > scrollTotal - detectionHeight) {
					isScrolledToBottom = true;
				}
			} else {
				// no scrollbar = more fits = try to load more
				isScrolledToBottom = true;
			}

			return isScrolledToBottom;
		},

		/**
		 * Binds the scroll event listener to the closest scrollable anchestor.
		 *
		 * @void
		 */
		bindScrollListener: function() {
			if (!this.options.paging || this.hasScrollContainer()) {
				return;
			}

			// finds parents that have overflow set to scroll
			const $scrollContainer = Helpers.getParentWithScroll(this.$el);

			if ($scrollContainer.length) {
				// unbind previous container (if was removed from DOM)
				if (this.$scroller) {
					this.$scroller.off('scroll.table');
				}

				this.$scroller = $scrollContainer;

				const throttledScrollCallback = _.throttle(this.checkScrollForMore, 200);

				this.$scroller.on('scroll.table', _.bind(throttledScrollCallback, this));

				this.checkScrollForMore();
			}
		},

		/**
		 * Checks whether the scrollable container already found - meaning: the the binding has already been done,
		 * and checks whether the container is actually in the DOM, not just a virtual element.
		 *
		 * @return {Boolean}
		 */
		hasScrollContainer: function() {
			return this.$scroller && $.contains(document.documentElement, this.$scroller[0]);
		},

		/**
		 * Initialize child views
		 *
		 * This implements {@link views/CollectionView} to render easily
		 * controllable list. When collection is updated, CollectionView
		 * takes care of keeping its child items in correct positions.
		 */
		initChildViews: function() {
			const collectionViewOptions = {
				collection: this.collection,
				childView: this.options.customRowView || TableRowView,
				placeholderView: TableRowPlaceholderView,
				callCollectionPull: this.options.callCollectionPull,
				tagName: 'tbody'
			};

			const tableRowOptions = {
				tagName: 'tr',
				showActions: this.options.showActions,
				selectableRows: this.options.selectableRows,
				showEditColumns: this.options.showEditColumns,
				removeButtonTooltip: this.options.removeButtonTooltip,
				handleRemoveClick: this.options.handleRemoveClick,
				customColumnsCount: this.options.customColumnsCount,
				nonBlockingLoading: this.options.nonBlockingLoading,
				customTemplate: this.options.customTemplate,
				onLastRowRendered: _.bind(local.afterLastRowRendered, this),
				onLastRowInDOM: _.bind(this.afterLastRowInDOM, this),
				columnDependencies: this.options.columnDependencies
			};

			const collectionViewCallbacks = {
				onModelRemove: this.options.onModelRemove
			};

			if (this.options.stickyHeader) {
				this.initStickyHeader();
			}

			tableRowOptions.columns = _.keys(this.options.columns);

			this.collectionView = new CollectionView(
				collectionViewOptions,
				tableRowOptions,
				collectionViewCallbacks
			);

			if (this.options.sorting && !this.options.stickyHeader) {
				this.$el.on('click.table', 'th[data-field]', _.bind(this.onColumnClick, this));
			}

			if (this.options.selectableRows) {
				this.collection.selectedIds = [];
				this.collection.excludedIds = [];
				this.$el.on(
					'click.table',
					'th.selectableRow .selectAll',
					_.bind(this.selectAll, this)
				);
				this.$el.on(
					'click.table',
					'.selectRowInput, .selectableRow',
					_.bind(local.delegateClickToCheckbox, this)
				);
				this.$el.on(
					'click.table',
					'.selectRowInput input',
					_.bind(local.onSelectRowInputClicked, this)
				);
				this.collection.on('selected', local.onSelected, this);
				this.collection.on('reset', local.setSelectedRows, this);
				this.clickAndDrag = new ClickAndDrag(this.$el, 'td.selectRowInput');
			}

			if (this.options.showEditColumns && this.options.onEditColumns) {
				this.$el.on('click.table', 'th.customize', this.options.onEditColumns);
			}

			this.collectionView.render();

			this.addView({
				'table.list tbody': this.collectionView
			});
		},

		/**
		 * Initializes Sticky Header
		 * @void
		 */
		initStickyHeader: function() {
			const stickyOptions = {
				container: this.$el,
				boundsContainer: this.getBoundsContainer(),
				listSettings: this.listSettings,
				viewType: this.collection.type,
				onColumnReorder: _.bind(this.setColumns, this),
				onColumnSort: this.sorting ? _.bind(this.onColumnClick, this) : _.noop,
				deBounceResize: this.options.deBounceResize
			};

			this.stickyHeader = new StickyHeader(stickyOptions);

			if (!this.options.nonBlockingLoading) {
				this.addView({ 'table.stickyHeader': this.stickyHeader });
			}
		},

		onAttachedToDOM: function() {
			this.updateStickyHeader();
		},

		updateStickyHeader: function() {
			if (this.stickyHeader) {
				this.stickyHeader.boundTo(this.getBoundsContainer());
			}
		},

		getBoundsContainer: function() {
			return this.options.boundsContainer || this.$el.closest('.pageContent');
		},

		/**
		 * Renders list view
		 * @void
		 */
		selfRender: function() {
			this.$el.html(this.template(this));

			if (this.options.dropMenu) {
				this.selectSettings = new DropMenu({
					target: this.$('.dropmenu'),
					ui: 'arrowDropmenu',
					alignRight: true,
					activeOnClick: false,
					data: this.options.dropMenu
				});
			}

			this.$('[data-tooltip]').each(function() {
				const text = this.getAttribute('data-tooltip');

				if (text) {
					$(this).tooltip({
						tip: text,
						preDelay: 200,
						postDelay: 200,
						zIndex: 20000,
						fadeOutSpeed: 100,
						position: 'top'
					});
				}
			});
		},

		/**
		 * Overrides Pipedrive.View.prototype.focusElementAfterRender
		 * Prevents focusing last active input element in list
		 * that can cause unwanted scrolling in Chrome browsers
		 *
		 * @void
		 */
		focusElementAfterRender: function() {
			return;
		},

		afterLastRowInDOM: function() {
			this.bindScrollListener();
		},

		/**
		 * Get tooltip for field
		 * @param  {String} key Field key to load the tooltip for
		 * @return {String}     Returns the tooltip for the field
		 */
		getTooltip: function(key) {
			let field;

			if (key.indexOf('.') > -1) {
				field = User.fields.get(key);
			} else {
				field = User.fields.getByKey(this.collection.type, key);
			}

			return (field && field.parent && field.parent.name) || '';
		},

		setSorting: function(sort) {
			this.options.sorting = sort;
		},

		onColumnClick: function(ev) {
			const fieldData = $(ev.currentTarget).data();
			const field = fieldData.field;
			const sortable = fieldData.sortable;

			if (this.isSortingDisabledForField(field, sortable)) {
				return;
			}

			// Add the sorting indicator.
			this.$(`th[data-field="${field}"]`).addClass('sorting');

			if (ev.shiftKey) {
				if (this.sorting.contains(field)) {
					this.sorting.toggleDirection(field);
				} else {
					if (this.options.serverSorting) {
						this.sorting.append(field);
					} else {
						this.sorting.sort(field);
					}
				}
			} else {
				if (this.sorting.isPrimary(field)) {
					this.sorting.toggleDirection(field);
				} else {
					this.sorting.sort(field);
				}
			}
		},

		onSortingChanged: function() {
			// save sorting to custom view also?
			if (this.options.serverSorting) {
				if (this.$scroller) {
					// we need to scroll to top as previous data is removed anyway
					this.$scroller.scrollTop();
				}

				// use server order - this is just field that returns undefined always
				this.collection.comparator = '_serverOrder';
				this.loadNextPage(true);
			} else {
				// local sort, use comparator
				this.sorting.setLocalSortComparator(this.collection);
			}

			this.setSortOrderToView();
			local.resizeStickyHeader.call(this);
		},

		setSortOrderToView: function() {
			const customView = this.listSettings.getCustomView();

			if (customView) {
				// we use silent, because we don't want to reload other views.
				customView.setColumnsSortOrder(this.sorting.getSortOrder(), { silent: true });
				customView.save(null, { silent: true });
			}
		},

		// helpers for pulling paged data
		loadNextPage: function(reset) {
			this.collection.pullPage({
				reset: !!reset,
				data: this.getDataForLoadingNextPage(),
				success: _.bind(this.onPagedDataLoaded, this),
				view: this
			});
		},

		getDataForLoadingNextPage: function() {
			return this.options.sorting ? this.sorting.getRequestData() : {};
		},

		onPagedDataLoaded: function() {
			// Once collection synced, remove the indications of sorting happening (if any).
			this.render();
			this.$('.sorting').removeClass('sorting');

			this.setTimeout(_.bind(this.checkScrollForMore, this), 100);
		},

		/**
		 * Highlights table row by model
		 * @param  {module:Pipedrive.Model} rowModel Row model to highlight
		 * @param  {integer} timeout Highlight length in ms (default: null, no
		 *                           timeout)
		 * @param clear {boolean} should clear
		 * @void
		 */
		highlight: function(rowModel, timeout, clear) {
			const view = this.collectionView.findViewByModel(rowModel);

			if (clear) {
				return view.$el.removeClass('highlight');
			}

			view.$el.addClass('highlight');
			view.highlightTimer = this.setTimeout(() => {
				view.$el.removeClass('highlight');
			}, timeout);
		},

		/**
		 * Helper for template. Returns the classes for the specific column
		 * header.
		 *
		 * @param  {Object} column Field column
		 * @param  {String} key Field key for the column
		 * @return {String}       Returns CSS classes to apply to the header
		 */
		getColumnHeaderClass: function(column, key) {
			if (this.sorting) {
				return this.getClassNamesForSorting(column, key).join(' ');
			}

			return '';
		},

		getClassNamesForSorting: function(column, key) {
			const css = [];

			if (this.isSortingDisabledForField(key, column.sortable_flag)) {
				css.push('sortingDisabled');
			} else {
				if (this.sorting.contains(key)) {
					css.push('sorted');
				}

				if (this.isDescendingOrder(key)) {
					css.push('descending');
				}

				if (this.sorting.isPrimary(key)) {
					css.push('primary');
				}
			}

			return css;
		},

		isSortingDisabledForField: function(fieldKey, sortable) {
			if (!sortable) {
				return true;
			}

			const sortingDisabledColumns = this.options.sortingDisabledColumns;

			const sortableField =
				sortingDisabledColumns && _.includes(sortingDisabledColumns, fieldKey);

			return sortableField || !this.options.sorting;
		},

		isDescendingOrder: function(field) {
			const isReversed = this.sorting.isReversed(field);

			const defaultSortOrder = this.predefinedSortOrder[field];

			if (isReversed && defaultSortOrder === 'asc') {
				return true;
			} else if (!isReversed && defaultSortOrder === 'desc') {
				return true;
			}

			return false;
		},

		onUnload: function() {
			if (this.$scroller) {
				this.$scroller.off('scroll.table');
			}

			this.$el.off('.table');

			if (this.options.sorting) {
				this.sorting.off('change');
			}

			if (this.options.selectableRows) {
				this.clickAndDrag.destroy();
			}

			this.collection.off(null, null, this);
		},

		/**
		 * Set all visible columns default sort order
		 * @return {Object}
		 */
		getDefaultSortOrders: function() {
			const defaultSorting = {};

			_.forEach(
				this.options.columns,
				_.bind(function(field, key) {
					let userField = null;

					if (!field.isCrossItemField) {
						userField = User.fields.getByKey(this.collection.type, key);
					}

					if (userField) {
						defaultSorting[userField.key] = userField.default_sort_direction || 'asc';
					} else {
						defaultSorting[key] = 'asc';
					}
				}, this)
			);

			return defaultSorting;
		},

		/**
		 * If table has selectable rows, selects all items and triggers 'selected' events on each model in collection.
		 * @param  {Object} ev            Click event object
		 * @param {Boolean} selectAll    (optional) Whether to select (true) or deselect (false) all
		 * @void
		 */
		selectAll: function(ev, selectAll) {
			if (!_.isBoolean(selectAll)) {
				selectAll = ev.currentTarget.checked;
			}

			this.$('.selectableRow .selectAll').prop('checked', selectAll);
			this.$('.selectRowInput input').prop('checked', selectAll);

			if (selectAll) {
				this.$('tr.viewItem').addClass('selected');
			} else {
				this.$('tr.viewItem').removeClass('selected');
			}

			// Reset shift-click last clicked "memory"
			this.$('td.lastClicked').removeClass('lastClicked');

			this.collection.each((model) => {
				model.rowSelected = selectAll;
			});
			this.$('.selectableRow .selectAll').prop('indeterminate', false);
			this.collection.trigger('selected', selectAll);
		},

		remove: function() {
			app.global.unbind('*.model.*.update', local.resizeStickyHeader, this);
			app.global.unbind('ui.event.router.change', this.remove, this);
			app.global.unbind('ui.modal.dialog.close', this.remove, this);
		}
	},
	/** @lends views/shared/Table */ {
		/**
		 * Default options when creating new table, override these. <br> Use this as example what you can pass into constructor
		 *
		 * @const {Object}
		 * @enum {string}
		 */
		defaultOptions: {
			collection: null,
			listSettings: null,
			columns: null,
			sorting: true,
			sortOrder: '',
			serverSorting: false,
			paging: true,
			dropMenu: null,
			showActions: false,
			removeButtonTooltip: false,
			showEditColumns: false,
			hideHeader: false,
			style: '',
			onModelRemove: null,
			onEditColumns: null,
			stickyHeader: false,
			nonBlockingLoading: false,
			/**
			 * Whether to use a custom template for field or not.
			 */
			customTemplate: null,
			/**
			 * Whether to use a custom remove row handler or not.
			 */
			handleRemoveClick: null
		}
	}
);

local = {
	/**
	 * Shows loading more rows message
	 *
	 * Uses placeholder view to show different template. Creates a new view
	 * if it doesn’t exist already.
	 *
	 * @void
	 */
	loadMoreShown: false,
	showLoadMore: function() {
		if (local.loadMoreShown) {
			return;
		}

		let view = this.getView('tfoot');

		if (!view) {
			view = new TableRowPlaceholderView({
				columns: _.keys(this.options.columns),
				customColumnsCount: this.options.customColumnsCount,
				selectableRows: this.options.selectableRows,
				showEditColumns: this.options.showEditColumns,
				showActions: this.options.showActions,
				template: _.template(tableRowMoreTemplate),
				tagName: 'tfoot'
			});

			this.addView('tfoot', view);

			this.render();
		}

		local.loadMoreShown = true;
		view.render();
	},

	/**
	 * Hides loading more rows message
	 *
	 * Calling this destroys the view.
	 *
	 * @void
	 */
	hideLoadMore: function() {
		if (!local.loadMoreShown) {
			return;
		}

		const view = this.getView('tfoot');

		if (view) {
			this.removeView('tfoot');
			this.render();
		}

		local.loadMoreShown = false;
		local.resizeStickyHeader.call(this);
	},

	/**
	 * Calls click event on checkbox if table cell clicked instead of checkbox
	 * @param ev {Object} event
	 * @void
	 */
	delegateClickToCheckbox: function(ev) {
		if (ev.target.tagName === 'TD' || ev.target.tagName === 'TH') {
			// Create a fake click event to pass shiftKey value
			const mouseEvent = fakeMouseEvent('click', {
				view: window,
				bubbles: true,
				cancelable: true,
				shiftKey: ev.shiftKey
			});

			$(ev.currentTarget)
				.find('input')[0]
				.dispatchEvent(mouseEvent);
		}
	},

	/**
	 * Handles row selection or deselection (for bulk-editing).
	 * @param  {Event}    ev - contains row's model and the click-event object
	 * @void
	 */
	onSelectRowInputClicked: function(ev) {
		const $currentCheckbox = $(ev.currentTarget);
		const $lastClickedInputCont = this.$el.find('.selectRowInput.lastClicked');
		const $currentInputCont = $currentCheckbox.closest('td');

		$lastClickedInputCont.removeClass('lastClicked');
		$currentInputCont.addClass('lastClicked');

		if (
			!$currentInputCont.is($lastClickedInputCont) &&
			ev.shiftKey &&
			$lastClickedInputCont.length > 0
		) {
			local.handleRowsShiftClick.call(this, $lastClickedInputCont, $currentInputCont);

			return;
		}

		const modelCid = $currentCheckbox.closest('tr').data('cid');

		// Row's model

		const model = this.collection.get(modelCid);

		local.selectRow.call(this, model, $currentCheckbox);
	},

	/**
	 * Handles multiple rows selecting when shift key held down.
	 * @param  {object}    $lastClickedInputCont - table cell containing the checkbox that was clicked last,
	 *                     before current click
	 * @param  {object}    $currentInputCont - table cell containing the checkbox that was currently clicked
	 * @void
	 */
	handleRowsShiftClick: function($lastClickedInputCont, $currentInputCont) {
		const toSelect = $currentInputCont.find('input').is(':checked');
		const $lastClickedRow = $lastClickedInputCont.closest('tr');
		const $currentRow = $currentInputCont.closest('tr');

		let $rowsInRange;

		let $rowsToHandle;

		// Selects all rows in the range
		if ($currentRow.nextAll().has($lastClickedInputCont).length > 0) {
			$rowsInRange = $lastClickedRow
				.prevUntil($currentRow)
				.addBack()
				.add($currentRow);
		} else {
			$rowsInRange = $lastClickedRow
				.nextUntil($currentRow)
				.addBack()
				.add($currentRow);
		}

		// Filters out rows with checkboxes already in desired state.
		// Whether shift-clicking should select or deselect rows,
		// depends on the 'checked' attribute of the checkbox clicked currently.
		if (toSelect) {
			$rowsToHandle = $rowsInRange.filter('tr:not(.selected)');
		} else {
			$rowsToHandle = $rowsInRange.filter('tr.selected');
		}

		const self = this;

		$rowsToHandle.each((i, row) => {
			const modelCid = $(row).data('cid');

			const model = self.collection.get(modelCid);

			const $checkboxOfRow = $(row).find('.selectRowInput input');

			$checkboxOfRow.attr('checked', toSelect);
			local.selectRow.call(self, model, $checkboxOfRow);
		});
	},

	selectRow: function(model, $checkbox) {
		const isChecked = $checkbox.is(':checked');

		if (model.rowSelected === isChecked) {
			return;
		}

		model.rowSelected = isChecked;
		model.trigger('selected', isChecked);
	},

	/**
	 * Changes 'selectAll' status according to selected items.
	 * @void
	 */
	onSelected: function() {
		const selectedModelsIds = _.map(
			_.filter(this.collection.models, { rowSelected: true }),
			'id'
		);

		this.collection.selectedIds = _.union(selectedModelsIds, this.hiddenSelectedIds);
		const allSelected = this.collection.selectedIds.length === this.collection.length;

		const hasSelectedItems =
			this.collection.selectedIds.length > 0 || this.hiddenSelectedIds.length > 0;

		this.$('.selectableRow .selectAll')
			.prop('indeterminate', hasSelectedItems && !allSelected)
			.attr('checked', hasSelectedItems);
	},

	/**
	 * Remembers selected rows for the case when for example after sorting some selected rows
	 * are left out of the currently loaded rows number.
	 *
	 * @void
	 */
	setSelectedRows: function() {
		const ids = this.collection.selectedIds;

		const filterIds = function(object) {
			return _.includes(ids, object.id);
		};

		const models = this.collection.filter(filterIds);

		this.hiddenSelectedIds = _.filter(this.collection.selectedIds, (id) => {
			return !_.includes(_.map(models, 'id'), id);
		});

		this.collection.trigger('selected', models);

		_.forEach(
			models,
			_.bind((model) => {
				model.rowSelected = true;
				model.trigger('selected', true);
			}, this)
		);
	},

	/**
	 * Handle collection pull
	 * @void
	 */
	handleCollectionPull: function() {
		if (this.stickyHeader && this.options.nonBlockingLoading) {
			local.hideStickyHeader.call(this);
		}
	},

	/**
	 * Callback after last row of the table has been rendered
	 * @void
	 */
	afterLastRowRendered: function() {
		if (this.options.nonBlockingLoading) {
			if (this.stickyHeader) {
				this.setTimeout(local.showStickyHeader.bind(this), 100);
			}

			if (this.options.selectableRows) {
				// To make sure all selected rows stay selected after sorting or column drag-and-drop.
				local.setSelectedRows.call(this);
			}
		}
	},

	/**
	 * Shows sticky header
	 * @void
	 */
	showStickyHeader: function() {
		this.allowStickyHeaderResize = true;

		this.addView({ 'table.stickyHeader': this.stickyHeader });
		this.render();
		this.stickyHeader.resizeHeader();

		this.stickyHeader.reveal();
	},

	/**
	 * Hides sticky header
	 * @void
	 */
	hideStickyHeader: function() {
		this.allowStickyHeaderResize = false;
		this.stickyHeader.hide();
	},

	resizeStickyHeader: function() {
		if (this.stickyHeader && this.allowStickyHeaderResize) {
			this.stickyHeader.resizeHeaderAsync();
		}
	}
};

module.exports = TableView;
