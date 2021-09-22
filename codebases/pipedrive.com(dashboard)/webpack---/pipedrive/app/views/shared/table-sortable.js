'use strict';

const _ = require('lodash');
const Pipedrive = require('pipedrive');
const tableSortable = require('templates/shared/table-sortable.html');
const ColumnsPositions = require('utils/reordering/columns-positions');
const $ = require('jquery');
const GHOST_LINE_MARGIN = 1;

module.exports = Pipedrive.View.extend(
	/** @lends views/shared/TableSortable.prototype */ {
		template: _.template(tableSortable),
		tagName: 'div',
		className: 'tableSortable',
		isDragging: false,
		isPressed: false,
		dragX: 0,
		dragY: 0,
		minX: 0,
		maxX: 0,
		originalPosition: -1,

		/**
		 * @class Table header sortable
		 * @augments module:Pipedrive.View
		 * @constructs
		 *
		 * @returns {views/shared/TableSortable}
		 */
		initialize: function(options) {
			this.options = options || {};
			this.columnPositions = new ColumnsPositions();
			this.onDocument('mouseup.sortable', _.bind(this.stopDragging, this));
		},

		startDragMonitoring: function() {
			this.onDocument('mousemove.sortable', _.bind(this.handleDragging, this));
		},

		stopDragMonitoring: function() {
			this.isDragging = false;
			this.originalPosition = -1;
			this.lastDragPosition = null;
			this.offDocument('mousemove.sortable');
		},

		onUnload: function() {
			this.offDocument('mousemove.sortable');
			this.offDocument('mouseup.sortable');
		},

		setPressed: function(isPressed) {
			this.isPressed = isPressed;
		},

		calculateDraggingDetails: function(x) {
			this.isDragging =
				(this.originalPosition > -1 && Math.abs(x - this.originalPosition) > 4) ||
				this.lastDragPosition;
			this.lastDragPosition = this.isDragging ? x : null;
		},

		/**
		 * Sets sortable options and appends after parent
		 *
		 * @param {Object} options
		 * @void
		 */
		setSortable: function(options) {
			this.options = _.assignIn(this.options, options);

			if (this.options.parent.siblings('.tableSortable').length === 0) {
				this.options.parent.after(this.$el);
			}

			this.minX = this.options.min;
			this.maxX = this.options.max;

			this.ghostColumn = this.options.ghostColumn || this.$('.ghostColumn');
			this.frostColumn = this.options.frostColumn || this.$('.frostColumn');
			this.ghostColumnLine = this.options.ghostColumnLine || this.$('.ghostColumnLine');
		},

		/**
		 * Inits sorting on mousepress
		 *
		 * @param {$.Event} ev event
		 * @void
		 */
		initSorting: function(ev) {
			this.columnPositions.reset(this.options.header);

			const activeEl = $(ev.currentTarget).closest('th');
			const elementOffset = activeEl.offset();

			this.dragY = elementOffset.top;
			this.dragX = elementOffset.left;
			this.offsetDelta = ev.pageX - this.dragX;

			this.oldIndex = this.columnPositions.indexFromCoordinates(Math.ceil(this.dragX));
			this.showGhosts({
				offset: elementOffset,
				width: activeEl.outerWidth(),
				height: activeEl.outerHeight()
			});
		},

		setOriginalPosition: function(x) {
			this.originalPosition = x;
		},

		isPressedAndDragging: function(ev) {
			return ev.type === 'mousemove' && this.isPressed && this.isDragging;
		},

		/**
		 * Handles header column 'drag'
		 *
		 * @param {$.Event} ev event
		 * @void
		 */
		handleDragging: function(ev) {
			const pageX = ev.originalEvent.pageX;

			this.calculateDraggingDetails(pageX);

			if (this.isPressedAndDragging(ev)) {
				$(window).trigger('stickyHeader.column.dragging');
				this.dragGhosts(pageX);
			}
		},

		showGhosts: function(options) {
			const parentOffsetLeft = this.calculateParentOffsetLeft();
			const top = this.ghostsTop || this.dragY;
			const height = this.ghostsHeight || this.calculateGhostsHeight(options.offset);

			this.ghostColumn
				.css({
					left: this.dragX - parentOffsetLeft,
					top,
					width: options.width,
					height
				})
				.show();

			this.frostColumn
				.css({
					left: this.dragX - parentOffsetLeft,
					top: top + options.height,
					width: options.width,
					height: height - options.height
				})
				.show();
		},

		dragGhosts: function(pageX) {
			this.dragGhostColumn(pageX);
			this.dragGhostLine(pageX);
		},

		dragGhostColumn: function(pageX) {
			const parentOffsetLeft = this.calculateParentOffsetLeft();
			const $ghost = this.ghostColumn;
			const ghostWidth = $ghost.width();

			this.dragX = pageX - this.offsetDelta - parentOffsetLeft;

			if (this.dragX < this.minX) {
				this.dragX = this.minX;
			}

			if (this.dragX + ghostWidth > this.maxX) {
				this.dragX = this.maxX - ghostWidth;
			}

			$ghost.css({
				left: this.dragX
			});
		},

		dragGhostLine: function(pageX) {
			const parentOffsetLeft = this.calculateParentOffsetLeft();
			const $firstColumn = $(this.options.header[0]);

			let ghostLineX = this.columnPositions.getGhostStartCoordinates(pageX, parentOffsetLeft);

			if (ghostLineX < this.minX) {
				ghostLineX = this.minX;
			}

			if (ghostLineX > this.maxX) {
				ghostLineX = this.maxX;
			}

			this.ghostColumnLine
				.css({
					top: this.ghostsTop || this.dragY,
					left: ghostLineX - GHOST_LINE_MARGIN,
					height: this.ghostsHeight || this.calculateGhostsHeight($firstColumn.offset())
				})
				.show();
		},

		calculateGhostsHeight: function(offset) {
			const dialogBody = this.$el.closest('.dialogBody');

			if (dialogBody.length > 0) {
				return dialogBody.height() - (offset.top - dialogBody.offset().top);
			}

			return $(window).height() - offset.top;
		},

		calculateParentOffsetLeft() {
			const $parentOffset = this.$el.closest('.grid__header').offset();

			return $parentOffset ? $parentOffset.left : 0;
		},

		/**
		 * Handles header column dragging end
		 *
		 * @void
		 */
		stopDragging: function() {
			if (this.isDragging && this.isPressed) {
				this.setPressed(false);

				const ghostPosition = this.ghostColumnLine.offset().left + GHOST_LINE_MARGIN;

				let newIndex = this.columnPositions.indexFromCoordinates(Math.ceil(ghostPosition));

				if (newIndex > this.oldIndex || newIndex >= this.columnPositions.size()) {
					newIndex -= 1;
				}

				this.ghostColumn.hide();
				this.ghostColumnLine.hide();
				this.frostColumn.hide();

				if (_.isFunction(this.options.handleDragging)) {
					this.options.handleDragging(this.oldIndex, newIndex);
				}
			}

			this.stopDragMonitoring();
		},

		selfRender: function() {
			this.$el.html(this.template);
		},

		setGhostColumnParams: function(options) {
			this.ghostsTop = options.top;
			this.ghostsHeight = options.height;
		},

		resetLeftOffset: function(maxX) {
			this.maxX = maxX;
		},

		updateOptions: function(options) {
			_.assignIn(this.options, options);
		}
	}
);
