'use strict';

const Tutorial = require('views/shared/tutorial');
const _ = require('lodash');
const User = require('models/user');

module.exports = Tutorial.extend({
	initialize: function(opts) {
		if (!_.isObject(opts) || _.isUndefined(opts.target)) {
			return;
		}

		Tutorial.prototype.initialize.call(this, opts);

		this.userSettingName = opts.userSettingName;
		this.tutorialId = opts.tutorialId;
		this.currentStep = 0;

		User.getUser(_.bind(this.onReady, this));
	},

	onReady: function() {
		if (User.settings.get(this.userSettingName)) {
			this.activateInlineManual();
		}
	},

	activateInlineManual: function() {
		const callbacks = {
			onTopicStart: _.bind(this.setRequiredStepsAmount, this),
			onTopicEnd: _.bind(this.killTutorialIfWatched, this),
			onTopicNext: _.bind(this.nextStep, this)
		};

		this.startInlineManual(this.tutorialId, callbacks);
	},

	setRequiredStepsAmount: function(playerInstance, topicId) {
		this.requiredStepsAmount = playerInstance.topics[topicId].steps.length - 1;
	},

	nextStep: function(player, topic, step) {
		if (step > this.currentStep) {
			this.currentStep = step;
		}
	},

	killTutorialIfWatched: function() {
		this.target.removeClass('ready videoReady');

		if (this.currentStep >= this.requiredStepsAmount) {
			User.settings.set(this.userSettingName, 0);
			User.settings.save();
		}
	}
});
