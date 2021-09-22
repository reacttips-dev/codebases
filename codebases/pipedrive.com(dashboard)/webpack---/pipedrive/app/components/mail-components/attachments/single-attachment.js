'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const template = require('./single-attachment.html');
const $ = require('jquery');
const PDMetrics = require('utils/pd-metrics');

require('fancybox');
require('fancybox.resize');

const SingleAttachmentView = Pipedrive.View.extend({
	template: _.template(template),

	events: {
		'click a.mail-attachment': 'onAttachmentClicked'
	},

	initialize: function(options) {
		this.options = options;
	},

	onLoad: function() {
		this.render();
	},

	getTemplateHelpers: function() {
		return {
			filename: this.model.get('name'),
			url: this.model.getUrl(),
			filesize: this.model.getHumanizedFileSize(),
			fileType: this.model.get('file_type')
		};
	},

	/**
	 * If attachment is an image, displays it inline. Otherwise, lets default action happen.
	 * @param  {Object} ev 	jQuery event
	 * @void
	 */
	onAttachmentClicked: function(ev) {
		const [, objectType, objectId] = window.location.pathname.split('/');
		const detailPages = ['deal', 'person', 'organization'];

		if (
			this.model.get('file_type') === 'img' &&
			// Fallback to browser default behaviour in case of unsupported HEIF/ISO/PSD/TIFF Base Media file formats
			!this.model.hasExtension(['heif', 'heic', 'psd', 'tiff', 'tif'])
		) {
			ev.preventDefault();
			ev.stopPropagation();

			$.fancybox({
				href: ev.currentTarget.href,
				minWidth: 40,
				minHeight: 40,
				openEffect: 'none',
				closeEffect: 'none',
				type: 'image'
			});
		}

		if (detailPages.indexOf(objectType) !== -1) {
			PDMetrics.trackUsage(null, 'detail_view_email', 'interacted', {
				object_type: objectType,
				object_id: Number(objectId),
				thread_id: this.options.mail_thread_id,
				interaction: 'attachment-viewed',
				email_sync_type: this.options.smart_bcc_flag ? 'smart_bcc' : 'nylas'
			});
		}
	}
});

module.exports = SingleAttachmentView;
