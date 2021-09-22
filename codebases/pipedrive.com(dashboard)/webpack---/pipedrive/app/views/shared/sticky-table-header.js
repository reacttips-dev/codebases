'use strict';

const _ = require('lodash');
const Pipedrive = require('pipedrive');
const TableSortable = require('views/shared/table-sortable');
const $ = require('jquery');

module.exports = Pipedrive.View.extend(
	/** @lends views/shared/StickyHeader.prototype */ {
		tagName: 'table',
		resizePending: false,

		/**
		 * @class Table sticky header
		 * @augments module:Pipedrive.View
		 * @constructs
		 *
		 * @param {Object} options Options for sticky header
		 * @returns {views/shared/StickyHeader}
		 */
		initialize: function(options) {
			/**
			 * Options for StickyHeader
			 * @type {Object}
			 */
			this.options = options || {};
			this.boundsContainer = this.options.boundsContainer;
			this.listSettings = this.options.listSettings;
			this.fields = this.getCustomView().get('fields');
			this.sortable = new TableSortable({
				handleDragging: _.bind(this.handleDragging, this)
			});

			this.dragged = false;

			const resizeHeader = _.bind(this.resizeHeader, this);
			const deBouncedResize = this.options.deBounceResize
				? _.debounce(resizeHeader, 30)
				: resizeHeader;

			this.onWindow('resize.resizeHeader', deBouncedResize);
		},

		getCustomView: function() {
			return this.listSettings.getCustomView();
		},

		boundTo: function($container) {
			this.boundsContainer = $container;
		},

		setDragged: function() {
			this.dragged = this.sortable.isDragging;
			this.sortable.initSorting(this.originalEvent);
			$(window).off('stickyHeader.column.dragging');
		},

		handleDragging: function(oldIndex, newIndex) {
			if (oldIndex === newIndex) {
				return;
			}

			const temp = this.fields[oldIndex];

			this.fields.splice(oldIndex, 1);
			this.fields.splice(newIndex, 0, temp);
			this.getCustomView().saveSelectedFields(this.fields);

			if (_.isFunction(this.options.onColumnReorder)) {
				this.options.onColumnReorder();
			}
		},

		/**
		 * Sets tables sticky header structure
		 *
		 * @void
		 */
		setHeader: function() {
			this.$sourceHeader = this.options.container.find('table.list thead');
			const isInDOM = this.$sourceHeader.closest(document.documentElement).length > 0;
			const sortableColumnsSelectors = ['th[data-field]'];
			const self = this;

			this.boundsContainer.off('scroll.stickyHeader');

			if (this.$sourceHeader.length && isInDOM) {
				// Clone header to sticky container
				this.$el.width(this.$sourceHeader.width());
				this.$el.html(this.$sourceHeader.clone());
				this.fields = this.getCustomView().get('fields');

				this.sortable.render();

				const sortableMin =
					this.$('th.selectableRow').innerWidth() || this.boundsContainer.offset().left;
				const sortableMax = this.$('th.customize').offset().left;

				this.sortable.setSortable({
					parent: this.$el,
					min: sortableMin,
					max: sortableMax,
					header: this.$('th.draggable')
				});

				this.boundsContainer.on('scroll.stickyHeader', function() {
					self.$el.css('left', -$(this).scrollLeft());
				});

				this.$el.css('left', -this.boundsContainer.scrollLeft());
			}

			if (this.$('thead th').length > 0) {
				this.$('th.draggable').on('mousedown', function(ev) {
					// only trigger on left click
					if (ev.which <= 1 || ev.button <= 1) {
						self.sortable.setGhostColumnParams(self.calculateGhostDimensions());
						self.sortable.startDragMonitoring();
						self.sortable.setPressed(true);
						self.sortable.setOriginalPosition(ev.originalEvent.pageX);
						self.originalEvent = ev;
						$(window).on('stickyHeader.column.dragging', _.bind(self.setDragged, self));
					}

					return false;
				});

				this.$('th.draggable').on('mouseup', function() {
					self.sortable.setPressed(false);
				});

				this.$(sortableColumnsSelectors.join('')).on('mouseup', function(ev) {
					if (
						_.isFunction(self.options.onColumnSort) &&
						(!_.isBoolean(this.dragged) || !this.dragged)
					) {
						self.options.onColumnSort(ev);
					}

					this.dragged = false;
				});
			}

			if (isInDOM) {
				this.focus();
			} else {
				this.blur();
			}

			return isInDOM;
		},

		onAttachedToDOM: function() {
			this.$el.css('display', 'table');
		},

		/**
		 * Resize sticky header based on parent tables header size,
		 * avoiding unnecessary calculations by avoiding many resizeHeader calls
		 * in a row
		 *
		 * @void
		 */
		resizeHeaderAsync: function() {
			const self = this;

			if (!this.resizePending) {
				this.resizePending = true;
				setTimeout(function() {
					self.resizeHeader.call(self);
					self.resizePending = false;
				}, 0);
			}
		},

		/**
		 * Resize sticky header based on parent tables header size
		 *
		 * @void
		 */
		resizeHeader: function() {
			if (!this.setHeader()) {
				return;
			}

			const $headerList = this.$('th');
			const $sourceList = this.$sourceHeader.find('th');

			let padding;

			$headerList.each(function(i) {
				padding =
					parseInt(
						$($sourceList[i])
							.css('padding-left')
							.replace('px', ''),
						10
					) +
					parseInt(
						$($sourceList[i])
							.css('padding-right')
							.replace('px', ''),
						10
					);

				const w = $($sourceList[i]).innerWidth() - padding;

				$(this).css({
					minWidth: w
				});

				$(this).attr('class', $($sourceList[i]).attr('class'));
			});
		},

		/**
		 * Shows hidden sticky header
		 * @void
		 */
		reveal: function() {
			this.$el.css('opacity', '1');
		},

		/**
		 * Hides sticky header by making it transparent
		 * @void
		 */
		hide: function() {
			this.$el.css('opacity', '0');
		},

		onUnload: function() {
			if (this.sortable) {
				this.sortable.destroy();
			}
		},

		calculateGhostDimensions: function() {
			const tableView = this.boundsContainer.find('.tableView');
			const boundingContainer = tableView.length ? tableView : this.boundsContainer;
			const height = Math.min(
				$(window).height() - boundingContainer.offset().top,
				boundingContainer.height()
			);
			const top = boundingContainer.offset().top;

			return {
				height,
				top
			};
		}
	}
);
