const User = require('models/user');
const componentLoader = require('webapp-component-loader');
const { MentionsPlugin } = require('@pipedrive/pd-wysiwyg');
const _ = require('lodash');

module.exports = function applyMentionStylesToNote(noteElement) {
	const isInAppMentionsFeatureEnabled = User.companyFeatures.get('in_app_mentions');

	if (!isInAppMentionsFeatureEnabled) {
		return;
	}

	MentionsPlugin.applyMentionsStyles(noteElement, {
		componentLoader,
		texts: {
			deactivated: _.gettext('deactivated'),
			hiddenUser: _.gettext('hidden user'),
			noPermission: _.gettext(
				'This user does not have permissions to view this item and will not be notified'
			)
		}
	});
};

// We need to keep track of recently re-fetched notes so that we don't perform double (unnecessary) GET requests
const recentlyFetchedNotes = [];

/**
 * In case the user does not have permission to see other users,
 * or the note includes @(hidden user) mention
 * then we must refresh the note content from the API to have the latest up-to-date content
 *
 * The reason: socket events are processed only from the writer POV, and therefore they expose
 * sensitive information towards users who do not have proper permissions. This risk is accepted
 * by product, but from front-end we must make sure those names remain hidden. And the other way
 * around: if the user without permission edits a note that includes @(hidden user) chip, this
 * mention tag will be shown for admins, so we need to refresh from APi to get the correct user chip
 */
module.exports.refetchNote = function(model, callback) {
	if (recentlyFetchedNotes.includes(model.get('id'))) {
		recentlyFetchedNotes.splice(recentlyFetchedNotes.indexOf(model.get('id')), 1);

		return callback();
	}

	if (
		User.companyFeatures.get('in_app_mentions') &&
		(!User.settings.get('can_see_other_users') ||
			model.get('content').includes(_.gettext('(hidden user)'))) &&
		MentionsPlugin.getMentions(model.get('content')).mentionsCount > 0
	) {
		recentlyFetchedNotes.push(model.get('id'));

		setTimeout(() => {
			recentlyFetchedNotes.splice(recentlyFetchedNotes.indexOf(model.get('id')), 1);
		}, 1000);

		model.pull({
			success: () => {
				callback();
			}
		});
	} else {
		return callback();
	}

	return true;
};
