const Pipedrive = require('pipedrive');
const User = require('models/user');
const _ = require('lodash');
const Stages = require('collections/pipeline/stages');
const template = require('../template');
const dealProbabilityUtils = require('utils/deal-probability');
const createLoadCallback = require('../create-load-callback');
const $ = require('jquery');

function render(options) {
	const probabilityEl = $(`#${options.parentUUID} .probability`);

	probabilityEl.empty();
}

function ready(options) {
	return new Pipedrive.Ready(['stages', 'loadCallback'], () => {
		const opts = _.assignIn(options, {
			loadCallback: null,
			noWrap: true,
			withLabel: false
		});

		options.selectedStageId = Number(options.value);

		// Set pipeline id if not present
		if (!options.pipeline_id) {
			options.pipeline_id = getPipelineId(options);
		}

		options.stages = Stages.getPipelineStagesByPipelineId(options.pipeline_id);

		if (options.stages.length && !_.some(options.stages, { id: options.selectedStageId })) {
			options.selectedStageId = options.stages[0].id;
		}

		options.pipelineDealProbability = dealProbabilityUtils.isDealProbabilityTurnedOn(
			Number(options.pipeline_id)
		);
		options.currentStageDealProbability = getStageDealProbability(
			options.selectedStageId,
			options.stages
		);

		$(`#${options.uuid}`).replaceWith(template({ input: opts }));

		$(`#${options.uuid} .widget-radio`).each(function() {
			$(this).tooltip({
				tip: $(this)
					.find('input')
					.data('title'),
				preDelay: 200,
				postDelay: 200,
				zIndex: 20000,
				fadeOutSpeed: 200,
				position: 'bottom'
			});
		});

		$(`#${options.uuid} .widget-radio input`).on('click', function() {
			const currentStageId = Number($(this).val());

			options.currentStageDealProbability = getStageDealProbability(
				currentStageId,
				options.stages
			);
			render(options);
		});

		render(options);
	});
}

function getStageDealProbability(currentStageId, stages) {
	const stage = _.find(stages, (stage) => {
		return stage.id === currentStageId;
	});

	return stage ? stage.get('deal_probability') : false;
}

function getPipelineId(options) {
	const pipelineList = User.getPipelines();

	const stage = Stages.getStageById(options.selectedStageId);

	// Additional check:  in case of deleted stage, take pipeline id of first pipeline
	return stage ? stage.get('pipeline_id') : pipelineList[0].id;
}

/**
 * Create stage select formitem
 * @example _.form.plainStage({key: 'stage_id', value: this.model.get('stage_id')});
 * @param  {Object} opts
 * @param {String} opts.value Value for displaying data (stage_id)
 * @param {String} opts.key Field key name (stage_id)
 * @return {String} Returns html
 */
function plainStagesField(opts) {
	const options = _.assignIn(
		{
			uuid: `stage-${_.makeid()}`,
			loadCallback: `async_${_.makeid()}`,
			withLabel: true,
			inlineLabel: false,
			label: _.gettext('Pipeline stage')
		},
		opts
	);

	options.field_type = 'plainStages';
	options.ready = ready(options);

	Stages.ready(() => {
		options.ready.set('stages');
	});

	createLoadCallback(options.loadCallback, () => {
		options.ready.set('loadCallback');
	});

	return template({ input: options });
}

module.exports = plainStagesField;
