/**
 * Select / deselect consecutive checkboxes while dragging over them
 *
 * @class utils/Click-and-drag-to-select
 */

'use strict';

const _ = require('lodash');
const $ = require('jquery');

/**
 * @param  {Object} jQuery object - container in which's scope the selection happens (eg. a table)
 * @param  {string} eg. a table-cell that contains the checkbox (eg. 'td.firstCellInRow')
 */

const ClickAndDrag = function($container, selector) {
	this.initialize($container, selector);
};

_.assignIn(ClickAndDrag.prototype, {
	$container: null,
	selector: null,
	// Initial input/checkbox container - the cell where the dragging started
	$initInputContainer: null,
	// Initial input's initial status - whether to check or uncheck the inputs being dragged
	initInputInitStatus: null,
	// pageWidth and pageHeight used to remember current page size. See method "ifMouseOutOfPage"
	pageWidth: null,
	pageHeight: null,

	initialize: function($container, selector) {
		this.$container = $container;
		this.selector = selector;
		this.$container.on('mousedown.clickanddrag', this.selector, _.bind(this.onMouseDown, this));
	},

	onMouseDown: function(ev) {
		// We are only interested in the "left" mouse button click
		if (ev.button !== 0) {
			return;
		}

		this.$initInputContainer = $(ev.currentTarget);
		this.initInputInitStatus = this.$initInputContainer.find('input').is(':checked');

		this.$initInputContainer.on('mouseleave.clickanddrag', _.bind(this.clickInitInput, this));
		this.$container.on(
			'mouseenter.clickanddrag',
			this.selector,
			_.bind(this.onMouseEnter, this)
		);
		// "mouseup" event anywhere on the whole document stops the dragging and resets related items
		this.$container.on('mouseup.clickanddrag', document, _.bind(this.reset, this));

		this.pageWidth = $(document).width();
		this.pageHeight = $(document).height();
		$(document).on('mousemove.clickanddrag', _.bind(this.onMouseMove, this));
	},

	/**
	 * Check/uncheck the initial checkbox when mouse leaves it while dragging
	 */
	clickInitInput: function() {
		this.$initInputContainer.off('mouseleave.clickanddrag');
		this.$initInputContainer.find('input').click();
	},

	onMouseEnter: function(ev) {
		// If mouse enters an input that is not in the desired state, trigger click
		const $currentInput = $(ev.currentTarget).find('input');

		if ($currentInput.is(':checked') === this.initInputInitStatus) {
			$currentInput.click();
		}
	},

	onMouseMove: function(ev) {
		this.ifMouseOutOfPage(ev);
	},

	/**
	 * Stop the dragging, if mouse out of page borders,
	 * because out of the page we don't know when the user releases the mouse button
	 */
	ifMouseOutOfPage: _.throttle(function(ev) {
		if (
			ev.clientX < 0 ||
			ev.clientX > this.pageWidth ||
			ev.clientY < 0 ||
			ev.clientY > this.pageHeight
		) {
			this.reset();
		}
	}, 300),

	reset: function() {
		this.initInputInitStatus = null;

		if (this.$initInputContainer) {
			this.$initInputContainer.off('.clickanddrag');
			this.$initInputContainer = null;
		}

		this.$container.off('mouseenter.clickanddrag mouseup.clickanddrag');
		$(document).off('.clickanddrag');
		this.pageWidth = null;
		this.pageHeight = null;
	},

	/**
	 * To be used in related view's "onUnload" method or such
	 */
	destroy: function() {
		this.reset();
		this.$container.off('.clickanddrag');
	}
});

module.exports = ClickAndDrag;
