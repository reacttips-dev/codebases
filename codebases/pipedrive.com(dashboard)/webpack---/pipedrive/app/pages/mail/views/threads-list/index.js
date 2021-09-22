'use strict';
const _ = require('lodash');
/**
 * Thread lists factory, that will choose right folder view.
 * Available sections: 'inbox', 'drafts', 'sent', 'archive'.
 *
 * @class  pages/mail/views/ThreadsList
 *
 * @example
 * // To create new folder view:
 * var ThreadListView = require('pages/mail/views/threads-list/index'),
 * 	   FolderView = ThreadListView.getFolderView(section),
 *
 * // And then the instance:
 * this.newFolderView = new FolderView(options);
 */
const FolderSelector = function() {
	_.assignIn(
		this,
		/** @lends pages/mail/views/ThreadsList.prototype */ {
			/**
			 * Available and accepted folders for threads lists.
			 * @type {Object}
			 */
			folders: {
				inbox: require('./folders/inbox/inbox'),
				drafts: require('./folders/drafts/drafts'),
				outbox: require('./folders/outbox/outbox'),
				sent: require('./folders/sent/sent'),
				archive: require('./folders/archive/archive'),
				search: require('./folders/search/search')
			}
		}
	);
};

/**
 * Creates a new threads list based on section.
 *
 * @param {String} section  Section in the mail to be initialized
 * @return {module:Pipedrive.View}
 */
FolderSelector.prototype.getFolderView = function(section) {
	let Folder;

	if (this.folders.hasOwnProperty(section)) {
		Folder = this.folders[section];
	} else {
		throw new Error(`Failed to get folder view. Unknown section: ${section}`);
	}

	return Folder;
};

module.exports = new FolderSelector();
