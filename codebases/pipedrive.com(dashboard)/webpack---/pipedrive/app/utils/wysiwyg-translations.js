const _ = require('lodash');

module.exports = {
	getTranslations: function() {
		return {
			toolbar: {
				bold: {
					value: _.gettext('Bold'),
					shortcut: { macosx: '(⌘B)', windows: '(Ctrl B)' }
				},
				italic: {
					value: _.gettext('Italic'),
					shortcut: { macosx: '(⌘I)', windows: '(Ctrl I)' }
				},
				underline: {
					value: _.gettext('Underline'),
					shortcut: { macosx: '(⌘U)', windows: '(Ctrl U)' }
				},
				remove: {
					value: _.gettext('Remove style'),
					shortcut: { macosx: '(⌘\\)', windows: '(Ctrl \\)' }
				},
				link: {
					value: _.gettext('Link'),
					shortcut: { macosx: '(⌘K)', windows: '(Ctrl K)' }
				},
				at: {
					value: _.gettext('Mention someone'),
					shortcut: { macosx: '(@)', windows: '(@)' }
				},
				image: {
					value: _.gettext('Image'),
					shortcut: { macosx: '(⌘M)', windows: '(Ctrl M)' }
				},
				ol: {
					value: _.gettext('Ordered list'),
					shortcut: { macosx: '(⌘⇧7)', windows: '(Ctrl⇧7)' }
				},
				ul: {
					value: _.gettext('Unordered list'),
					shortcut: { macosx: '(⌘⇧8)', windows: '(Ctrl⇧8)' }
				},
				fontsize: {
					value: 'Font size'
				},
				fontfamily: {
					value: 'Font family'
				}
			},
			link: {
				textLabel: _.gettext('Text'),
				linkLabel: _.gettext('Link')
			},
			image: {
				smallSize: _.gettext('Small'),
				bestFitSize: _.gettext('Best fit')
			},
			shared: {
				editButton: _.gettext('Edit'),
				removeButton: _.gettext('Remove'),
				saveButton: _.gettext('Save'),
				deleteButton: _.gettext('Delete')
			},
			fontColor: {
				backgroundColor: _.gettext('Background Color'),
				color: _.gettext('Text color')
			},
			fontSize: {
				small: _.gettext('Small'),
				normal: _.gettext('Normal'),
				large: _.gettext('Large'),
				huge: _.gettext('Huge')
			}
		};
	}
};
