const User = require('models/user');
const _ = require('lodash');
const Pipedrive = require('pipedrive');
const Stages = require('collections/pipeline/stages');
const plainStages = require('./plain-stages');
const selectField = require('./select');
const createLoadCallback = require('../create-load-callback');
const template = require('../template');
const $ = require('jquery');

function render(options) {
	$(`#${options.uuid} .stages`).html(
		plainStages({
			pipeline_id: options.pipeline_id,
			value: options.value,
			parentUUID: options.uuid,
			showProbability: options.showProbabilityField,
			wrapClassName: 'stageOptionWrapper'
		})
	);
}

function getPipelineId(options) {
	// Additional check:  in case of deleted stage, take pipeline id of user selected pipeline or first pipeline
	if (!options.stage) {
		return User.settings.get('current_pipeline_id') || options.pipelineList[0].id;
	}

	return options.stage.get('pipeline_id');
}

function ready(options) {
	return new Pipedrive.Ready(['stages', 'loadCallback'], () => {
		options.pipelineList = User.getPipelines();
		options.stage = Stages.getStageById(options.value);
		options.pipeline_id = getPipelineId(options);

		_.forEach(options.pipelineList, (pipeline, i) => {
			if (pipeline.id === options.pipeline_id) {
				options.pipelineList[i].selected = true;
			}
		});

		if (options.pipelineList.length > 1) {
			$(`#${options.uuid} .pipelines`).html(
				selectField({
					key: 'pipeline_id',
					options: options.pipelineList,
					withLabel: true,
					inlineLabel: false,
					label: _.gettext('Pipeline')
				})
			);

			$(`#${options.uuid} select`).on('change', function() {
				options.pipeline_id = $(this).val();
				render(options);
			});
		}

		render(options);
	});
}

/**
 * Create stage select with pipeline select option formitem
 * @example _.form.stage({key: 'stage_id', value: this.model.get('stage_id')});
 * @param  {Object} opts
 * @param {String} opts.value Value for displaying data (stage_id)
 * @param {String} opts.key Field key name (stage_id)
 * @return {String} Returns html
 */
function stageField(opts) {
	if (opts.hideSelectPipeline) {
		return plainStages(
			_.assignIn(opts, {
				wrapClassName: 'stageOptionWrapper'
			})
		);
	}

	const options = _.assignIn(
		{
			uuid: `stage-${_.makeid()}`,
			loadCallback: `async_${_.makeid()}`,
			field_type: 'stage'
		},
		opts
	);

	options.ready = ready(options);

	Stages.ready(() => {
		options.ready.set('stages');
	});

	createLoadCallback(options.loadCallback, () => {
		options.ready.set('loadCallback');
	});

	return template({ input: options });
}

module.exports = stageField;
