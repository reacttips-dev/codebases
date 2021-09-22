const Pipedrive = require('pipedrive');
const _ = require('lodash');
const StageModel = require('models/stage');
const Stages = Pipedrive.Collection.extend({
	model: StageModel,
	url: `${app.config.api}/stages`,
	pendingCallbacks: [],
	done: false,

	initialize: function(stages) {
		if (_.isArray(stages)) {
			this.fetching = true;
			this.add(stages);
			this.onReady();
		}
	},

	parse: function(response) {
		return response.data;
	},

	ready: function(callback, errorCallback) {
		if (this.fetching) {
			this.pendingCallbacks.push({ callback, error: errorCallback });
		} else if (this.done) {
			return callback(this);
		} else {
			this.fetching = true;
			this.pendingCallbacks.push({ callback, error: errorCallback });
			this.pull({
				success: _.bind(this.onReady, this)
			});
		}
	},

	onReady: function(c) {
		this.fetching = false;
		this.done = true;

		if (this.pendingCallbacks.length) {
			for (let i = 0; i < this.pendingCallbacks.length; i++) {
				this.pendingCallbacks[i].callback(c);
			}
			this.pendingCallbacks = [];
		}
	},

	getPipelineIds: function() {
		return _.uniq(this.map('pipeline_id'));
	},

	getPipelineStagesByStageId: function(stageId) {
		let stage = this.where({ id: Number(stageId) });

		if (!stage.length) {
			return [];
		}

		stage = stage[0];

		return this.where({ pipeline_id: stage.get('pipeline_id') });
	},

	getStageById: function(id) {
		return this.get(id);
	},

	getPipelineStagesByPipelineId: function(pipelineId) {
		return this.where({ pipeline_id: Number(pipelineId) });
	},

	getProgressByStageId: function(stageId) {
		const stages = this.getPipelineStagesByStageId(stageId);

		let stagePos = 1;

		_.map(stages, (s, index) => {
			if (stageId === s.get('id')) {
				stagePos = index + 1;
			}
		});

		return Math.ceil((stagePos / stages.length) * 100);
	}
});

module.exports = new Stages();
