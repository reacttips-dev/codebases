const _ = require('lodash');
const inlineImageHelpers = {
	/**
	 * Triggered if file is added to draft attachment collection.
	 */
	onImageAdded: function(draftModel, image) {
		if (!image.isInline()) {
			return;
		}

		const callbacks = {
			success: function(m, model, request) {
				if (image.options && _.isFunction(image.options.success)) {
					image.options.success(m, model, request);
				}
			}.bind(this)
		};

		if (draftModel.isNew()) {
			draftModel.once(
				'change:id',
				function() {
					image.uploadFile(draftModel.getRelatedBy(), callbacks);
				},
				this
			);

			draftModel.trigger('save');
		} else {
			image.uploadFile(draftModel.getRelatedBy(), callbacks);
		}
	},

	setInlineImageUrlByCid: function($content, cid, image) {
		const $img = $content.find(`[src="cid:${cid}"]`);

		if ($img.length) {
			$img.attr('src', image.getUrl());
			$img.attr('data-pipecid', cid);
		}

		return $content;
	},

	deleteRemovedImages: function(body, collection) {
		const draftInlineImages = collection.getInlineAttachments();

		if (!draftInlineImages.length) {
			return;
		}

		_.each(draftInlineImages, function(img) {
			const cid = img.get('cid');

			if (!_.includes(body, cid)) {
				// Do not delete image if it is from existing template and not yet binded to mailmessage
				if (!img.get('mail_message_id') && img.get('mail_template_id')) {
					return;
				}

				img.destroy();
			}
		});
	}
};

module.exports = inlineImageHelpers;
