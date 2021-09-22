'use strict';

const _ = require('lodash');
const eachLimit = require('async/eachLimit');
const $ = require('jquery');
const Pipedrive = require('pipedrive');
const { createLinks } = require('@pipedrive/sanitize-html');
const template = require('./body.html');
const GlobalAttachmentsCollection = require('collections/mail/global-singletons/attachments');
const TrackingEventsCollections = require('collections/mail/tracking-events');
const MailHelpers = require('utils/mail/helpers');
const ShowTrackingTooltip = require('utils/mail/tracking-tooltip-utils/show-tracking-tooltip');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const User = require('models/user');
const PDMetrics = require('utils/pd-metrics');

const BodyView = Pipedrive.View.extend({
	template: _.template(template),
	trackingCollection: null,

	events: {
		'click a': 'openLinkSafely'
	},

	initialize: function(options) {
		this.options = options;
		this.mailModel = options.mailModel;
	},

	onLoad: function() {
		const body = this.mailModel.get('body');
		const hasBody = this.mailModel.get('has_body_flag');
		const hasInlineAttachment = this.mailModel.get('has_inline_attachments_flag');

		// Render can be called right away whenever body is present or message hasn't body but has inline attachments
		if (body || (!hasBody && hasInlineAttachment)) {
			this.render();
		} else {
			this.fetchBody();
		}
	},

	getTemplateHelpers: function() {
		return {
			body: this.getPreparedBody()
		};
	},

	onFileAddedEvent: function(fileModel) {
		if (fileModel.get('mail_message_id') === this.mailModel.get('id')) {
			this.placeSingleInlineAttachment(fileModel);
		}
	},

	fetchBody: function() {
		this.listenTo(this.mailModel, 'change:body', this.render);
		this.mailModel.fetchMessageBody();
	},

	afterRender: function() {
		this.collapseQuote();
		this.initInlineAttachments();
		this.initTrackedLinks();
	},

	initInlineAttachments: function() {
		if (this.mailModel.get('has_inline_attachments_flag')) {
			GlobalAttachmentsCollection.getAttachments(
				this.mailModel.get('id'),
				_.bind(this.placeInlineAttachments, this)
			);
		}
	},

	initTrackedLinks: function() {
		this.$('.linkTrackingBubble').remove();

		if (this.mailModel.isLinkTrackingEnabled()) {
			const $trackedLinks = this.$('a[data-pipedrive-original-href]');
			const linkTrackingIndicator =
				'<span class="linkTrackingBubbleContainer" onclick="return false;">' +
				'<span class="linkTrackingBubble"></span></span>';

			$trackedLinks.append(linkTrackingIndicator).addClass('isTracked');

			this.handleTrackedLink($trackedLinks);

			this.trackingCollection = new TrackingEventsCollections(null, {
				messageId: this.mailModel.get('id'),
				eventType: 'message.link_clicked'
			});

			this.trackingCollection.pull({
				success: this.onTrackingCollPulled.bind(this, $trackedLinks)
			});
		}

		this.listenToLinkTrackingSettingChange();
	},

	handleTrackedLink: function($trackedLinks) {
		const isSent = !!this.mailModel.get('sent_flag');

		$trackedLinks.each((i, link) => {
			const $link = $(link);

			// Will replace tracking href with original one to prevent sending own events
			if (isSent) {
				$link.attr('href', $link.data('pipedrive-original-href'));
			}
		});
	},

	onTrackingCollPulled: function($trackedLinks) {
		$trackedLinks.each((i, link) => this.setTrackedLinkTooltip(link, i));

		this.listenTo(this.trackingCollection, 'add', this.onTrackingEventAdd.bind(this));
	},

	listenToLinkTrackingSettingChange: function() {
		const activeConnection = MailConnections.getConnectedNylasConnection();

		this.stopListening(activeConnection, 'change:mail_tracking_link_flag');
		this.listenTo(
			activeConnection,
			'change:mail_tracking_link_flag',
			this.initTrackedLinks.bind(this)
		);
	},

	onTrackingEventAdd: function(model) {
		const trackedLinkIndex = _.get(model.get('event_type_data'), 'link_index');

		if (typeof trackedLinkIndex === 'undefined') {
			return;
		}

		const $trackedLink = this.$('a[data-pipedrive-original-href]').eq(trackedLinkIndex);

		this.setTrackedLinkTooltip($trackedLink, trackedLinkIndex);
	},

	setTrackedLinkTooltip: function(link, index) {
		const $link = $(link);
		const origUrl = $link.data('pipedrive-original-href');
		const models = this.trackingCollection.filterLinkClickEvents(origUrl, index);
		const isClicked = models.length > 0;

		if (isClicked) {
			$link
				.addClass('isClicked')
				.find('span.linkTrackingBubbleContainer')
				.off('mouseenter')
				.mouseenter((e) => this.showLinkTrackingTooltip(e, origUrl, index));
		} else {
			$link.find('span.linkTrackingBubbleContainer').tooltip({
				tip: _.gettext('Not clicked yet'),
				position: 'bottom'
			});
		}
	},

	showLinkTrackingTooltip(ev, origUrl, index) {
		const tooltipOpts = {
			$target: $(ev.currentTarget),
			eventModels: this.trackingCollection.filterLinkClickEvents(origUrl, index),
			getHeaderText: function(eventsCount) {
				return _.gettext(
					_.ngettext('Clicked %d time', 'Clicked %d times', eventsCount),
					eventsCount
				);
			},
			getShowMoreText: function(collapsedEventsCount) {
				return _.gettext(
					_.ngettext('%d more click', '%d more clicks', collapsedEventsCount),
					collapsedEventsCount
				);
			}
		};

		ShowTrackingTooltip.showEventsTooltip(tooltipOpts);
	},

	/**
	 * Prepare body before rendering
	 * @return {String}
	 */
	getPreparedBody: function() {
		let bodyStr = this.mailModel.get('body') || '';

		bodyStr = this.handledBodyInlineAttachSrcs(bodyStr);
		bodyStr = this.handleUrlsInBody(bodyStr);
		bodyStr = MailHelpers.removeOpenTrackingPixels(bodyStr);

		return bodyStr;
	},

	/**
	 * Handles the Elastic and non-Elastic inline attachments' html tags in a html-string - turns the src attributes
	 * to data-pipecid attributes, cleans the contents of the src attributes in case of Elastic attachments.
	 *
	 * The story:
	 * We pull inline attachments asynchronously. So, the body is first pulled with the src attributes filled with the
	 * attachments' cids. This would give errors as the browser expects the src to be an url or something. That for we
	 * turn the src attributes into data-pipecid attributes. Later, once the attachments get pulled, the view has to
	 * find the img-tags in DOM by the data-pipecid attributes and add the correct urls into the src attributes.
	 *
	 * Examples:
	 * Elastic <img src="cid:###file_id=12345678###">
	 * Non-Elastic <img src="cid:12345678">
	 *
	 * @param  {String} body
	 * @return {String}
	 */
	handledBodyInlineAttachSrcs: function(bodyStr) {
		// Elastic
		const regexp = /src="cid:###file_id=(\w+)###"/gi;

		let match = regexp.exec(bodyStr);

		while (match) {
			bodyStr = bodyStr.replace(match[0], `data-pipecid="${match[1]}"`);
			match = regexp.exec(bodyStr);
		}

		// non-Elastic
		bodyStr = bodyStr.replace(/ src="cid:/g, ' data-pipecid="');

		return bodyStr;
	},

	/**
	 * With createLinks method handle url's in body, which appear as strings
	 * @param  {String} bodyStr
	 * @return {String}
	 */
	handleUrlsInBody: function(bodyStr) {
		return createLinks(bodyStr, {
			noEscape: true,
			openEmailsInNewTab: User.settings.get('open_email_links_in_new_tab'),
			openLinksInNewTab: true,
			fullUrlsOnly: true
		});
	},

	collapseQuote: function() {
		const $quote =
			this.$el.find('div[data-type=blockQuoteWrapper]:first') ||
			this.$el.find('blockQuote:first');

		// this boolean applies only for mail bodies composed in Pipedrive composer,
		// as we attach "data-type" attribute (other mail clients don't do it)

		const forwardQuote = $quote.data('type') === 'forward';

		if (!$quote.length || forwardQuote) {
			return;
		}

		this.wrapQuote($quote);
	},

	wrapQuote: function($quote) {
		$quote.wrap('<div class="messageQuote" />');
		const $wrap = $quote.parent();

		$wrap.before(this.generateQuoteButton());
		this.$el
			.find('.quoteExpandCollapse')
			.on('click.mailMessage', _.bind(this.toggleQuoteCollapseExpand, this, $wrap));
	},

	toggleQuoteCollapseExpand: function($wrap, ev) {
		this.sendMetrics('toggle-quote-collapse');

		$(ev.currentTarget)
			.parent('.quoteExpandWrapper')
			.toggleClass('expanded');
		$wrap.toggleClass('open');
	},

	/**
	 * Returns a html-string representation of the expand-collapse-quote button.
	 * @return {String}
	 */
	generateQuoteButton: function() {
		const quoteBtn = `<div class="quoteExpandWrapper"><div class="quoteExpandCollapse expand" data-tooltip="${_.gettext(
			'Show quoted message'
		)}">${_.icon(
			'ellipsis'
		)}</div><div class="quoteExpandCollapse collapse" data-tooltip="${_.gettext(
			'Hide quoted message'
		)}">${_.icon('ellipsis')}</div></div>`;

		return quoteBtn;
	},

	openLinkSafely: function(ev) {
		const $link = $(ev.currentTarget);
		const href = $link.attr('href');

		if (href && href.match(/^https?:\/\//)) {
			$link.attr('target', '_blank');
			$link.attr('rel', 'noreferrer noopener');
		}
	},

	placeSingleInlineAttachment(attachment, cb = () => {}) {
		const cid = attachment.getCid();
		const $el = this.$el.find(`[data-pipecid="${cid}"]`);
		const url = attachment.getUrl();

		if (!$el.length) {
			this.options.onInlineAttachmentError(attachment);

			// not to stop loading of other inline images
			return cb(null);
		}

		$el.removeAttr('data-pipecid')
			.attr('src', url)
			// if multiple found
			// only call callback on 1 image load
			.eq(0)
			.one('load', () => cb(null));
	},

	/**
	 * Places asynchronously loaded inline attachments to the body in the DOM.
	 * @param  {Array} attachments
	 * @void
	 */
	placeInlineAttachments(attachments) {
		const inlineAttachments = _.filter(attachments, (attachment) =>
			attachment.get('inline_flag')
		);

		// load inline images 10 at a time
		// not to cause max_users_db_connections which is 50
		eachLimit(inlineAttachments, 10, (attachment, cb) =>
			this.placeSingleInlineAttachment(attachment, cb)
		);
	},

	sendMetrics: function(action) {
		const metricsData = _.assignIn(
			{
				'mail-v2.feature': 'message-body',
				'mail-v2.action': action
			},
			this.options.metricsData
		);

		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', metricsData);
	}
});

module.exports = BodyView;
