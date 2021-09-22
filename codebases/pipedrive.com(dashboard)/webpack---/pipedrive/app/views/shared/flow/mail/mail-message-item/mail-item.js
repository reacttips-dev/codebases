const Pipedrive = require('pipedrive');
const _ = require('lodash');
const MailMessageView = require('./mail-message');
const DraftItemView = require('./draft-item');
const template = require('./mail-item.html');

/**
 * This view layer is needed to keep the MailMessage's template structure right
 */

const EmailView = Pipedrive.View.extend({
	template: _.template(template),
	templateHelpers: {},

	initialize: function(options) {
		this.relatedModel = options.relatedModel;
	},

	onLoad: function() {
		this.initChildViews();
		this.render();
	},

	initChildViews: function() {
		if (this.model.useCompactStyle()) {
			this.initDraftItemView();
		} else {
			this.initMailMessageView();
		}
	},

	initDraftItemView: function() {
		const draftView = new DraftItemView({
			model: this.model,
			relatedModel: this.relatedModel
		});

		this.addView('[data-flow-item="mail-message"]', draftView);

		draftView.render();
	},

	initMailMessageView: function() {
		const mailView = new MailMessageView({
			model: this.model,
			relatedModel: this.relatedModel
		});

		this.addView('[data-flow-item="mail-message"]', mailView);

		mailView.render();
	}
});

module.exports = EmailView;
