const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const MiniPipelineTemplate = require('templates/shared/minipipeline.html');
const StagesCollection = require('collections/pipeline/stages');
const moment = require('moment');
const iamClient = require('utils/support/iam');
const $ = require('jquery');
const componentLoader = require('webapp-component-loader');
// in px
const MIN_LABEL_UNTIL = 35;
const SHORT_LABEL_UNTIL = 90;
const labelSizes = {
	FULL: 'full',
	SHORT: 'short',
	MIN: 'min'
};

module.exports = Pipedrive.View.extend({
	template: _.template(MiniPipelineTemplate),

	saving: null,

	initialize: function(options) {
		if (!options || !options.dealModel) {
			throw new Error('Wrong constructor options');
		}

		this.labelSize = labelSizes.FULL;
		this.companyHasExpectedCloseDate = !!User.fields.getByKey('deal', 'expected_close_date');
		this.saving = false;
		this.options = options;
		this.dealModel = options.dealModel;
		this.onWindow('resize.miniPipelineWrapper', _.bind(this.onResize, this));
	},

	isDealProbabilityTurnedOn: function(getName) {
		const self = this;
		const pipeline = User.pipelines.models.find(function(model) {
			return model.id === self.dealModel.get('pipeline_id');
		});

		if (getName) {
			return pipeline ? pipeline.get('name') : '';
		}

		return pipeline ? pipeline.get('deal_probability') : false;
	},

	onLoad: function() {
		this.dealModel.onChange(
			'pipeline_id stage_id status expected_close_date probability',
			this.render,
			this
		);
		this.ready = Pipedrive.Ready(['stages'], _.bind(this.render, this));
		StagesCollection.ready(_.bind(this.onStagesReady, this));
	},

	onStagesReady: function() {
		const stageId = this.dealModel.get('stage_id');

		this.stages = StagesCollection.getPipelineStagesByStageId(stageId);
		this.currentStage = _.find(this.stages, { id: stageId });
		this.pipelineIds = StagesCollection.getPipelineIds();
		this.ready.set('stages');
		this.onResize();
	},

	onAttachedToDOM: function() {
		this.onResize();
	},

	onResize: function() {
		// render again ONLY when labels size change
		const newLabelSize = this.calcLabelSize();

		if (this.labelSize !== newLabelSize) {
			this.labelSize = newLabelSize;
			this.render();
		}
	},

	calcLabelSize: function() {
		const width = this.el.offsetWidth / ((this.stages && this.stages.length) || 1);

		let size = labelSizes.FULL;

		if (width < MIN_LABEL_UNTIL) {
			size = labelSizes.MIN;
		} else if (width < SHORT_LABEL_UNTIL) {
			size = labelSizes.SHORT;
		}

		return size;
	},

	updateData: function() {
		this.stages = StagesCollection.getPipelineStagesByStageId(this.dealModel.get('stage_id'));

		this.currentStage = _.find(this.stages, { id: this.dealModel.get('stage_id') });

		this.expectedCloseDate = null;

		if (
			this.companyHasExpectedCloseDate &&
			!_.isEmpty(this.dealModel.get('expected_close_date'))
		) {
			const d = moment(this.dealModel.get('expected_close_date'), 'YYYY-MM-DD');

			if (d.isValid()) {
				this.expectedCloseDate = d.format('LL');
			}
		}

		this.dealProbability = this.dealModel.get('probability');

		this.daysInStage = this.dealModel.daysInStage(this.stages);

		this.expectedDateOverdue = this.getClosedDateOrNow().diff(
			moment(this.dealModel.get('expected_close_date'), 'YYYY-MM-DD'),
			'days'
		);
	},

	getClosedDateOrNow: function() {
		if (!_.isEmpty(this.dealModel.get('close_time'))) {
			return moment(this.dealModel.get('close_time'), 'YYYY-MM-DD');
		}

		return moment();
	},

	getStages: function() {
		const returnObj = [];

		let green = true;

		const self = this;

		_.forEach(this.daysInStage, function(stage) {
			returnObj.push(self.getStageData(stage, green));

			green = green && !self.isCurrentStage(stage);
		});

		return returnObj;
	},

	getStageData: function(stage, green) {
		const autoProgressWonDeals = User.companyFeatures.get('automatically_progress_won_deals');
		const progressDeal = green || (autoProgressWonDeals && this.isDealWon());
		const isCurrentStage = this.isCurrentStage(stage);
		const className = progressDeal ? this.getClassName(stage) : '';
		const showStageTime = stage.time > 0 || isCurrentStage || progressDeal;
		const stageLabel = this.getLabel(stage.days || 0);
		const stageName = showStageTime ? stageLabel : '';

		return {
			id: stage.id,
			isCurrentStage,
			className,
			stageName
		};
	},

	isCurrentStage: function(stage) {
		return stage.id === this.currentStage.id;
	},

	isDealWon: function() {
		return this.dealModel.get('status') === 'won';
	},

	getClassName: function(stage) {
		return `active${stage.id === this.dealModel.get('stage_id') ? ' last' : ''}`;
	},

	getLabel: function(days) {
		if (this.labelSize === labelSizes.FULL) {
			return _.ngettext('%d day', '%d days', days, days);
		} else if (this.labelSize === labelSizes.SHORT) {
			return _.gettext('%sd', days);
		} else {
			return _.gettext('%s', days);
		}
	},

	templateHelpers: function() {
		const defaultShowAttributes = {
			stageName: true,
			expectedCloseDate: true,
			pipelineName: true,
			dealProbability: true
		};

		this.updateData();

		return {
			pipelineName: this.isDealProbabilityTurnedOn(true),
			dealModel: this.dealModel,
			saving: this.saving,
			stages: this.getStages(),
			companyHasExpectedCloseDate: this.companyHasExpectedCloseDate,
			pipelineHasDealProbability: this.isDealProbabilityTurnedOn(),
			showAttributes: _.assignIn(
				_.clone(defaultShowAttributes),
				this.options.showAttributes || {}
			),
			pipelineIds: this.pipelineIds,
			currentStage: this.currentStage,
			expectedCloseDate: this.expectedCloseDate,
			dealProbability: this.dealProbability
		};
	},

	afterRender: function() {
		if (!this.ready.isReady()) {
			return;
		}

		this.onResize();
		this.showTooltips();

		if (this.saving) {
			this.$('.stageSpinner').show();
		}

		// ui events
		this.$('.pipelineStages li').on('click.pipelineStages', _.bind(this.changeStage, this));
		this.$('.pipelineInfo, .choosePipeline').on(
			'click.choosePipelineStage',
			_.bind(this.choosePipelineStage, this)
		);
		this.$('.expectedCloseDateWrapper').on(
			'click.chooseExpectedCloseDate',
			_.bind(this.chooseExpectedCloseDate, this)
		);
		this.$('.dealProbabilityWrapper').on(
			'click.setDealProbability',
			_.bind(this.setDealProbability, this)
		);

		this.focus();
		this.addDealProbabilityCoachmark();
	},

	addDealProbabilityCoachmark: function() {
		const coachmarkPlaceholder = this.$('.dealProbabilityWrapper');

		if (coachmarkPlaceholder) {
			iamClient.addCoachmark(iamClient.coachmarks.ADD_DEAL_PROBABILITY_DETAILVIEW_COUCHMARK, {
				coachmarkPlaceholder
			});
		}
	},

	getStageTooltipHtml: function(stageId) {
		const stage = _.find(this.daysInStage, { id: 1 * stageId });
		const isCurrentStage = stageId === this.dealModel.get('stage_id');

		let html = `<div class="title">${_.escape(stage.name)}</div>`;

		if (!stage.time && !isCurrentStage) {
			html += _.gettext('This deal has not been in this stage yet');
		} else if (stage.days) {
			html += _.gettext('Been here for %s days', stage.days);
		} else {
			// less than day
			const time = moment
				.duration(stage.time, 'seconds')
				.locale('en')
				.humanize();

			html += this.getStageTooltipTimeTextForComplexTranslations(time);
		}

		return html;
	},

	getStageTooltipTimeTextForComplexTranslations: function(time) {
		const firstWord = time.substr(0, time.indexOf(' '));
		const restOfString = time.substr(time.indexOf(' ') + 1);

		let timeText = _.gettext('Been here for %s', [time]);

		if (Number(firstWord)) {
			if (restOfString === 'hours') {
				timeText = _.gettext('Been here for %s hours', [firstWord]);
			} else if (restOfString === 'minutes') {
				timeText = _.gettext('Been here for %s minutes', [firstWord]);
			}
		}

		return timeText;
	},

	getExpectedDateTooltip: function() {
		let html = `<p>${_.gettext('Expected close date')}</p>`;

		if (this.expectedDateOverdue > 0) {
			const overdueText = _.gettext(
				_.ngettext('Overdue %d day', 'Overdue %d days', this.expectedDateOverdue),
				this.expectedDateOverdue
			);

			html += `<p>${overdueText}</p>`;
		}

		return html;
	},

	showTooltips: function() {
		const self = this;
		const expectedDateField = this.$('.expectedCloseDateWrapper');

		this.$('.pipelineStages ul > li').each(function() {
			$(this).tooltip({
				tipHtml: self.getStageTooltipHtml(this.getAttribute('data-stage-id')),
				preDelay: 200,
				postDelay: 200,
				zIndex: 20000,
				fadeOutSpeed: 100,
				position: 'bottom'
			});
		});

		if (expectedDateField.length) {
			expectedDateField.tooltip({
				tipHtml: self.getExpectedDateTooltip(),
				preDelay: 200,
				postDelay: 200,
				zIndex: 20000,
				fadeOutSpeed: 100,
				position: 'top'
			});
		}
	},

	/*
	 * Change deal stage
	 */
	changeStage: function(ev) {
		// check if already saving
		if (this.saving) {
			return;
		}

		const stageId = $(ev.currentTarget).data('stage-id');

		// check if already in same stage
		if (stageId === this.dealModel.get('stage_id')) {
			return;
		}

		this.saving = true;

		this.dealModel.saveIfRequiredFieldsPopulated(
			{ stage_id: stageId },
			{ stage_id: stageId },
			{
				optimistic: true,
				success: _.bind(this.onSaveResponse, this),
				cancel: _.bind(this.onSaveResponse, this),
				error: _.bind(this.onSaveResponse, this)
			}
		);
		this.render();
	},

	onSaveResponse: function() {
		this.saving = false;
		this.render();
	},

	choosePipelineStage: async function(ev) {
		ev.preventDefault();
		const popover = await componentLoader.load('webapp:popover');

		popover.open({
			popover: 'changefieldvalue',
			params: {
				model: this.dealModel,
				fieldKey: 'stage_id',
				position: 'bottom-start',
				target: ev.delegateTarget,
				pipelineDealProbability: false,
				onClose: _.bind(this.setDealProbabilityToNull, this)
			}
		});
	},

	chooseExpectedCloseDate: async function(ev) {
		ev.preventDefault();

		const popover = await componentLoader.load('webapp:popover');

		popover.open({
			popover: 'changefieldvalue',
			params: {
				model: this.dealModel,
				fieldKey: 'expected_close_date',
				position: 'bottom-end',
				target: ev.delegateTarget
			}
		});
	},

	setDealProbabilityToNull: function() {
		if (!this.isDealProbabilityTurnedOn() && this.dealModel.get('probability')) {
			this.dealModel.set('probability', null);
			this.dealModel.save();
		}
	},

	setDealProbability: async function(ev) {
		ev.preventDefault();

		const coachmark = this.$('.dealProbabilityWrapper').find('.iamClient__Coachmark');

		if (coachmark.length) {
			coachmark.remove();
		}

		const popover = await componentLoader.load('webapp:popover');

		popover.open({
			popover: 'changefieldvalue',
			params: {
				model: this.dealModel,
				title: _.gettext('Set deal probability'),
				fieldKey: 'probability',
				position: 'bottom-end',
				target: ev.delegateTarget
			}
		});
	},

	onUnload: function() {
		this.$('.pipelineStages li').off('pipelineStages');
		this.$('.pipelineInfo, .choosePipeline').off('click.choosePipelineStage');
		this.$('.expectedCloseDateWrapper').off('click.chooseExpectedCloseDate');
		this.$('.dealProbabilityWrapper .value').off('click.setDealProbability');

		if (this.dealModel) {
			this.dealModel.off('change:stage_id', this.render, this);
		}
	}
});
