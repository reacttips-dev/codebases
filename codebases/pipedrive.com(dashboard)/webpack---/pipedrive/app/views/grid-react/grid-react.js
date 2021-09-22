const Pipedrive = require('pipedrive');
const $ = require('jquery');
const _ = require('lodash');
const raf = require('utils/request-animation-frame');
const backgroundGenerator = require('./utils/background-generator');
const GridHeaderView = require('views/shared/grid-header');
const BulkEditSettings = require('models/bulk-edit-settings');
const GridReactStore = require('views/grid-react/store/index');
const scrollableContentGrid = require('views/grid-react/containers/scrollable-content-grid');
const fixedContentGrid = require('views/grid-react/containers/fixed-content-grid');
const CollectionItemsMap = require('views/grid-react/utils/collection-items-map');
const template = require('templates/grid-react/grid-react.html');
const gridConstants = require('views/grid-react/grid-constants');
const VIEWPORT = '.grid__content';
const GRID_FIXED_CONTENT = '.gridContent--fixed';
const GRID_DATA_CONTENT = '.gridContent--contentArea';
const GRID_CHECKBOXES_CONTENT = '.gridContent--selectionArea';
const GRID_GHOST_SCROLLBAR = '.grid__ghostScrollbar';
const GRID_GHOST_SCROLLBAR_CONENT = '.ghostScrollbar__content';

