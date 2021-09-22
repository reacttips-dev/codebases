const Pipedrive = require('pipedrive');
const User = require('models/user');
const Deal = require('models/deal');
const _ = require('lodash');
const overlayTemplate = require('templates/modal.html');
const Colors = require('utils/colors');
const $ = require('jquery');
const KEY = Pipedrive.common.keyCodes();
const logger = new Pipedrive.Logger(`webapp.${app.ENV}`, 'modal');
const { shouldUseActivityModal } = require('views/modals/activity-v2/helpers');
const PDMetrics = require('utils/pd-metrics');
const { addFlowCoachmark, closeFlowCoachmark } = require('utils/support/interface-tour');
const modals = require('utils/modals');

/**
 * Modal Pipedrive View
 */
const Modal = Pipedrive.View.extend({
	tagName: 'div',
	template: _.template(overlayTemplate),
	view: null,

	windowWidth: $(window).innerWidth(),
	windowHeight: $(window).innerHeight(),

	events: {
		'click .cui4-modal__backdrop': 'clicked'
	},

	initialize: function(opts) {
		this.options = opts;
		this.el.id = 'modal';
		this.el.className = 'cui4-modal';

		app.global.bind('ui.modal.spinner.show', this.showSpinner, this);
		app.global.bind('ui.modal.spinner.hide', this.hideSpinner, this);
		app.global.bind('ui.modal.event.close', this.close, this);
	},

	getDefaultOptions: function() {
		return {
			closeButton: _.form.button({
				class: 'cui4-modal__close',
				color: 'ghost',
				href: '#dialog/close',
				action: this.closeModal.bind(this),
				icon: 'cross',
				noWrap: true,
				size: 's'
			}),
			title: '',
			action: _.form.button({
				noWrap: true,
				text: _.gettext('Close'),
				action: this.closeModal.bind(this)
			}),
			additionalActions: '',
			content: null,
			backdropClose: false,
			class: null,
			primaryButtonSelector: null,
			onload: null,
			onresize: null,
			onclose: null,
			showCloseButton: true,
			spacing: 'm'
		};
	},

	closeModal: function() {
		modals.close();
	},

	render: function(view) {
		view.render();

		const options = _.defaults({}, view.getModalOptions(), this.getDefaultOptions());

		this.$el.html(this.template(options));
		this.$('.cui4-modal__content .cui4-spacing').append(options.content);
		$('body').append(this.$el);
		this.$dialog = this.$('.cui4-modal__wrap');

		this.applyOptions(options);

		this.$('.cui4-modal__content').on(
			'scroll.modal',
			_.bind(function() {
				app.global.fire('ui.modal.event.scroll', this);

				const scrollLeft = -(this.$('.cui4-modal__content').scrollLeft() - 16);

				this.$('.dropmenu').css({
					'margin-right': scrollLeft
				});
			}, this)
		);

		this.focus();
	},

	applyOptions: function(options) {
		this.backdropClose = _.isUndefined(options.backdropClose) ? false : options.backdropClose;
		this.applyOptionsEvents(options);

		if (options.class) {
			this.$dialog.addClass(options.class);
		}

		if (options.primaryButtonSelector) {
			this.primaryButtonSelector = options.primaryButtonSelector;
		}

		_.forEach(options.additionalActions, (action) => {
			if (_.isFunction(action.onLoad)) {
				action.onLoad.call(this);
			}
		});
	},

	applyOptionsEvents: function(options) {
		if (_.isFunction(options.onload)) {
			this.onModalLoad = options.onload;
		} else {
			this.onModalLoad = null;
		}

		if (_.isFunction(options.onloadend)) {
			this.onModalLoadEnd = options.onloadend;
		} else {
			this.onModalLoadEnd = null;
		}

		if (_.isFunction(options.onresize)) {
			this.onresize = options.onresize;
		} else {
			this.onresize = null;
		}

		if (_.isFunction(options.onclose)) {
			this.onclose = options.onclose;
		} else {
			this.onclose = null;
		}
	},

	clicked: function(e) {
		if (this.backdropClose && e.target.className === 'cui4-modal__backdrop') {
			this.close();
		}
	},

	listenkeys: function(ev) {
		const isFancyboxOpen = !!$('.fancybox-overlay').length;

		if (ev.keyCode === KEY.escape && !isFancyboxOpen) {
			this.close();
		}
	},

	isFollowupModalDisabledForDealPipeline: async function(dealId, followupDisabledPipelines) {
		if (!followupDisabledPipelines) {
			return false;
		}

		try {
			const deal = new Deal({ id: dealId });
			const dealData = await deal.pull();
			// eslint-disable-next-line camelcase
			const pipelineId = dealData?.data?.pipeline_id;
			const disabledPipelines = followupDisabledPipelines.split(',').map((i) => i.trim());

			if (dealData?.error) {
				logger.error('Failed to fetch deal data', { dealId });
			}

			if (disabledPipelines.includes(String(pipelineId))) {
				return true;
			}
		} catch (err) {
			logger.error('Failed to check if follow-up modal is disabled', {
				message: err.message
			});
		}

		return false;
	},

	show: async function(contentId, params = {}, onClose = null, onAfterClose = null) {
		if (contentId === 'close') {
			return this.close();
		}

		PDMetrics.addPageAction('ModalOpen', {
			route: contentId
		});

		const loadFailure = () => {
			onClose && onClose();
			onAfterClose && onAfterClose();
		};

		const isAddDealPersonOrganizationModal =
			contentId.startsWith('deal/add') ||
			contentId.startsWith('organization/add') ||
			contentId.startsWith('person/add');

		if (isAddDealPersonOrganizationModal) {
			return import(/* webpackChunkName: "modal-[request]" */ 'views/modals/add-modals')
				.then(({ default: NewAddModalView }) => {
					const view = new NewAddModalView(contentId, {
						...params,
						onClose,
						onAfterClose
					});

					this.onClose = () => view.close();

					return view;
				})
				.catch((err) => {
					logger.warn(`Could not open Add ${params.modalType} modal`, err);

					loadFailure();
				});
		}

		if (params.next) {
			const followupDisabledPipelines = User.settings.get(
				'followup_activity_disabled_pipelines'
			);

			if (followupDisabledPipelines.includes('*')) {
				return;
			}

			if (
				await this.isFollowupModalDisabledForDealPipeline(
					params.deal,
					followupDisabledPipelines
				)
			) {
				return;
			}
		}

		if (shouldUseActivityModal(contentId)) {
			const onMounted = (elementToObserve) => {
				closeFlowCoachmark('closedeals_activity_add');
				addFlowCoachmark('closedeals_activity_fill', elementToObserve);
			};

			const onSave = () => {
				closeFlowCoachmark('closedeals_activity_fill');
			};

			return import(/* webpackChunkName: "modal-[request]" */ 'views/modals/activity-v2')
				.then(({ default: NewActivityModalView }) => {
					const view = new NewActivityModalView({
						...params,
						onClose,
						onAfterClose,
						onMounted,
						onSave
					});

					this.onClose = () => view.close();

					return view;
				})
				.catch((err) => {
					logger.warn('Could not open Modal', err);

					loadFailure();
				});
		}

		this.onClose = onClose;

		import(/* webpackChunkName: "modal-[request]" */ `views/modals/${contentId}`)
			.then(({ default: ModalView }) => {
				const view = new ModalView({
					dialog: this,
					params
				});

				this.renderView(view);
			})
			.catch((err) => {
				logger.warn('Could not open Modal', err);

				loadFailure();
			});
	},

	renderView: function(view) {
		this.delegateEvents();
		this.render(view);
		this.open();
	},

	setTitle: function(title) {
		this.$('.dialogTitle').text(title);
	},

	open: function() {
		if (!this.isOpen) {
			this.onWindow('keyup.dialog', _.bind(this.listenkeys, this));

			this.isOpen = true;
		}

		app.global.fire('ui.modal.dialog.open');

		if (_.isFunction(this.onModalLoad)) {
			this.onModalLoad.call(this);
		}

		this.$el.addClass('cui4-modal--visible');

		/**
		 * Call modal load end when modal animation is finished.
		 * Currently keep the timeout at 150ms as defined in CSS but this should be improved.
		 */
		if (_.isFunction(this.onModalLoadEnd)) {
			this.setTimeout(() => {
				this.onModalLoadEnd.call(this);
			}, 150);
		}
	},

	close: function() {
		if (this.onClose) {
			return this.onClose();
		}

		if (this.isOpen) {
			this.offWindow('keyup.dialog');
			this.$('.cui4-modal__content').off('scroll.modal');
			this.$el.removeClass('cui4-modal--visible');
			this.isOpen = false;

			app.global.fire('ui.modal.dialog.close');

			if (_.isFunction(this.onclose)) {
				this.onclose.call(this);
			}

			this.remove();
		}
	},

	closeWithTransition: function(onAfterClose) {
		const callback = (event) => {
			if (event.originalEvent.propertyName === 'opacity' && event.target === this.el) {
				this.onClose = null;
				this.close();
				onAfterClose();
				this.$el.off('transitionend', callback);
			}
		};

		this.$el.on('transitionend', callback);

		this.$el.removeClass('cui4-modal--visible');
	},

	hideBody: function() {
		this.$('.cui4-modal__content').css({
			'max-height': 0,
			'min-height': 0,
			'visibility': 'hidden',
			'transition': 'all 0.3s visibility 0s',
			'border-top-color': Colors['$color-white-hex'],
			'border-top-style': 'solid',
			'border-top-width': '1px'
		});
	},

	showBody: function() {
		const bodyHeight =
			$(window).innerHeight() -
			(this.$dialog.outerHeight() - this.$('.cui4-modal__content').outerHeight());

		this.$('.cui4-modal__content').css({
			'max-height': bodyHeight,
			'min-height': 'auto',
			'visibility': 'visible',
			'transition': 'all 0.3s visibility 0s linear 0.3s',
			'border-top-color': 'transparent',
			'border-top-style': 'none',
			'border-top-width': '1px'
		});
	},

	showSpinner: function() {
		const $indicator = this.$('.activityIndicator');

		if (!$indicator.length || $indicator.find('.spinner').length) {
			return;
		}

		let css = {};

		const $button = this.$(
			this.primaryButtonSelector ||
				'.cui4-modal__footer .cui4-button--green, .cui4-modal__footer .cui4-button--red'
		);

		if ($button.length === 1 && $button.is(':visible')) {
			css = {
				width: $button.outerWidth(),
				height: $button.outerHeight(),
				display: 'block'
			};

			const classes = this.getSpinnerClasses($button);

			$indicator.attr('class', classes).css(css);
		} else if ($button.length > 1 && $button.is(':visible')) {
			css = {
				display: 'inline-block'
			};

			$indicator.addClass('inline').css(css);
		}

		$indicator.show();
	},

	getSpinnerClasses: function($button) {
		let classes = 'activityIndicator';

		if ($button.hasClass('cui4-button--green')) {
			classes += ' primary';
		} else if ($button.hasClass('cui4-button--red')) {
			classes += ' danger';
		}

		if ($button.attr('disabled')) {
			classes += ' disabled';
		}

		return classes;
	},

	hideSpinner: function() {
		this.$('.activityIndicator').hide();
	},

	remove: function() {
		this.onClose = null;

		Pipedrive.View.prototype.remove.call(this);
	}
});

module.exports = new Modal();
