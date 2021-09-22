const BaseComposer = require('../base-composer');
const _ = require('lodash');
const $ = require('jquery');

/**
 * Mail composer, used when starting a completely new thread
 *
 * @class  components/MailComposer/composers/NewMailComposer
 *
 * @param {Object} opts      Initial options
 * @augments {components/MailComposer/BaseComposer}
 */
module.exports = BaseComposer.extend({
	initialize: function(opts) {
		BaseComposer.prototype.initialize.call(this, opts);
	},

	afterRender: function() {
		BaseComposer.prototype.afterRender.call(this);

		this.draftModel.set('body', $.trim(this.$('.bodyEditor').html()));
	},

	onAttachedToDOM: function() {
		BaseComposer.prototype.onAttachedToDOM.call(this);
	},

	getTemplateHelpers: function() {
		const baseTemplateHelpers = BaseComposer.prototype.getTemplateHelpers.call(this);

		return _.assignIn(baseTemplateHelpers, {
			sendmodeData: null
		});
	},

	saveDraft: function(options) {
		if (this.ifAllFieldsEmpty(this.getData()) && this.draftModel.isNew()) {
			return;
		}

		options = _.isObject(options) ? options : {};
		options.isFirstSave = this.draftModel.isNew();

		BaseComposer.prototype.saveDraft.call(this, options);

		if (options.isFirstSave) {
			BaseComposer.prototype.sendPageActionMetrics.call(this, 'first-draft-save');
		}
	},

	getDataForSaving: function(options, attachmentsForDuplication) {
		const data = this.getData(false, false, true);

		if (_.get(options, 'isFirstSave')) {
			data.deal_id = this.draftModel.get('deal_id');
		}

		if (!_.isEmpty(attachmentsForDuplication)) {
			data.has_template_attachments = true;
			data.file_ids = _.map(attachmentsForDuplication, 'id');
		}

		return data;
	},

	onSaveDraftSuccess: function(options) {
		if (_.isFunction(this.options.onDraftSaved)) {
			this.options.onDraftSaved(this.draftModel, options.isFirstSave);
		}

		BaseComposer.prototype.onSaveDraftSuccess.call(this, options);
	}
});
