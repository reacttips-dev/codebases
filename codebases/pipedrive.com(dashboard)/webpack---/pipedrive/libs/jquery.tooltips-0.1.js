/**
 * @licence jQuery tooltips plugin
 *
 * Copyright (c) 2010 Martin Tajur (martin@tajur.ee)
 * Licensed under the GPL license and MIT:
 *   http://www.opensource.org/licenses/GPL-license.php
 *   http://www.opensource.org/licenses/mit-license.php
 */

import $ from 'jquery';
import Popper from 'popper.js';

$.fn.tooltip = function(options) {
	var defaults = {
		position: 'bottom-end',
		preDelay: 200,
		postDelay: 200,
		tip: '',
		addClass: [],
		maxWidth: 'auto',
		maxHeight: 'auto',
		tooltipElementId: 'tooltip',
		tooltipContainerId: 'tooltipContainer',
		clickCloses: false,
		offset: 0,
		// Optionally, use a custom event (eg. 'showMyTooltip') instead of 'hover'.
		// Then use jQuery's .trigger('showMyTooltip') to show the tooltip.
		// In that case:
		//	-	preDelay represents the time after the custom event is triggered and
		//		before the tooltip is shown
		//	-	postDelay represents the time how long the tooltip is shown
		//		before it fades out
		customEvent: null,
		// The tooltip shown right after it gets initialized
		showOnInit: false,
		removeOnClose: false,
		// A callback triggered once tooltip gets shown
		onShow: null
	};

	options = $.extend(defaults, options);

	this.each(function() {
		new $.tooltip($(this), options);
	});

	return {
		options: options,
		remove: function(el) {
			$(el).disableTooltip();
		},
		close: function() {
			if ($('#' + options.tooltipElementId + ':visible').length) {
				$('#' + options.tooltipElementId + ':visible').hide();
			}
		}
	};
};

$.fn.disableTooltip = function() {
	this.each(function() {
		$(this).off('mouseover.tooltip mouseout.tooltipshow click.tooltiphide tooltipClose');
	});
};

$.tooltipTimeouts = {
	hide: false,
	show: false
};

