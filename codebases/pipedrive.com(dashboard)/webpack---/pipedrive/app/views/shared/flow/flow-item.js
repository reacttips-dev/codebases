const _ = require('lodash');
const Pipedrive = require('pipedrive');
const FlowItemTemplate = require('templates/shared/flow/flow-item.html');
const ActivityView = require('views/shared/flow/activity');
const NoteView = require('views/shared/flow/note');
const MailItemView = require('views/shared/flow/mail/mail-message-item/mail-item');
const MailFilesView = require('views/shared/flow/mail/mail-files-item/mail-files');
const ChangelogView = require('views/shared/flow/changelog');
const FollowerView = require('views/shared/flow/follower');
const ParticipantView = require('views/shared/flow/participant');
const FilesView = require('views/shared/flow/files');
const DealView = require('views/shared/flow/deal');
const InvoiceView = require('views/shared/flow/invoice');
const MarketingView = require('views/shared/flow/marketing');
const DocumentView = require('views/shared/flow/document');
const CallView = require('views/shared/flow/call');
const DealChangeView = require('views/shared/flow/deal-change');
const FlowInlineCommentsView = require('views/flow-inline-comments/index');
const User = require('models/user');

/**
 * Flow Item component.
 *
 * Provides extra UI elements for displaying item inside flow - like icon, date header, menu etc.
 * Given one flow item model automatically finds and initializes right viewer for specific type.
 *
 * @classdesc
 * Flow item is wrapper view class for specific item like email, note, activity.
 *
 * @class views/shared/flow/FlowItem
 * @augments module:Pipedrive.View
 */

/**
 * Map of flow item types and their view classes
 *
 * @type {Object}
 * @alias views/shared/flow/FlowItem.FlowItemSubViews
 * @private
 * @enum
 */

const FlowItemSubViews = {
	activity: ActivityView,
	note: NoteView,
	mailMessage: MailItemView,
	mailMessageWithAttachment: MailFilesView,
	file: FilesView,
	change: ChangelogView,
	follower: FollowerView,
	participant: ParticipantView,
	deal: DealView,
	dealChange: DealChangeView,
	invoice: InvoiceView,
	marketing_campaign_stat: MarketingView,
	marketing_status_change: MarketingView,
	document: DocumentView,
	call: CallView
};

module.exports = Pipedrive.View.extend(
	/** @lends views/shared/flow/FlowItem.prototype */
	{
		template: _.template(FlowItemTemplate),

		subview: null,

		/**
		 * flow item model
		 * @type {models/flowItem}
		 */
		model: null,

		/**
		 * deal or person model what flow shows
		 * @type {model}
		 */
		relatedModel: null,

		initialize: function(options) {
			this.model = options.model;
			this.relatedModel = options.relatedModel;
			this.salesPhoneModel = options.salesPhoneModel;
			this.conferenceMeetingIntegrations = options.conferenceMeetingIntegrations;
			this.hasActiveCalendarSync = options.hasActiveCalendarSync;

			const type = this.getType();
			const ViewClass = FlowItemSubViews[type];

			if (!ViewClass) {
				return;
			}

			this.subview = new ViewClass({
				model: this.model.submodel,
				flowItemModel: this.model,
				relatedModel: this.relatedModel,
				collection: this.model.collection,
				$parent: this.$,

				// Only for Activity flow types
				salesPhoneModel: this.salesPhoneModel,
				conferenceMeetingIntegrations: this.conferenceMeetingIntegrations,
				hasActiveCalendarSync: this.hasActiveCalendarSync
			});

			this.addView('.flowItemContent', this.subview);

			this.model.submodel?.onChange('type', this.render, this);

			this.render();
		},

		getType() {
			const type = this.model.get('object');

			if (
				type === 'activity' &&
				(this.model.get('data').call ||
					this.model.get('data').reference_type === 'salesphone' ||
					this.model.submodel.get('reference_type') === 'salesphone')
			) {
				return 'call';
			}

			return type;
		},

		getFlowItemClass: function() {
			let className = this.model.getType();

			if (className === 'activity') {
				const isDone = this.model.submodel.isDone();

				if (isDone) {
					className += ' done';
				}

				if (this.model.submodel.isOverdue() && !isDone) {
					className += ' overdue';
				}
			}

			return className;
		},

		selfRender: function() {
			this.$el.html(this.template(this));
		},

		afterRender: function() {
			this.addInlineCommentsView();
		},

		addInlineCommentsView: function() {
			if (!this.isCommentsSupportedType()) {
				return;
			}

			const commentsSummary = this.model.get('data').comments;

			new FlowInlineCommentsView({
				el: this.$('.flowItemComments').get(0),
				rootObjectType: this.relatedModel.type,
				rootObjectId: this.relatedModel.get('id'),
				objectType: this.model.getType(),
				objectId: this.model.get('data').id,
				commentsSummary
			});
		},

		isCommentsSupportedType: function() {
			return this.model.getType() === 'note' && User.companyFeatures.get('comments');
		}
	}
);
