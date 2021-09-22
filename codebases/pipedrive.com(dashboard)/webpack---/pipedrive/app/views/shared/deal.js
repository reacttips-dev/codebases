const _ = require('lodash');
const Pipedrive = require('pipedrive');
const DealTemplate = require('templates/shared/deal.html');
const DealProbabilityUtils = require('utils/deal-probability');
const DD = require('views/ui/drag-and-drop');
const Company = require('collections/company');
const moment = require('moment');
const $ = require('jquery');
const componentLoader = require('webapp-component-loader');

const diffDeal = function(oldObj, newObj) {
	const n = newObj.toJSON();
	const o = oldObj.toJSON();
	const extraKeys = _.difference(_.keys(n), _.keys(o));

	_.forEach(extraKeys, (key) => {
		delete n[key];
	});

	const newData = _.assignIn({}, o, n);
	const diff = {};

	_.forEach(newData, (val, key) => {
		if (o[key] !== val) {
			diff[key] = val;
		}
	});

	return diff;
};

module.exports = Pipedrive.View.extend({
	menu: false,
	template: _.template(DealTemplate),
	tagName: 'li',
	className: 'dealTile',
	draggable: true,
	flipAllowed: true,
	showDropmenu: true,

	initialize: function(config) {
		if (!this.model) {
			return;
		}

		this.model.view = this;

		app.global.bind(`deal.model.${this.model.get('id')}.remove`, this.killMe, this);
		app.global.bind(`deal.model.${this.model.get('id')}.delete`, this.killMe, this);
		app.global.bind(`deal.model.${this.model.get('id')}.destroy`, this.killMe, this);

		if (this.model.collection) {
			this.model.collection.on('remove', this.filterKillMe, this);
			this.model.collection.on('reset', this.killMe, this);
		} else {
			this.killMe();

			return;
		}

		this.model.on('change', this.updateMe, this);

		if (_.isFunction(this.onInitialize)) {
			this.onInitialize(config);
		}

		this.$el.addClass('cui4-panel--elevation-01');
		this.profile = config.profile;
		this.container = config.container;
		this.$container = $(this.container);
		this.pipelineDealProbability = config.pipeline
			? config.pipeline.get('deal_probability')
			: 0;

		this.setActivityReminder();
		this.render();
		this.$el.attr('data-deal-id', this.model.id);
		this.onWindow('resize.deal', _.bind(this.removeLabels, this));
	},

	render: function(positionInStage) {
		if (_.isFunction(this.onRender)) {
			this.onRender(positionInStage);
		}

		/* HACK TO SHOW DEAL AFTER DRAGEND IN OPERA */
		if (_.browser('opera')) {
			this.$el.removeClass('dragging hideOriginal');
		}

		this.addDragging();

		if (this.menu) {
			if (_.isFunction(this.menu.clear)) {
				this.menu.clear();
			}

			this.menu = false;
		}

		this.$el.addClass(`status-${this.model.get('status')}`);

		if (this.model.get('status') === 'lost') {
			$(this.el)
				.find('.status')
				.attr('data-status-badge', _.gettext('Lost'));
		} else if (this.model.get('status') === 'won') {
			$(this.el)
				.find('.status')
				.attr('data-status-badge', _.gettext('Won'));
		}

		if (this.showDropmenu) {
			this.initializeDropMenu();
		}

		this.focus();
	},

	initializeDropMenu: function() {
		this.$('.icon').on(
			'click.dealActivities',
			_.bind(function(ev) {
				ev.preventDefault();
				this.displayActivitiesPopover(ev.currentTarget);
			}, this)
		);
	},

	displayActivitiesPopover: async function(target) {
		const $target = $(target);

		// When view is removed from pipeline but is still in memory, we shouldn't show the tooltip
		if ($target.is(':not(:visible)')) {
			return;
		}

		const popoverOptions = {
			model: this.model,
			position: 'bottom-start',
			target,
			closeManually: false,
			offset: 14,
			popperOptions: {
				preventOverflow: {
					boundariesElement: 'viewport'
				},
				flip: {
					padding: 0
				}
			}
		};

		const popover = await componentLoader.load('webapp:popover');

		popover.open({
			popover: 'deal/activities',
			params: {
				...popoverOptions
			}
		});
	},

	showTrashArea: function(draggable) {
		if (draggable.$el.hasClass('deleted')) {
			this.setTimeout(() => {
				$('#dealActions [data-action-status="deleted"]').show();
			}, 750);
		}
	},

	hideTrashArea: function(draggable) {
		if (draggable.$el.hasClass('deleted')) {
			$('#dealActions [data-action-status="deleted"]').hide();
		}
	},

	addDragging: function() {
		if (!this.draggable || this.hasDragging) {
			return;
		}

		const self = this;

		const bgColor = this.$('.front').css('backgroundColor');

		new DD.drag({
			el: self.el,
			type: 'deal',
			model: self.model,
			dragStart: function(ev, draggable) {
				self.hideTrashArea(draggable);

				draggable.css = {
					width: self.$el.outerWidth(),
					backgroundColor: bgColor
				};

				if (self.menu) {
					self.menu.close();
				}

				self.$el.addClass('dragging dragStart');
				app.global.fire(`deal.drag.${draggable.model.get('id')}.start`, {
					event: ev,
					draggable
				});
				self.setTimeout(() => {
					if (self.$el.is(':last-child')) {
						self.$el.css('display', 'none');
					} else {
						self.$el.addClass('hideOriginal');
					}
				}, 10);
			},
			dragEnd: function(ev, draggable) {
				app.global.fire(`deal.drag.${draggable.model.get('id')}.end`, {
					event: ev,
					draggable
				});

				self.$el.removeClass('dragging hideOriginal');
				self.$el.css({
					display: 'block'
				});

				self.showTrashArea(draggable);
			},
			dragDrop: function() {
				self.$el.removeClass('dragging hideOriginal');
				self.$el.css({
					display: 'block'
				});
			},
			touchStart: function(ev, draggable) {
				self.hideTrashArea(draggable);

				draggable.css = {
					width: self.$el.outerWidth(),
					backgroundColor: bgColor
				};

				if (self.menu) {
					self.menu.close();
				}

				self.model.collection.trigger('pickup', self.model);
				app.global.fire(`deal.drag.${draggable.model.get('id')}.start`, {
					event: ev,
					draggable
				});
			},
			touchEnd: function(ev, draggable) {
				app.global.fire(`deal.drag.${draggable.model.get('id')}.end`, {
					event: ev,
					draggable
				});

				self.showTrashArea(draggable);
			}
		});

		this.hasDragging = true;
	},

	isDeleted: function() {
		return this.model.get('status') === 'deleted';
	},

	setActivityReminder: function() {
		this.$el.removeClass('overdue today future warning');
		const noUndoneActivities =
			_.isNull(this.model.get('undone_activities_count')) ||
			this.model.get('undone_activities_count') === 0;

		if (
			(noUndoneActivities || _.isEmpty(this.model.get('next_activity_date'))) &&
			!this.isDeleted()
		) {
			this.$el.addClass('warning');
		} else {
			let _d;

			if (_.isEmpty(this.model.get('next_activity_time'))) {
				// No utc conversion needed when only date is specified
				_d = moment(this.model.get('next_activity_date'), 'YYYY-MM-DD').endOf('day');
				_d.noTime = true;
			} else {
				const datetime = `${this.model.get('next_activity_date')} ${this.model.get(
					'next_activity_time'
				)}`;

				_d = moment.utc(datetime, 'YYYY-MM-DD HH:mm').local();
				delete _d.noTime;
			}

			switch (this.getActivityState(_d)) {
				case 'past':
					this.$el.addClass('overdue');
					break;
				default:
					this.$el.addClass(this.getActivityState(_d));
					break;
			}
		}
	},

	getActivityState: function(activity) {
		if (!activity.isValid()) {
			return this.isDeleted() ? '' : 'warning';
		}

		const now = moment();
		const noTimeDefined = typeof activity.noTime !== 'undefined';
		const noTime = noTimeDefined && activity.noTime;
		const isToday = activity.isSame(now, 'day');
		const fullDayActivity = noTime && isToday;
		const upcomingActivity = activity.isAfter(now);
		const todaysUpcomingActivity = upcomingActivity && moment().isSame(activity, 'day');

		if (fullDayActivity || todaysUpcomingActivity) {
			return 'today';
		} else if (upcomingActivity) {
			return 'future';
		} else {
			return 'past';
		}
	},

	removeLabels: function() {
		const statusWidth = this.$el.find('.status').width();

		if (this.$el.width() < statusWidth * (statusWidth > 50 ? 3 : 4) + 30) {
			this.$el.find('.status').hide();
		} else {
			this.$el.find('.status').show();
		}
	},

	updateMe: function(deal) {
		this.owner = Company.getUserById(Number(deal.get('user_id')));
		this.profile = this.owner;

		const diff = diffDeal(this.model, deal);

		if (_.keys(diff).length) {
			this.model.set(diff);
		}

		if (_.isFunction(this.onUpdate)) {
			this.onUpdate();
		}
	},

	changeMe: function() {
		if (
			this.model.hasChanged('pipeline_id') &&
			this.model.get('pipeline_id') !== this.pipelineId
		) {
			return this.killMe();
		}

		if (_.isFunction(this.onChange)) {
			this.onChange();
		}

		this.setActivityReminder();

		if (
			this.model.hasChanged('stage_id') &&
			_.isObject(this.model.collection) &&
			_.isFunction(this.model.collection.getDealPositionInStage)
		) {
			this.render(this.model.collection.getDealPositionInStage(this.model));
		} else if (this.model.hasChanged()) {
			this.render();
		}
	},

	clearMe: function() {
		app.global.unbind(`deal.model.${this.model.get('id')}.update`, this.updateMe, this);
		app.global.unbind(`deal.model.${this.model.get('id')}.remove`, this.killMe, this);
		app.global.unbind(`deal.model.${this.model.get('id')}.delete`, this.killMe, this);
		app.global.unbind(`deal.model.${this.model.get('id')}.destroy`, this.killMe, this);

		this.model.off('change', this.updateMe, this);

		if (this.model.collection) {
			this.model.collection.off('remove', this.filterKillMe, this);
			this.model.collection.off('reset', this.killMe, this);
		}

		if (_.isFunction(this.onClear)) {
			this.onClear();
		}
	},

	filterKillMe: function(model) {
		if (model.cid === this.model.cid) {
			this.killMe();
		}
	},

	killMe: function() {
		this.clearMe();
		this.$el.remove();
		this.remove();
	},

	onUnload: function() {
		if (_.isFunction(this.onUnloadLocal)) {
			this.onUnloadLocal();
		}

		this.killMe();
	},

	attachWeightedValueTooltip: function(probability) {
		const tipContent = _.gettext('%1$s (%2$s)', [
			this.model.get('formatted_weighted_value'),
			`${probability}%`
		]);

		const icon = `<span class="weighted">${_.icon('sm-weighted', 'small', 'white')}</span>`;

		$(this.el)
			.find('.value')
			.each(function() {
				$(this).tooltip({
					tipHtml: `${icon} ${tipContent}`,
					preDelay: 800,
					postDelay: 100,
					zIndex: 20000,
					fadeOutSpeed: 100,
					position: 'bottom-start'
				});
			});
	},

	initializeDealProbabilityTooltip: function() {
		const pipelineId = this.model.get('pipeline_id');

		const pipelineDealProbabilityOn = DealProbabilityUtils.isDealProbabilityTurnedOn(
			pipelineId
		);

		const weightedValue = this.model.get('weighted_value');

		const value = this.model.get('value');

		if (
			pipelineDealProbabilityOn &&
			this.model.get('status') === 'open' &&
			weightedValue !== value
		) {
			let probability = this.model.get('probability');

			probability =
				probability && probability !== 100 ? probability : (weightedValue / value) * 100;
			this.attachWeightedValueTooltip(probability);
		}
	}
});
