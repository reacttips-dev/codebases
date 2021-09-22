const Pipedrive = require('pipedrive');
const _ = require('lodash');
const Hammer = require('hammerjs');
const User = require('models/user');
const TableSorting = require('utils/table-sorting');
const { marketingStatusCoachMark } = require('views/shared/marketing-status-utils');
const TableReordering = require('views/shared/table-sortable');
const template = require('templates/shared/grid-header.html');
const $ = require('jquery');
const ListViewAnalytics = require('utils/analytics/list-view-analytics');

const GridHeaderView = Pipedrive.View.extend(
	{
		template: _.template(template),

		initialize: function(options) {
			this.options = options || {};
			this.listSettings = this.options.listSettings;
			this.bulkEditSettings = this.options.bulkEditSettings;
			this.dragged = false;
			this.notSortableColumns = [];
			this.initializeSubviews();
			this.bindEvents();
		},

		initializeSubviews: function() {
			this.reorderingUtils = new TableReordering({
				handleDragging: _.bind(this.onReorderingEnd, this)
			});

			this.sortingUtils = new TableSorting({
				defaultSortOrder: this.getDefaultSortDirections()
			});

			this.sortingUtils.setSortOrder(this.getColumnsSortOrder());
		},

		selfRender: function() {
			const leftOffset = this.$el
				.find(`${GridHeaderView.GRID_SCROLL_HEADER} table`)
				.css('left');

			this.$el.html(
				this.template({
					columns: this.getColumns(),
					selectableRows: this.options.selectableRows,
					leftOffset
				})
			);

			this.setCheckboxState(this.bulkEditSettings.checkboxState);
			this.updateSortingClasses();

			const fixedHeaderWidth = this.$el.find(GridHeaderView.GRID_FIXED_HEADER).width();
			const scrollableHeaderWidth = this.$el
				.find(GridHeaderView.GRID_SCROLL_HEADER_TABLE)
				.width();

			this.reorderingUtils.render();
			this.reorderingUtils.setSortable({
				parent: this.$el.find(`${GridHeaderView.GRID_SCROLL_HEADER} table`),
				min: fixedHeaderWidth,
				max: fixedHeaderWidth + scrollableHeaderWidth
			});

			this.$el.find(GridHeaderView.RESIZE__HANDLE).each((index, el) => {
				const hammer = new Hammer.Manager(el, {
					recognizers: [
						[Hammer.Press, { time: 0 }],
						[Hammer.Pan, { threshold: 0 }]
					]
				});

				hammer.on('press', this.onResizePress.bind(this));
				hammer.on('pressup panend', this.onResizePressUp.bind(this));

				hammer.on('panstart', this.onResizeStart.bind(this));
				hammer.on('pan', this.onResizeMove.bind(this));
				hammer.on('panend', this.onResizeEnd.bind(this));
			});

			this.setResizeHandles();
			this.setTooltips();
			this.setNotSortableColumns();
		},

		onAttachedToDOM: function() {
			const fixedHeaderWidth = this.$el.find(GridHeaderView.GRID_FIXED_HEADER).width();
			const scrollableHeaderWidth = this.$el
				.find(GridHeaderView.GRID_SCROLL_HEADER_TABLE)
				.width();

			this.setTooltips();
			this.setResizeHandles();

			this.reorderingUtils.setSortable({
				parent: this.$el.find(`${GridHeaderView.GRID_SCROLL_HEADER} table`),
				min: fixedHeaderWidth,
				max: fixedHeaderWidth + scrollableHeaderWidth
			});
		},

		getColumns: function() {
			const customView = this.listSettings.getCustomView();
			const columns = customView ? customView.getColumnsFields() : {};

			/**
			 * (GRN-2213)
			 * Remove this method once proper solution is implemented for product price column
			 */
			if (_.isObject(columns.price) && columns.price.item_type === 'product') {
				columns.price.name += ` (${User.get('default_currency')})`;
			}

			return columns;
		},

		setNotSortableColumns: function() {
			_.forEach(
				this.getColumns(),
				_.bind(function(column) {
					if (
						column.sortable_flag === false &&
						this.notSortableColumns.indexOf(column.key) === -1
					) {
						this.notSortableColumns.push(column.key);
					}
				}, this)
			);
		},

		getColumnsSortOrder: function() {
			const customView = this.listSettings.getCustomView();

			return customView ? customView.getColumnsSortOrder() : '';
		},

		getCustomView: function() {
			return this.listSettings.getCustomView();
		},

		bindEvents: function() {
			if (this.options.onEditColumns) {
				this.$el.on('click', GridHeaderView.COLUMN_PICKER, this.options.onEditColumns);
			}

			if (this.options.selectableRows) {
				this.$el.on('click', GridHeaderView.SELECT_ALL_COLUMN, (ev) => {
					const $el = $(ev.target);

					// Click not on checkbox
					if (
						!$el.is(GridHeaderView.SELECT_ALL_CHECKBOX) &&
						!$el.closest(GridHeaderView.SELECT_ALL_CHECKBOX).length
					) {
						const $checkbox = this.$el.find(GridHeaderView.SELECT_ALL_CHECKBOX_INPUT);

						const newChecked = !$checkbox.prop('checked');

						$checkbox.prop('checked', newChecked).trigger('change');
					}
				});

				this.$el.on('change', GridHeaderView.SELECT_ALL_CHECKBOX_INPUT, () => {
					const $checkbox = this.$el.find(GridHeaderView.SELECT_ALL_CHECKBOX_INPUT);
					const newChecked = $checkbox.prop('checked');

					this.bulkEditSettings.selectAll(newChecked);
				});

				this.bulkEditSettings.on('changed:selectAllCheckbox', this.setCheckboxState, this);
			}

			this.bindReorderingEvents();
			this.bindSortingEvents();

			this.listSettings.on('changed:custom-view', this.customViewChanged, this);
		},

		bindReorderingEvents: function() {
			this.$el.on(
				'mousedown',
				GridHeaderView.REORDER_HANDLE,
				_.bind(this.onReorderingStart, this)
			);
			this.$el.on(
				'mouseup',
				GridHeaderView.REORDER_HANDLE,
				_.bind(this.reorderingUtils.setPressed, this.reorderingUtils, false)
			);
		},

		bindSortingEvents: function() {
			this.$el.on(
				'click',
				GridHeaderView.RESIZE__CONTENT,
				_.bind(this.onColumnClicked, this)
			);
			this.sortingUtils.on(
				'change',
				_.bind(function() {
					this.options.onColumnsSorted({
						data: this.sortingUtils.getRequestData(),
						onSorted: _.bind(this.updateSortingSpinner, this)
					});
					this.getCustomView().setColumnsSortOrder(this.sortingUtils.getSortOrder(), {
						silent: true
					});
					this.getCustomView().save(null, { silent: true });
				}, this)
			);
		},

		customViewChanged: function() {
			this.sortingUtils.setSortOrder(this.getColumnsSortOrder());
			this.render();
		},

		setResizeHandles: function() {
			let leftOffset = 0;

			const isFF = navigator.userAgent.indexOf('Firefox') !== -1;

			this.$el.find(GridHeaderView.INTERACTIVE_COLUMN).each(function() {
				const element = $(this);

				leftOffset += element.outerWidth();
				element
					.find(GridHeaderView.RESIZE__HANDLE)
					.css('left', leftOffset - (isFF ? 3 : 2));
			});
		},

		hideResizeGhostLine: function() {
			this.$el.find(GridHeaderView.GHOST_COLUMN_LINE).hide();
			this.$el.parent().removeClass('resizingCol');
		},

		onColumnClicked: function(e) {
			if (!_.isBoolean(this.dragged) || !this.dragged) {
				this.setFieldSorting(e);
			}
		},

		onResizePress: function(event) {
			const target = $(event.target).closest(GridHeaderView.GRID_CELL);
			const ghostColumnLine = this.$el.find(GridHeaderView.GHOST_COLUMN_LINE);

			this.$el.parent().addClass('resizingCol');

			ghostColumnLine
				.css({
					height: this.getGhostColumnHeight(),
					left:
						target.find(GridHeaderView.RESIZEHANDLE__BAR).offset().left -
						this.$el.offset().left
				})
				.show();

			if (_.isFunction(target.tooltip)) {
				target.tooltip().close();
			}

			this.$el.find('th').disableTooltip();
		},

		onResizePressUp: function() {
			this.hideResizeGhostLine();
		},

		showMarketingCoachMark: function() {
			/**
			 * MARKA-620
			 * Added to make sure table and alphabet header is rendered before trying to add coachmark
			 */
			setTimeout(() => {
				if (this.listSettings.collection.type === 'person') {
					if (document.querySelector('[data-sortkey="marketing_status"]')) {
						marketingStatusCoachMark.show('PROMOTE_MARKETING_COLUMN_EDIT');
					} else {
						marketingStatusCoachMark.hide('PROMOTE_MARKETING_COLUMN_EDIT');
					}
				}
			}, 600);
		},

		afterRender: function() {
			this.showMarketingCoachMark();
		},

		onResizeStart: function(event) {
			const target = $(event.target).closest(GridHeaderView.GRID_CELL);
			const column = target.find('.item');
			const offset = column.outerWidth() - column.width();

			this.resizeColumnOptions = {
				$element: target,
				width: target.innerWidth(),
				minWidth: parseInt(column.css('min-width'), 10) + offset,
				maxWidth: parseInt(column.css('max-width'), 10) + offset
			};
		},

		onResizeMove: function(event) {
			const options = this.resizeColumnOptions;
			const newWidth = options.$element.width() + event.deltaX;
			const newWidthIsInRange = newWidth >= options.minWidth && newWidth <= options.maxWidth;

			if (newWidthIsInRange) {
				this.resizeColumnOptions.width = newWidth;
				this.$el
					.find(GridHeaderView.GHOST_COLUMN_LINE)
					.css('left', event.center.x - this.$el.offset().left);
			}
		},

		onResizeEnd: function() {
			const target = this.resizeColumnOptions.$element;
			const column = target.find(GridHeaderView.GRID_ITEM);

			this.hideResizeGhostLine();

			this.getCustomView().setColumnWidth({
				key: target.data('field'),
				width: this.resizeColumnOptions.width - (column.outerWidth() - column.width())
			});

			this.render();

			if (_.isFunction(this.options.onColumnsChanged)) {
				this.options.onColumnsChanged();
			}

			this.reorderingUtils.resetLeftOffset(
				this.$el.find(GridHeaderView.COLUMN_PICKER).offset().left
			);
		},

		setFieldSorting: function(e) {
			const target = $(e.currentTarget).closest(GridHeaderView.INTERACTIVE_COLUMN);
			const fieldKey = target.data('sortkey');

			if (this.notSortableColumns.includes(_.last(fieldKey.split('.')))) {
				return;
			}

			if (e.shiftKey) {
				if (this.sortingUtils.contains(fieldKey)) {
					this.sortingUtils.toggleDirection(fieldKey);
				} else {
					this.sortingUtils.append(fieldKey);
				}
			} else {
				if (this.sortingUtils.isPrimary(fieldKey)) {
					this.sortingUtils.toggleDirection(fieldKey);
				} else {
					this.sortingUtils.sort(fieldKey);
				}
			}

			this.setFieldSortingSpinner(target);
			this.updateSortingClasses();
		},

		updateSortingClasses: function() {
			const self = this;
			const sortedFields = this.sortingUtils.sortedFields;

			this.$el
				.find(`${GridHeaderView.INTERACTIVE_COLUMN} ${GridHeaderView.RESIZE__CONTENT}`)
				.each(function() {
					$(this).removeClass('primary ascending descending');
				});

			_.forEach(sortedFields, (key) => {
				self.setFieldSortingClass(key);
			});
		},

		setFieldSortingClass: function(fieldKey) {
			const className = [];
			const fieldElement = this.$el.find(
				`[data-sortkey="${fieldKey}"] ${GridHeaderView.RESIZE__CONTENT}`
			);

			if (this.sortingUtils.isPrimary(fieldKey)) {
				className.push('primary');
			}

			if (this.sortingUtils.isReversed(fieldKey)) {
				className.push('descending');
			} else {
				className.push('ascending');
			}

			fieldElement.addClass(className.join(' '));
		},

		updateSortingSpinner: function() {
			this.$el.find(GridHeaderView.INTERACTIVE_COLUMN).each(function() {
				const target = $(this);

				target.removeClass('sorting');
			});
		},

		setFieldSortingSpinner: function(target) {
			target.addClass('sorting');
		},

		getDefaultSortDirections: function() {
			const defaultSorting = {};

			_.forEach(
				this.getColumns(),
				_.bind(function(column, key) {
					const field = User.fields.getByKey(this.listSettings.collection.type, key);

					let sortDirection = 'asc';

					if (field && field.default_sort_direction) {
						sortDirection = field.default_sort_direction;
					}

					defaultSorting[key] = sortDirection;
				}, this)
			);

			return defaultSorting;
		},

		onReorderingStart: function(e) {
			if (e.which <= 1 || e.button <= 1) {
				this.originalEvent = e;
				this.reorderingUtils.updateOptions({
					header: this.$(GridHeaderView.INTERACTIVE_COLUMN)
				});

				this.reorderingUtils.setGhostColumnParams({
					top: '0px',
					height: this.getGhostColumnHeight()
				});

				this.reorderingUtils.startDragMonitoring();
				this.reorderingUtils.setPressed(true);
				this.reorderingUtils.setOriginalPosition(e.pageX);
				$(window).on('stickyHeader.column.dragging', _.bind(this.onReorderingMove, this));
			}

			return false;
		},

		onReorderingMove: function() {
			this.$el.parent().addClass('movingCol');
			this.dragged = this.reorderingUtils.isDragging;
			this.reorderingUtils.initSorting(this.originalEvent);
			$(window).off('stickyHeader.column.dragging');
		},

		onReorderingEnd: function(oldIndex, newIndex) {
			this.dragged = false;
			this.$el.parent().removeClass('movingCol');

			if (oldIndex === newIndex) {
				return;
			}

			const fields = this.getCustomView().get('fields');
			const currentField = fields[oldIndex];

			fields.splice(oldIndex, 1);
			fields.splice(newIndex, 0, currentField);
			this.getCustomView().saveSelectedFields(fields);

			this.render();

			if (_.isFunction(this.options.onColumnsChanged)) {
				this.options.onColumnsChanged();
			}

			ListViewAnalytics.trackListViewColumnReordering(
				currentField,
				oldIndex,
				newIndex,
				this.getCustomView()
			);
		},

		getGhostColumnHeight: function() {
			const scrollHeaderHeight = this.$el.find(GridHeaderView.GRID_SCROLL_HEADER).height();

			return _.min([
				this.$el
					.parent()
					.find(this.options.scrollTable)
					.height() + scrollHeaderHeight,
				this.$el
					.parent()
					.find(this.options.viewport)
					.height() + scrollHeaderHeight
			]);
		},

		setCheckboxState: function(checkboxState) {
			const checkboxIcon = checkboxState.indeterminate
				? '#icon-sm-minus'
				: '#icon-sm-check-done';

			this.$el
				.find(GridHeaderView.SELECT_ALL_CHECKBOX_INPUT)
				.prop('indeterminate', checkboxState.indeterminate)
				.prop('checked', checkboxState.checked);

			this.$el
				.find(GridHeaderView.SELECT_ALL_CHECKBOX_ICON)
				.attr('xlink:href', checkboxIcon)
				.attr('href', checkboxIcon);
		},

		setTooltips: function() {
			const isContentTruncated = function(e) {
				return e.offsetWidth < e.scrollWidth;
			};

			this.$el.find(GridHeaderView.RESIZE__CONTENT_ITEM).each(function() {
				if (isContentTruncated(this)) {
					const element = $(this);

					element.closest('th').tooltip({
						tip: $.trim(element.text()),
						preDelay: 0,
						postDelay: 0,
						zIndex: 20000,
						fadeOutSpeed: 100,
						position: 'top'
					});
				}
			});
		}
	},
	{
		GRID_SCROLL_HEADER: '.gridHeader--scrollable',
		GRID_FIXED_HEADER: '.gridHeader--fixed',
		GRID_HEADER_WRAPPER: '.gridHeader__wrapper',
		GRID_SCROLL_HEADER_TABLE: '.gridHeader__table--scrollable',
		GRID_ITEM: '.gridHeader__item',
		GRID_CELL: '.gridHeader__cell',

		SPINNER_CONTAINER: '.gridHeader__spinner',

		COLUMN_PICKER: '.gridHeader__columnPicker',
		RESIZE__CONTENT: '.resizeable__content',
		RESIZE__CONTENT_ITEM: '.resizeableContent__item',
		RESIZE__HANDLE: '.resizeable__handle',
		RESIZEHANDLE__BAR: '.resizeableHandle__bar',
		REORDER_HANDLE: '.reordering__handle',

		GHOST_COLUMN_LINE: '.ghostColumnLine',

		INTERACTIVE_COLUMN: '.gridHeader__cell--interactive',
		SELECT_ALL_COLUMN: '.gridHeader__cell--selectAll',
		SELECT_ALL_CHECKBOX: '.gridHeader__input--selectAll',
		SELECT_ALL_CHECKBOX_ICON: '.gridHeader__input--selectAll use',
		SELECT_ALL_CHECKBOX_INPUT: '.gridHeader__input--selectAll input'
	}
);

module.exports = GridHeaderView;
