const FileModel = require('../file');

const AttachmentModel = FileModel.extend({
	urlRoot: `${app.config.api}/mailbox/mailAttachments`
});

module.exports = AttachmentModel;
