const Pipedrive = require('pipedrive');
const _ = require('lodash');
const PopoverTemplate = require('templates/popover.html');
const $ = require('jquery');
const Popper = require('popper.js').default;
const defaultOptions = {
	offset: 8,
	position: 'bottom'
};
const KEY = Pipedrive.common.keyCodes();
const logger = new Pipedrive.Logger('popover');
const PDMetrics = require('utils/pd-metrics');

/**
 * Fix to prefer original placement if flipped placement doesn't have enough room either.
 * Related to Popper.js issue: https://github.com/FezVrasta/popper.js/issues/550
 * Backported from https://github.com/pipedrive/convention-ui-react/blob/cf491460816155477b1a1a04afead75ce0ecf3bc/src/components/select/index.js#L57
 */
const POPPER_FLIP_BEHAVIOR_OVERRIDE = ['bottom', 'top', 'bottom'];

/**
 * Popover Pipedrive View
 */
const Popover = Pipedrive.View.extend({
	tagName: 'div',
	id: 'popover',
	action: null,
	template: _.template(PopoverTemplate),
	initialized: false,

	initialize: function() {
		this.options = {};
		this.view = null;
		this.instanceData = {};

		app.global.bind('ui.popover.spinner.show', this.showSpinner, this);
		app.global.bind('ui.popover.spinner.hide', this.hideSpinner, this);
		app.global.bind('ui.popover.event.close', this.close, this);

		this.onWindow('resize.popover', _.bind(this.close, this));
		this.onWindow('keyup.popover', _.bind(this.listenKeys, this));
	},

	render: function(data) {
		this.instanceData = data || {};

		this.$el.html(
			this.template({
				title: data && data.title
			})
		);

		if (_.isString(data.className)) {
			this.$el.addClass(data.className);
		}

		this.$('.body').append(data.content);

		// Use separate element for arrow instead of :before pseudo element so you can set its position with css
		this.$el.appendTo(this.options.appendTo || 'body');

		// this callback logic is way too complex!!!
		if (_.isFunction(data.onload)) {
			if (_.isFunction(data.onrender)) {
				this.onPopoverLoad = data.onload;
			} else {
				this.onPopoverLoad = _.bind(function() {
					data.onload.call(this);
					this.hideSpinner();
				}, this);
			}
		} else {
			this.onPopoverLoad = null;
		}

		if (_.isFunction(data.onrender)) {
			data.onrender(
				_.bind(function() {
					this.hideSpinner();
				}, this)
			);
		}

		if (!data.onrender && !data.onload) {
			this.onPopoverLoad = _.bind(this.hideSpinner, this);
		}

		this.onPopperChange = data.onPopperChange;

		this.focus();
		this.bindEvents();
	},

	isInOpener: function(ev) {
		return (
			!this.opener || !($(ev.target).is(this.opener) || $.contains(this.opener, ev.target))
		);
	},

	bindEvents: function() {
		// eslint-disable-next-line complexity
		this.onDocument(
			'mousedown.popover',
			_.bind(function(ev) {
				const $target = $(ev.target);
				const isInPopover = this.$el.is(ev.target) || this.$el.find(ev.target).length;
				const isACResult = $target.closest('#widget-ac-results').length;
				const picadayValidClasses = ['pika-button', 'pika-prev', 'pika-next'];
				const isPikadayButton = _.intersection(
					`${$target.attr('class')}`.split(' '),
					picadayValidClasses
				).length;
				const isPikaday =
					$target.closest('.pika-table').length ||
					$target.closest('.pika-title').length ||
					isPikadayButton;
				const isTimePicker = $target.closest('.time-picker').length;

				if (!isInPopover && !isACResult && !isPikaday && !isTimePicker) {
					// If target was opener element, do not fire close manually
					// as it is picked up with the popover.show()
					if (this.isInOpener(ev)) {
						app.global.fire('ui.popover.event.close', ev);
					}
				}
			}, this)
		);
	},

	// eslint-disable-next-line complexity
	show: function(contentId, params) {
		if (contentId === 'close') {
			app.global.fire('ui.popover.event.close');

			return;
		}

		// When target is opener, toggle close
		if ($(params.target).is(this.opener)) {
			app.global.fire('ui.popover.event.close');

			return;
		}

		PDMetrics.addPageAction('PopoverOpen', {
			popover: contentId
		});

		return this.openContent(contentId, params);
	},

	openContent: function(contentId, params) {
		let replace = false;

		const popoverInsidePopover = this.isPopoverInsideSelector(params, '#popover');
		const popoverInsideModal = this.isPopoverInsideSelector(params, '#modal');

		// Figure out if popover was triggered inside a popover.
		// If so, replace existing popover view with a new one.
		if (popoverInsidePopover && this.$target && !this.$target.is(params.target)) {
			params.target = this.options.target;
			replace = true;

			this.view.destroy();
			this.view = null;
		}

		// If popover is triggered from within the modal, raise z-index
		this.$el.attr('data-modal', popoverInsideModal ? true : null);

		this.addTargetPopoverData(params.target);

		this.options = Object.assign({}, defaultOptions, params);

		if (this.isNewTargetCurrentTarget(params.target) && !replace) {
			app.global.fire('ui.popover.event.close');
		} else {
			this.$target = $(params.target);

			this.opener = params.target;
			logger.log(`Opening Popover: ${contentId}`);

			if (params.popoverView) {
				this.renderPopoverView(params.popoverView);
			} else {
				import(/* webpackChunkName: "popover-[request]" */ `views/popovers/${contentId}`)
					.then(({ default: view }) => {
						this.renderPopoverView(view);
					})
					.catch((err) => {
						logger.warn('Could not open Popover', err);
					});
			}
		}

		return replace;
	},

	isNewTargetCurrentTarget: function(target) {
		return this.$target && this.$target.data('popover') && this.$target.is(target);
	},

	isPopoverInsideSelector: function(params, selector) {
		return params.target && $(params.target).closest(selector).length;
	},

	addTargetPopoverData: function(target) {
		if ($(target).length && !this.$target) {
			$(target).attr('data-popover', true);
		}
	},

	renderPopoverView: function(PopoverView) {
		this.view = new PopoverView({
			dialog: this,
			params: _.assignIn({}, this.options, { listenToModelChange: false })
		});

		this.render(this.view.render());
		this.showSpinner();
		this.open();
	},

	popperUpdate: function(data) {
		this.setPlacement(data.placement);

		if (_.isFunction(this.instanceData.onPopperChange)) {
			this.instanceData.onPopperChange(data);
		}
	},

	/**
	 * Calculate and place popover in right position in relation to clicked element
	 * @param  {string} params Given position params in two-part string
	 */
	calculatePosition: function() {
		if (!this.$target || !this.$target.length) {
			return;
		}

		if (this.popper) {
			this.popper.scheduleUpdate();
		} else {
			const offset = this.options.offset;

			let negative = offset && offset < 0;

			if (this.placement && this.placement.endsWith('start')) {
				negative = !negative;
			}

			this.popper = new Popper(this.$target.get(0), this.el, {
				placement: this.placement,
				onCreate: this.popperUpdate.bind(this),
				onUpdate: this.popperUpdate.bind(this),
				modifiers: Object.assign(
					{
						preventOverflow: { enabled: false },
						hide: { enabled: false },
						flip: {
							behavior: POPPER_FLIP_BEHAVIOR_OVERRIDE
						}
					},
					this.options.popperOptions,
					{
						arrow: { enabled: false },
						offset: {
							offset: `${(negative ? -1 : 1) * Math.abs(this.options.offset)}px, 4px`
						}
					}
				)
			});
		}
	},

	setPlacement: function(placement) {
		const recalculate = this.placement !== placement;

		this.placement = placement;

		if (recalculate) {
			this.$el
				.removeClass(
					['bottom', 'top', 'left', 'right']
						.reduce((acc, direction) => {
							acc.push(`cui4-popover--placement-${direction}`);
							acc.push(`cui4-popover--placement-${direction}-start`);
							acc.push(`cui4-popover--placement-${direction}-end`);

							return acc;
						}, [])
						.join(' ')
				)
				.addClass(_.escape(`cui4-popover--placement-${placement}`));

			this.calculatePosition();
		}
	},

	open: function() {
		app.global.fire('ui.popover.event.open');

		this.setPlacement(this.options.position);
		this.$el
			.css({
				visibility: 'visible',
				display: 'none'
			})
			.fadeIn(80, this.instanceData.onOpen);

		this.focus();

		if (_.isFunction(this.onPopoverLoad)) {
			this.onPopoverLoad.call(this);
		}
	},

	close: function(ev) {
		if (this.cantClosePopover(ev)) {
			return;
		}

		if (_.isFunction(this.instanceData.onclose)) {
			this.instanceData.onclose();
		}

		if (this.view && _.isFunction(this.view.destroy)) {
			this.view.destroy();
			this.view = null;
		}

		this.resetPopover();
	},

	cantClosePopover: function(ev) {
		return ev && ev.target && this.options.closeManually && ev.type !== 'resize';
	},

	resetPopover: function() {
		this.$('input').trigger('blur');
		this.$el.css({
			visibility: 'hidden'
		});

		if (this.$target && this.$target.length) {
			this.$target.removeAttr('data-popover');
			this.$target = null;
		}

		this.el.className = 'cui4-popover';
		this.opener = null;
		this.placement = null;

		if (this.popper) {
			this.popper.destroy();
			this.popper = null;
		}

		this.instanceData = {};

		this.$el.remove();

		this.offDocument('mousedown.popover');

		this.blur();
	},

	listenKeys: function(ev) {
		switch (ev.keyCode) {
			case KEY.escape:
				if (!this.options.customCloseEvent) {
					app.global.fire('ui.popover.event.close');
				}

				break;
		}
	},

	showSpinner: function() {
		this.$('.cui4-popover__inner > .loading').show();
	},

	hideSpinner: function() {
		this.$('.cui4-popover__inner > .loading').hide();
	}
});

module.exports = new Popover();
