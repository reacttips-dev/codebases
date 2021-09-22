export const getWysiwygLabels = (translator) => {
	return {
		toolbar: {
			bold: {
				value: translator.gettext('Bold')
			},
			italic: {
				value: translator.gettext('Italic')
			},
			underline: {
				value: translator.gettext('Underline')
			},
			remove: {
				value: translator.gettext('Remove style')
			},
			link: {
				value: translator.gettext('Link')
			},
			image: {
				value: translator.gettext('Image')
			},
			ol: {
				value: translator.gettext('Ordered list')
			},
			ul: {
				value: translator.gettext('Unordered list')
			},
			fontfamily: { value: 'Font family' },
			fontsize: { value: 'Font size' }
		},
		link: {
			textLabel: translator.gettext('Text'),
			linkLabel: translator.gettext('Link')
		},
		image: {
			smallSize: translator.gettext('Small'),
			bestFitSize: translator.gettext('Best fit')
		},
		shared: {
			editButton: translator.gettext('Edit'),
			removeButton: translator.gettext('Remove'),
			saveButton: translator.gettext('Save'),
			deleteButton: translator.gettext('Delete')
		},
		fontColor: {
			backgroundColor: translator.gettext('Background Color'),
			color: translator.gettext('Text color')
		},
		fontSize: {
			small: translator.gettext('Small'),
			normal: translator.gettext('Normal'),
			large: translator.gettext('Large'),
			huge: translator.gettext('Huge')
		}
	};
};
