const Pipedrive = require('pipedrive');
const iamClient = require('utils/support/iam');
const moment = require('moment');
const _ = require('lodash');
const $ = require('jquery');

// The dropmenu being currently open
let openDropMenu = null;

const DropMenu = Pipedrive.View.extend({
	config: null,
	isVisible: false,
	tagName: 'div',
	initialize(config) {
		/**
            Sample config

            config = {
                target: target,
                isVisible: (true|false),
                data: [
                    { href: 'www.example.com', title: 'Example.com' },
                    { href: 'www.123.test', title: '123 Test' },
                    { href: false, title: '---' },
                    { href: 'www.w3schools.com', title: 'w3 schools' }
                ],
                // Useful when some action needed before letting the dropmenu open.
                onOpen: someCallback
            }
         */

		this.config = config;

		this.checkForErrors(config);

		if (_.isTouch()) {
			this.config.target.on('touchstart.dropMenu', _.bind(this.onDropMenuClick, this));
		}

		this.assignMouseEvents();

		if (_.isString(this.config.defaultValue)) {
			this.config.target.text(this.config.defaultValue);
		}

		if (config.isVisible) {
			this.render();
		}

		if (config.readyDom) {
			this.renderContent();
		}

		this.assignCloseHandlers();
	},

	assignMouseEvents() {
		this.config.target.on('click.dropmenu', _.bind(this.onDropMenuClick, this));

		this.config.target.on('dblclick.dropMenu', (ev) => {
			ev.preventDefault();
			ev.stopPropagation();
		});
	},

	assignCloseHandlers() {
		this.onDocument('click.dropMenu, scroll.dropMenu', _.bind(this.close, this));

		this.onDocument('keyup.dropMenu', (ev) => {
			if (ev.keyCode === Pipedrive.common.keyCodes().escape) {
				this.close();
			}
		});

		this.onWindow('resize.dropMenu', _.bind(this.close, this));
	},

	isConfigTarget(config) {
		return _.isUndefined(config.target) || !$(config.target).length;
	},

	checkForErrors(config) {
		if (!_.isObject(config)) {
			throw new Error('DropMenu: configuration is not an object');
		}

		if (this.isConfigTarget(config)) {
			throw new Error(`DropMenu: cannot find target. Target: ${config.target}`);
		}

		if (config.target.data('hasDropMenu') === true) {
			throw new Error('DropMenu: target already has drop menu attached');
		}

		if (_.isUndefined(config.getContentOnOpen)) {
			config.getContentOnOpen = false;
		}

		if (!_.isArray(config.data) && _.isUndefined(config.html) && !config.getContentOnOpen) {
			throw new Error('DropMenu: config is not set or has wrong format');
		}
	},

	render(override) {
		let dropMenuClass = 'dropMenu';

		if (this.config.activeOnClick === true || this.config.optionsDropMenu === true) {
			dropMenuClass = `${dropMenuClass}  optionsDropMenu`;
		}

		this.$el.addClass(dropMenuClass).appendTo('body');

		if (!this.config.getContentOnOpen || override) {
			this.renderContent(override);
		}

		this.open();

		const isFriday = moment().isoWeekday() === 5;

		if (isFriday) {
			this.showInsightsCoachMark();
		}
	},

	showInsightsCoachMark: function() {
		const parentEl = $('.statistics_insights');

		iamClient.addCoachmark(iamClient.coachmarks.INSIGHTS_FEATURE_COACHMARK, parentEl);
	},

	formMenuElementHTML(data) {
		const escapedTitle = data.titleHtml || _.escape(data.title);

		if (data.href) {
			let target = '';
			let icon = _.icon('sm-check', 'small', 'blue');

			if (data.hrefTarget) {
				target = ` target="${data.hrefTarget}"`;
			}

			if (data.icon) {
				icon = _.icon(data.icon, 'small', null);
			}

			return `<a href="${data.href}" ${target}>
					<span class="checkIcon">
						${icon}
					</span>
					${escapedTitle}
				</a>`;
		}

		return `<span class="action">${escapedTitle}</span>`;
	},

	isActiveIcon(data) {
		return (_.isBoolean(data.active) && data.active) || data.icon;
	},

	isClickFunction(data) {
		return data.click && _.isFunction(data.click);
	},

	formMenuElement(data) {
		const $li = $('<li></li>');

		if (data.title === '---') {
			$li.addClass('dropMenuSeparator');
		} else {
			const html = this.formMenuElementHTML(data);

			$li.html(html);
		}

		if (this.isActiveIcon(data)) {
			$li.addClass('active');
		}

		if (this.isClickFunction(data)) {
			$li.on('click.dropMenu', data.click);
		}

		if (!data.href && !data.click) {
			$li.addClass('disabled');
		}

		if (data.id) {
			$li.attr('data-id', data.id);
		}

		if (data.className) {
			$li.addClass(data.className);
		}

		return $li;
	},

	isInvalidData(i) {
		!this.config.data.hasOwnProperty(i) || !this.config.data[i];
	},

	isHasDropMenu(override) {
		this.config.target.data('hasDropMenu') === true && !override;
	},

	renderContent(override) {
		if (this.isHasDropMenu(override)) {
			return;
		}

		let $ul;

		if (_.isArray(this.config.data) && !_.isEmpty(this.config.data)) {
			$ul = $('<ul>');

			if (this.config.className) {
				$ul.addClass(this.config.className);
			}

			// eslint-disable-next-line no-unused-vars
			for (const i in this.config.data) {
				// Skip options with invalid data
				if (this.isInvalidData(i)) {
					continue;
				}

				const $li = this.formMenuElement(this.config.data[i]);

				$li.appendTo($ul);
			}
		} else if (this.config.html) {
			$ul = $($.trim(this.config.html));
		} else {
			throw new Error('DropMenu: data was not give as json nor html');
		}

		this.$el.html('').append($ul);
		this.config.target.data('hasDropMenu', true);

		this.renderAdditionalActions($ul);
	},

	calculateTopPosition(pos, css) {
		const targetOuterHeight = this.config.target.outerHeight();
		const elOuterHeight = this.$el.outerHeight();
		const windowHeight = $(window).height();

		let top = css.top;

		if (
			this.config.target.offset().top + targetOuterHeight + elOuterHeight > windowHeight ||
			this.config.alignTop
		) {
			if (pos.top - elOuterHeight < 0) {
				css.height = windowHeight - (pos.top + targetOuterHeight) - 10;
			} else {
				this.$el.addClass('top');
				this.placement.y = 'top';
				top = pos.top - elOuterHeight;
			}
		}

		return top;
	},

	calculateLeftPosition(pos, css) {
		const targetOuterWidth = this.config.target.outerWidth();
		const elOuterWidth = this.$el.outerWidth();

		let left = css.left;

		if (this.config.alignMiddle) {
			this.$el.addClass('middle');
			this.placement.x = 'middle';
			left = Math.max(pos.left + targetOuterWidth / 2 - elOuterWidth / 2, 0);
		} else if (
			this.config.target.offset().left + this.$el.width() > $(window).width() ||
			this.config.alignRight
		) {
			if (pos.left + targetOuterWidth > elOuterWidth) {
				this.$el.addClass('right');
			}

			this.placement.x = 'right';
			left = Math.max(pos.left + targetOuterWidth - elOuterWidth, 0);
		}

		return left;
	},

	calcSizeAndPos() {
		const targetOuterWidth = this.config.target.outerWidth();

		this.$el.removeClass('top right equal');

		this.placement = {
			y: 'bottom',
			x: 'left'
		};

		const pos = {
			left: Math.round($(this.config.target).offset().left),
			top: Math.round($(this.config.target).offset().top)
		};

		const css = {
			left: pos.left,
			top: pos.top + this.config.target.outerHeight(),
			height: 'auto'
		};

		if (targetOuterWidth >= this.$el.outerWidth()) {
			this.$el.addClass('equal');
			css['min-width'] = this.config.target.outerWidth();
		}

		css.left = this.calculateLeftPosition(pos, css);
		css.top = this.calculateTopPosition(pos, css);

		this.$el.css(css);
	},

	onDropMenuHover() {
		if (!this.config.target.hasClass('loader') && !this.isVisible) {
			this.render(this.config.overrideOnToggle);
		}
	},

	onDropMenuClick(ev) {
		ev.preventDefault();
		ev.stopPropagation();

		if (ev.shiftKey && _.isObject(this.config) && _.isFunction(this.config.onShiftClick)) {
			this.config.onShiftClick();
		} else {
			if (!this.config.target.hasClass('loader')) {
				this.toggle();
			}
		}
	},

	toggle() {
		if (this.isVisible) {
			this.close();
		} else {
			if (_.isFunction(this.config.onOpen)) {
				this.config.target.addClass('loader');
				this.config.onOpen(this, _.bind(this.onOpenCallback, this));
			} else {
				this.render(this.config.overrideOnToggle);
			}
		}
	},

	/**
	 * @param  {Boolean} preventRender 	A parent view can decide whether to prevent the dropmenu from opening
	 * @void
	 */
	onOpenCallback(preventRender) {
		this.config.target.removeClass('loader');

		if (!preventRender) {
			this.render(true);
		}
	},

	changeActive(ev) {
		const $target = $(ev.currentTarget);

		// eslint-disable-next-line
		// TODO: Figure out normal way of doing this. Maybe unite with activeOnClick or smth.
		if (
			_.isObject(this.config) &&
			_.isFunction(this.config.onClick) &&
			!this.config.onClick(ev, this)
		) {
			return;
		}

		if (this.config.activeOnClick) {
			this.$('li').removeClass('active');
			$target.parents('li').addClass('active');
			this.setEditUrl();
		}
	},

	setEditUrl() {
		const $li = this.$('li.edit-filter');
		const $a = $li.find('a');
		const $target = this.$('li.active');
		const $targetLink = $target.find('a');
		const filter = (_.isObject($target.data()) && $target.data('filter')) || '';

		if (filter.match(/filter/)) {
			$li.attr('data-filter', filter);
			$a.attr('href', `${$targetLink.attr('href')}/edit`);
			$li.show();
		} else {
			$li.hide();
		}
	},

	scrollToActive() {
		const $active = this.$el.find('li.active');

		if ($active.length < 1) {
			return;
		}

		const positionTop = $active.position().top;
		const height = this.$el.height();
		const scroll = positionTop - height / 2 + $active.height() / 2;

		this.$el.scrollTop(scroll);
	},

	open() {
		if (openDropMenu) {
			openDropMenu.close();
		}

		if (this.config.ui) {
			this.$el.addClass(this.config.ui);
		}

		this.isVisible = true;
		openDropMenu = this; // eslint-disable-line

		this.$('a').on('click.dropMenu', _.bind(this.changeActive, this));

		this.setTimeout(() => {
			this.$el.height('auto');
			this.calcSizeAndPos();
			this.$el.addClass('dropMenuVisible');

			// If popover is triggered from within the modal, raise z-index
			if (this.config.target && $(this.config.target).closest('#modal').length) {
				this.$el.attr('data-modal', true);
			} else {
				this.$el.attr('data-modal', null);
			}

			this.adjustDropmenuClasses();

			if (!this.config.dontAddActiveClass) {
				this.config.target.addClass('active');
			}

			if (this.config.activeItemMiddle !== false) {
				this.scrollToActive();
			}
		}, 1);

		this.setEditUrl();

		this.focus();
	},

	adjustDropmenuClasses() {
		this.config.target
			.removeClass(
				'dropMenu-attached-left dropMenu-attached-right dropMenu-attached-bottom dropMenu-attached-top'
			)
			.addClass(`dropMenu-attached-${this.placement.x} dropMenu-attached-${this.placement.y}`)
			.trigger('dropMenuOpen');
	},

	close(ev) {
		if (ev && $(ev.target).parent('.disabled').length) {
			return;
		}

		this.$('a').off('click.dropMenu');
		// eslint-disable-next-line
		this.config.target.removeClass(
			'dropMenu-attached-left dropMenu-attached-right dropMenu-attached-bottom dropMenu-attached-top'
		);

		if (this.config.ui) {
			this.$el.removeClass(this.config.ui);
		}

		this.isVisible = false;
		openDropMenu = null;
		this.$el.removeClass('dropMenuVisible').detach();

		if (!this.config.dontAddActiveClass) {
			this.config.target.removeClass('active');
		}

		this.config.target.trigger('dropMenuClose');

		if (_.isFunction(this.config.onClose)) {
			this.config.onClose(this);
		}

		this.blur();
	},

	unbind() {
		this.config.target.off('click.dropMenu');
		this.config.target.off('dblclick.dropMenu');
		this.config.target.off('mouseenter');
	},

	clear() {
		this.config.target.data('hasDropMenu', false);
		this.$el.html('');
		this.$el.remove();
		this.remove();
	},

	renderAdditionalActions($listElement) {
		if (!this.config.additionalActionsView) {
			return false;
		}

		$listElement.append(
			$('<ul/>', {
				class: 'additionalActions'
			})
		);

		this.addView({
			'.additionalActions': this.config.additionalActionsView
		});
	}
});

module.exports = DropMenu;