$.tooltip = function($obj, opts) {
	var $tooltip, $container;

	if ($('#' + opts.tooltipElementId).length && $('#' + opts.tooltipContainerId).length) {
		$tooltip = $('#' + opts.tooltipElementId);
		$container = $('#' + opts.tooltipContainerId);
	} else {
		var tooltipHtml =
			'<div id="' + opts.tooltipElementId + '">' +
				'<div class="cui4-tooltip__arrow"><div class="cui4-tooltip__arrow-inner"></div></div>' +
				'<div class="cui4-tooltip__inner"></div>' +
			'</div>';
		var containerHtml = '<div class="cui4-spacing cui4-spacing--top-xs cui4-spacing--right-s cui4-spacing--bottom-xs cui4-spacing--left-s" id="' + opts.tooltipContainerId + '"></div>';

		$tooltip = $(tooltipHtml);
		$container = $(containerHtml);
		$tooltip.find('.cui4-tooltip__inner').append($container);
		$tooltip.css({
			visibility: 'hidden'
		});
		$tooltip.appendTo('body');
	}

	var _placementClass = [],
		_position = (typeof opts.position === 'function') ? opts.position().split(/\s|-/) : opts.position.split(/\s|-/),
		clearTimeouts = function(show, hide) {
			if ($ && $.tooltipTimeouts) {
				if (show && $.tooltipTimeouts.show) {
					clearTimeout($.tooltipTimeouts.show);
				}
				if (hide && $.tooltipTimeouts.hide) {
					clearTimeout($.tooltipTimeouts.hide);
				}
			}
		};

	var _showFunction = function() {
		$tooltip.removeAttr('style').removeClass().addClass('cui4-tooltip');
		_placementClass = _position;

		if (opts.tipHtml) {
			var tipHtml = (typeof opts.tipHtml === 'function') ? opts.tipHtml() : opts.tipHtml;

			$container.html(tipHtml).show();
		} else {
			var tip = (typeof opts.tip === 'function') ? opts.tip() : opts.tip;

			$container.text(tip).show();
		}

		$tooltip.css({
			width: opts.maxWidth || 'auto',
			height: opts.maxHeight || 'auto'
		});

		$tooltip.addClass(opts.addClass.join(' '));
		$tooltip.addClass('cui4-tooltip--placement-' + _placementClass.join('-'));

		var negative = true;

		if (opts.position.indexOf('end') !== -1) {
			negative = false;
		}

		new Popper($obj.get(0), $tooltip.get(0), {
			placement: _placementClass.join('-'),
			modifiers: Object.assign(
				{
					preventOverflow: { enabled: false },
					hide: { enabled: false },
					arrow: { enabled: false },
					offset: {
						offset: (negative ? '-' : '') + opts.offset + 'px, 2px'
					}
				}
			)
		});

		$tooltip.css({
			visibility: ''
		});

		if (typeof opts.onShow === 'function') {
			opts.onShow($tooltip);
		}

		if (opts.customEvent) {
			$.tooltipTimeouts.hide = setTimeout(function() {
				$tooltip.fadeOut(300, function() {
					$tooltip.removeClass(opts.addClass.join(' ')).removeClass('cui4-tooltip--placement-' + _placementClass.join('-'));
				});
			}, opts.postDelay);
		} else {
			$tooltip
				.off('mouseover.keep')
				.on('mouseover.keep', function() {
					clearTimeouts(false, true);
					$tooltip.addClass(opts.addClass.join(' ')).addClass('cui4-tooltip--placement-' + _placementClass.join('-'));
					$tooltip.appendTo('body');
					$tooltip.css({
						display: ''
					});

					if (typeof opts.onShow === 'function') {
						opts.onShow($tooltip);
					}
				})
				.off('mouseout.unkeep')
				.on('mouseout.unkeep', function(e) {
					if (!$(e.target).parents('.' + $tooltip.attr('class').replace(' ', '.')).length) {
						clearTimeouts(false, true);
						$tooltip.hide();
						$tooltip.removeClass(opts.addClass.join(' '))
							.removeClass('cui4-tooltip--placement-' + _placementClass.join('-'));
					}
				})
				.off('mouseleave.unkeep')
				.on('mouseleave.unkeep', function() {
					clearTimeouts(false, true);
					$tooltip.hide();
					$tooltip.removeClass(opts.addClass.join(' '))
						.removeClass('cui4-tooltip--placement-' + _placementClass.join('-'));
				});
		}
	};

	if (opts.customEvent) {
		$obj.off(opts.customEvent + '.tooltip');
		$obj.on(opts.customEvent + '.tooltip', function() {
			clearTimeouts(true, true);
			$.tooltipTimeouts.show = setTimeout(_showFunction, opts.preDelay);
		});
	} else {
		$obj.off('mouseover.tooltip');
		$obj.on('mouseover.tooltip', function() {
			clearTimeouts(true, true);
			if ($.tooltipTimeouts) {
				$.tooltipTimeouts.show = setTimeout(_showFunction, opts.preDelay);
			}
		});

		$obj.off('mouseout.tooltipshow');
		$obj.on('mouseout.tooltipshow', function() {
			clearTimeouts(true);
			if ($.tooltipTimeouts) {
				$.tooltipTimeouts.hide = setTimeout(function() {
					$tooltip.hide();
					$tooltip.removeClass(opts.addClass.join(' ')).removeClass('cui4-tooltip--placement-' + _placementClass.join('-'));
					if (opts.removeOnClose) {
						$obj.disableTooltip();
					}
				}, opts.postDelay);
			}
		});

		$obj.off('click.tooltiphide touchstart.tooltiphide touchend.tooltiphide');
		$obj.on('click.tooltiphide touchstart.tooltiphide touchend.tooltiphide', function() {
			clearTimeouts(true, opts.clickCloses);
			if (opts.clickCloses) {
				$tooltip.hide();
				$tooltip.removeClass(opts.addClass.join(' ')).removeClass('cui4-tooltip--placement-' + _placementClass.join('-'));
			}
		});
	}

	$obj.on('tooltipClose', function() {
		clearTimeouts(true);
		$tooltip.hide();
		if (opts.removeOnClose) {
			$obj.disableTooltip();
		}
	});

	if (opts.showOnInit === true) {
		_showFunction();
	}
};