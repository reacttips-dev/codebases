const _ = require('lodash');

exports.notesComposer = function(API, parent, tag) {
	const coachmark = new API.Coachmark({
		tag,
		parent,
		content: _.gettext('Notify your team members by typing “@” and then their name'),
		appearance: {
			placement: 'left',
			zIndex: 10
		},
		__debug: false
	});

	return coachmark;
};

exports.wysiwyg = function(API, parent, tag) {
	const coachmark = new API.Coachmark({
		tag,
		parent,
		content: _.gettext('Here’s quick access to notifying a team member in this note'),
		appearance: {
			placement: 'top',
			zIndex: 10
		},
		__debug: false
	});

	return coachmark;
};

exports.commentsButton = function(API, parent, tag) {
	const coachmark = new API.Coachmark({
		tag,
		parent,
		content: _.gettext(
			'Commenting notifies note’s owner, previous commenters, and anyone you @mention'
		),
		appearance: {
			placement: 'left',
			zIndex: 10
		},
		__debug: false
	});

	return coachmark;
};