const GridReactView = Pipedrive.View.extend({
	template: _.template(template),

	initialize: function(options) {
		this.options = options || {};
		this.collection = this.options.collection;
		this.listSettings = this.options.listSettings;
		this.summaryModel = this.listSettings.getSummary();
		this.collectionItems = new CollectionItemsMap();
		this.bulkEditSettings = new BulkEditSettings({
			collection: this.collection,
			listSettings: this.listSettings
		});

		this.initChildViews();

		this.rendered = false;

		this.animations = {
			topThreshold: 0,
			bottomThreshold: 0,
			scrollTicking: false,
			gridScrollTop: 0,
			scrollDirection: 'down',
			hasPendingScrollRequest: false
		};

		this.syncSummary = _.debounce(
			_.bind(this.listSettings.syncSummary, this.listSettings),
			1000,
			{ leading: true }
		);

		this.windowHeight = $(window).height();

		this.renderBuffer = gridConstants.renderBuffer(this.windowHeight);
		this.onWindow('resize.grid-react', _.bind(this.windowSizeChanged, this));

		this.initStore();
		this.bindEvents();
		this.resetAttributes();
	},

	getCustomView: function() {
		return this.listSettings.getCustomView();
	},

	windowSizeChanged: function() {
		this.windowHeight = $(window).height();
		this.recalculateViewportOffset();
		this.deferredWidthAdjust();

		if (this.gridReactStore) {
			this.gridReactStore.changeGridHeight();
		}
	},

	calculateViewportGap: function(width) {
		return width > $(window).width() ? 48 : 0;
	},

	/**
	 * This RAF-driven request for adjusting width is used while collection is fetched
	 * This is not related to collection data right away, so we're requesting change in RAF
	 */
	deferredWidthAdjust: function() {
		raf.request(_.bind(this.adjustViewportWidth, this));
	},

	adjustViewportWidth: function() {
		const contentTableWidth = this.$el
			.find(`${GridHeaderView.GRID_SCROLL_HEADER} table`)
			.outerWidth(true);

		// if view is hidden, width will be 0 and we don't want to do anything
		if (!contentTableWidth) {
			return null;
		}

		const fixedTableWidth = this.$el.find(`${GridHeaderView.GRID_FIXED_HEADER} table`).width();

		if (!this.fixedTableWidth || fixedTableWidth) {
			this.fixedTableWidth = fixedTableWidth;
		}

		const $scrollableElement = this.$el.find(GRID_DATA_CONTENT);
		const scrollableElementWidth = $scrollableElement.width();
		const viewPortWidth = this.fixedTableWidth + contentTableWidth;
		const viewportGap = this.calculateViewportGap(viewPortWidth);
		const headerMaxWidth = this.fixedTableWidth + scrollableElementWidth;
		const scrollableElementLeftOffset = this.fixedTableWidth - 1;
		const $ghostScrollbar = this.$el.find(GRID_GHOST_SCROLLBAR);
		const $ghostScrollbarContent = this.$el.find(GRID_GHOST_SCROLLBAR_CONENT);

		this.contentTableWidth = viewPortWidth;
		this.scrollableElementWidth = $scrollableElement.outerWidth() + scrollableElementLeftOffset;

		this.viewPort.css({
			'max-width': viewPortWidth + viewportGap,
			// Hack for iPads, otherwise vertical scroll won't work
			'-webkit-overflow-scrolling': 'touch'
		});

		this.$el.find(GridHeaderView.GRID_HEADER_WRAPPER).css({
			'border-right-width': this.viewPort.width() > headerMaxWidth ? '1px' : '0px'
		});

		$scrollableElement.css({
			left: scrollableElementLeftOffset
		});
		$ghostScrollbar.css({
			width: this.scrollableElementWidth
		});
		$ghostScrollbarContent.css('width', viewPortWidth);
	},

	resetAttributes: function() {
		this.pagesPullRequests = [];
		this.collectionItems.reset(this.collection.models, 0);
	},

	initChildViews: function() {
		this.headerView = new GridHeaderView({
			viewport: VIEWPORT,
			scrollTable: `${GRID_DATA_CONTENT} table`,
			listSettings: this.listSettings,
			bulkEditSettings: this.bulkEditSettings,
			onEditColumns: this.options.onEditColumns,
			selectableRows: this.options.selectableRows,
			onColumnsSorted: _.bind(this.onColumnsSorted, this),
			onColumnsChanged: _.bind(this.onColumnsChanged, this)
		});

		this.addView({
			'.grid__header': this.headerView
		});
	},

	initStore: function() {
		this.gridReactStore = new GridReactStore(
			{
				supportsTranslate: 'transform',
				rowHeight: gridConstants.ROW_HEIGHT,
				onCheckboxSelected: _.bind(
					this.bulkEditSettings.onCheckboxSelected,
					this.bulkEditSettings
				),
				customView: this.getCustomView(),
				collection: this.collection,
				collectionItems: this.collectionItems,
				summary: this.summaryModel,
				buffer: this.renderBuffer,
				mainContentWidth: 0,
				fixedContentWidth: 0
			},
			{
				calculateDisplayRange: _.bind(this.getDisplayRange, this)
			}
		);
	},

	onColumnsChanged: function() {
		this.updateScrollableView();
	},

	bindEvents: function() {
		this.collection.on('reset', this.handleCollectionReset, this);
		// a hack to quick fix GRN-1558; should be removed after lists/main.js is improved
		this.collection.on('reset', this.updateScrollableView, this);
		this.collection.on('add', this.collectionItemAdded, this);
		this.collection.on('remove', this.collectionItemRemoved, this);
		this.collection.on('update', this.deferredWidthAdjust, this);
		this.listSettings.on('changed:custom-view', this.updateScrollableView, this);

		this.summaryModel.on('alphabet:changed', this.recalculateViewportOffset, this);
	},

	onUnload: function() {
		this.collection.off('reset', this.handleCollectionReset, this);
		this.collection.off('reset', this.updateScrollableView, this);
		this.collection.off('add', this.collectionItemAdded, this);
		this.collection.off('remove', this.collectionItemRemoved, this);
		this.collection.off('update', this.deferredWidthAdjust, this);

		this.listSettings.off('changed:custom-view', this.updateScrollableView, this);
		this.summaryModel.off('alphabet:changed', this.recalculateViewportOffset, this);

		_.result(this.gridReactStore, 'unload');
	},

	onDestroy: function() {
		if (!this.rendered) {
			return;
		}

		scrollableContentGrid.unmount(this.$el.find(GRID_DATA_CONTENT));

		if (this.options.selectableRows) {
			fixedContentGrid.unmount(this.$el.find(GRID_CHECKBOXES_CONTENT));
		}
	},

	recalculateViewportOffset: function() {
		this.viewPortOffsetTop = this.viewPort ? this.viewPort.offset().top : 0;
	},

	getViewPortOffsetTop: function() {
		if (_.isNil(this.viewPortOffsetTop)) {
			this.recalculateViewportOffset();
		}

		return this.viewPortOffsetTop;
	},

	collectionItemAdded: function(model, collection, options) {
		/**
		 * handle only items added from socket event or from dialog. i.e.
		 * ignoring adding which happens every time collection is just updated by pulling next page
		 */

		if (!options.add || options.update) {
			return;
		}

		const lastVisibleIndex = this.calculateLastVisibleIndex();

		if (Object.keys(this.collectionItems.itemsIds).length === 0) {
			this.headerView.showMarketingCoachMark();
		}

		this.collectionItems.insertItemAt(lastVisibleIndex, model);
		this.syncSummary();
	},

	collectionItemRemoved: function(model) {
		this.collectionItems.removeById(model.get('id'));
		this.syncSummary();
	},

	selfRender: function() {
		if (this.rendered) {
			return;
		}

		this.$el.html(this.template());
		this.viewPort = this.$el.find(VIEWPORT);
		this.headerView.render();
	},

	onAttachedToDOM: function() {
		if (this.rendered) {
			this.deferredWidthAdjust();
			this.recalculateViewportOffset();

			return;
		}

		this.rendered = true;

		const contentTableWidth = this.$el
			.find(`${GridHeaderView.GRID_SCROLL_HEADER} table`)
			.outerWidth(true);
		const fixedTableWidth = this.$el.find(`${GridHeaderView.GRID_FIXED_HEADER} table`).width();
		const $fixedElement = this.$el.find(GRID_CHECKBOXES_CONTENT);

		this.$gridContentContainer = this.$el.find(GRID_DATA_CONTENT);
		this.$scrollHeader = this.$el.find(GridHeaderView.GRID_SCROLL_HEADER);
		this.$ghostScrollbar = this.$el.find(GRID_GHOST_SCROLLBAR);
		this.$fixedContent = this.$el.find(GRID_FIXED_CONTENT);

		this.gridReactStore.changeGridWidth(contentTableWidth, fixedTableWidth);

		scrollableContentGrid.draw({
			gridContentContainer: this.$gridContentContainer[0],
			scrollContainer: this.$(VIEWPORT)[0],
			store: this.gridReactStore.getStore()
		});

		if (this.options.selectableRows) {
			fixedContentGrid.draw($fixedElement, this.gridReactStore.getStore());
		}

		this.updateGridBackground(GRID_DATA_CONTENT, GridHeaderView.GRID_SCROLL_HEADER, false);
		this.updateGridBackground(GRID_CHECKBOXES_CONTENT, GridHeaderView.GRID_FIXED_HEADER, false);

		this.viewPort.on('scroll', _.bind(this.storeScrollParameters, this));
		this.addPassiveEventListener(
			this.$gridContentContainer.get(0),
			'scroll',
			this.contentScrollHandler
		);
		this.addPassiveEventListener(
			this.$ghostScrollbar.get(0),
			'scroll',
			this.ghostScrollHandler
		);
	},

	contentScrollHandler: function() {
		if (this.isSyncingContentScroll) {
			this.isSyncingContentScroll = false;

			return;
		}

		const oldScrollLeft = this.contentLeftScroll || 0;

		this.isSyncingGhostScroll = true;
		this.contentLeftScroll = this.$gridContentContainer[0].scrollLeft;

		this.$scrollHeader[0].scrollLeft = this.contentLeftScroll;
		this.$ghostScrollbar[0].scrollLeft = this.contentLeftScroll;

		this.setTopContent(oldScrollLeft);
	},

	ghostScrollHandler: function() {
		if (this.isSyncingGhostScroll) {
			this.isSyncingGhostScroll = false;

			return;
		}

		this.isSyncingContentScroll = true;

		const scrollLeft = this.$ghostScrollbar[0].scrollLeft;

		this.$scrollHeader[0].scrollLeft = scrollLeft;
		this.$gridContentContainer[0].scrollLeft = scrollLeft;
	},

	setTopContent: function(oldScrollLeft) {
		if (this.contentLeftScroll === 0 && this.contentLeftScroll !== oldScrollLeft) {
			this.$fixedContent.removeClass('gridContent--onTop');
		}

		if (oldScrollLeft === 0 && this.contentLeftScroll !== oldScrollLeft) {
			this.$fixedContent.addClass('gridContent--onTop');
		}
	},

	addPassiveEventListener: function(element, method, callback) {
		try {
			element.addEventListener(method, callback.bind(this), {
				passive: true
			});
		} catch (error) {
			element.addEventListener(method, callback.bind(this));
		}
	},

	storeScrollParameters: function(e) {
		const newScrollTop = e.currentTarget.scrollTop;

		this.animations.scrollDirection =
			newScrollTop > this.animations.gridScrollTop ? 'down' : 'up';
		this.animations.gridScrollTop = newScrollTop;
		this.animations.hasPendingScrollRequest = true;

		this.checkForPull({
			range: this.getDisplayRange(this.animations.gridScrollTop)
		});

		if (
			this.animations.topThreshold > newScrollTop ||
			this.animations.bottomThreshold < newScrollTop
		) {
			const offset = (this.renderBuffer * gridConstants.ROW_HEIGHT) / 2;

			this.animations.topThreshold = newScrollTop - offset;
			this.animations.bottomThreshold = newScrollTop + offset;

			this.handleVerticalScroll();
		}
	},

	handleVerticalScroll: function() {
		const self = this;

		if (!self.animations.scrollTicking) {
			raf.request(() => {
				self.renderModelsToGrid(self.animations.gridScrollTop, () => {
					self.animations.scrollTicking = false;

					if (self.animations.hasPendingScrollRequest) {
						self.animations.hasPendingScrollRequest = false;
						self.handleVerticalScroll();
					}
				});
			});
		}

		self.animations.scrollTicking = true;
	},

	renderModelsToGrid: function(scrollTop, renderComplete) {
		this.gridReactStore.updateItems(scrollTop, renderComplete);
	},

	checkForPull: function(options) {
		options = options || {};
		const range = options.range || this.getDisplayRange();
		const direction = this.animations.scrollDirection;
		const start = this.notCoveredRangeStartIndex(range, direction, options.reset);

		if (start < 0 && !options.reset) {
			return;
		}

		if (options.reset) {
			if (this.collection.pulling()) {
				this.collection.lastFetchRequest.abort();
			}

			this.pagesPullRequests = [];
		}

		this.pagesPullRequests.unshift({
			start,
			limit: 100,
			direction,
			range: _.clone(range)
		});
		this.pagesPullRequests = this.pagesPullRequests.slice(0, 3);

		this.pullPostponed(options);
	},

	notCoveredRangeStartIndex: function(range, direction, reset) {
		if (reset) {
			return Math.max(range.top, 0);
		}

		const totalCount = this.summaryModel.get('total_count');
		const startIndex = this.collectionItems.diffStartIndex(range, direction, totalCount);

		return startIndex < totalCount ? startIndex : -1;
	},

	onCollectionPullSuccess: function(start, opts, collection, response) {
		if (opts.reset) {
			this.collectionItems.reset(response.data, start);
		} else {
			this.collectionItems.updateItems(response.data, start, opts.direction);
			this.pullNext();
		}

		if (_.isFunction(opts.onSuccess)) {
			opts.onSuccess();
		}
	},

	pullNext: function() {
		setTimeout(_.bind(this.pullPostponed, this), 0);
	},

	pullPostponed: function(opts) {
		opts = opts || {};

		if (!this.pagesPullRequests.length || this.collection.pulling()) {
			return;
		}

		const options = this.pagesPullRequests.shift();
		const reset = !!opts.reset;
		const keepScrollPositions = opts.keepScrollPositions;
		const start = reset ? options.start : this.calculatePullStart(options);

		opts.direction = options.direction;

		if (this.notCoveredRangeStartIndex(options.range, options.direction, reset) < 0) {
			return this.pullNext();
		}

		this.collection.pull({
			data: _.assignIn(
				{
					start,
					limit: options.limit
				},
				options.data,
				opts.data
			),
			update: true,
			remove: false,
			reset,
			keepScrollPositions,
			success: _.bind(this.onCollectionPullSuccess, this, start, opts)
		});
	},

	calculatePullStart: function(options) {
		const upStart = Math.max(options.start - options.limit, 0);

		return options.direction === 'down' ? options.start : upStart;
	},

	getViewportInfo: function(scrollTop) {
		return {
			scrollTop: _.isNil(scrollTop) ? this.viewPort.scrollTop() : scrollTop,
			height: this.windowHeight - this.getViewPortOffsetTop()
		};
	},

	getVisibleRange: function(viewportInfo) {
		const top = this.getRowFromPosition(viewportInfo.scrollTop);
		const bottom = top + Math.ceil(viewportInfo.height / gridConstants.ROW_HEIGHT);

		return {
			top,
			bottom
		};
	},

	getDisplayRange: function(scrollTop) {
		const viewport = this.getViewportInfo(scrollTop);
		const range = this.getVisibleRange(viewport);

		range.top = Math.max(0, range.top) - this.renderBuffer;
		range.bottom = range.bottom + this.renderBuffer;

		return range;
	},

	calculateLastVisibleIndex: function() {
		const range = this.getDisplayRange(this.animations.gridScrollTop);
		const lastItemIndex = range.bottom - this.renderBuffer - 2;

		return Math.max(0, lastItemIndex);
	},

	getRowFromPosition: function(position) {
		return Math.floor(position / gridConstants.ROW_HEIGHT);
	},

	onColumnsSorted: function(options) {
		options = _.assignIn(options, {
			reset: true,
			keepScrollPositions: true,
			onSuccess: _.isFunction(options.onSorted) ? options.onSorted : _.noop
		});

		this.checkForPull(options);
		this.collection.trigger('sorted');
	},

	updateScrollableView: function() {
		this.gridReactStore.updateView({
			customView: this.getCustomView(),
			mainContentWidth: this.$el
				.find(`${GridHeaderView.GRID_SCROLL_HEADER} table`)
				.outerWidth(true)
		});
		this.deferredWidthAdjust();
		this.updateGridBackground(GRID_DATA_CONTENT, GridHeaderView.GRID_SCROLL_HEADER, false);
		this.updateGridBackground(GRID_CHECKBOXES_CONTENT, GridHeaderView.GRID_FIXED_HEADER, false);

		this.$scrollHeader = this.$el.find(GridHeaderView.GRID_SCROLL_HEADER);

		if (this.rendered) {
			this.contentScrollHandler();
		}
	},

	updateGridBackground: function(grid, header, includeSkeleton) {
		const table = this.$el.find(`${grid} table`);
		const backgroundCss = backgroundGenerator.generateBackground(
			this.$el.find(`${header} th`),
			includeSkeleton
		);

		table.css(backgroundCss);
	},

	resetScrollPositions: function() {
		this.$el.find(VIEWPORT).scrollTop(0);
		this.$el.find(GRID_DATA_CONTENT).scrollLeft(0);
	},

	handleCollectionReset: function(collection, options) {
		options = options || {};

		if (!options.keepScrollPositions) {
			this.resetScrollPositions();
			this.gridReactStore.updateItems(0);
		}

		this.deferredWidthAdjust();
		this.resetAttributes();
	}
});

module.exports = GridReactView;
