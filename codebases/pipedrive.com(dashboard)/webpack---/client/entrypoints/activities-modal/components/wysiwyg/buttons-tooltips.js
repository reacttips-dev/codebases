const getUserOperatingSystem = () => {
	if (!navigator.appVersion) {
		return 'unknown';
	}

	if (navigator.appVersion.indexOf('Windows Phone') !== -1) {
		return 'windowsphone';
	} else if (navigator.appVersion.indexOf('Win') !== -1) {
		return 'windows';
	} else if (navigator.appVersion.indexOf('Android') !== -1) {
		return 'android';
	} else if (navigator.appVersion.indexOf('Mac') !== -1) {
		return 'macosx';
	} else if (
		navigator.appVersion.indexOf('X11') !== -1 ||
		navigator.appVersion.indexOf('Linux') !== -1
	) {
		return 'linux';
	}

	return 'unknown';
};

const OS = getUserOperatingSystem();

// eslint-disable-next-line complexity
const getButtonLabel = (key, translator) => {
	switch (key) {
		case 'bold':
			return {
				label: translator.gettext('Bold'),
				combination: {
					macosx: '(⌘B)',
					windows: '(Ctrl B)',
					linux: '(Ctrl B)',
				},
			};
		case 'italic':
			return {
				label: translator.gettext('Italic'),
				combination: {
					macosx: '(⌘I)',
					windows: '(Ctrl I)',
					linux: '(Ctrl I)',
				},
			};
		case 'underline':
			return {
				label: translator.gettext('Underline'),
				combination: {
					macosx: '(⌘U)',
					windows: '(Ctrl U)',
					linux: '(Ctrl U)',
				},
			};
		case 'remove':
			return {
				label: translator.gettext('Remove styling'),
				combination: {
					macosx: '(⌘\\)',
					windows: '(Ctrl \\)',
					linux: '(Ctrl \\)',
				},
			};
		case 'link':
			return {
				label: translator.gettext('Link'),
				combination: {
					macosx: '(⌘K)',
					windows: '(Ctrl K)',
					linux: '(Ctrl K)',
				},
			};
		case 'ol':
			return {
				label: translator.gettext('Numbered list'),
				combination: {
					macosx: '(⌘⇧7)',
					windows: '(Ctrl⇧7)',
					linux: '(Ctrl⇧7)',
				},
			};
		case 'ul':
			return {
				label: translator.gettext('Bulleted list'),
				combination: {
					macosx: '(⌘⇧8)',
					windows: '(Ctrl⇧8)',
					linux: '(Ctrl⇧8)',
				},
			};
		case 'fontfamily':
			return {
				label: translator.gettext('Font family'),
			};
		case 'fontsize':
			return {
				label: translator.gettext('Font size'),
			};
		case 'fontcolor':
			return {
				label: translator.gettext('Font color'),
			};
		case 'image':
			return {
				label: translator.gettext('Image'),
				combination: {
					macosx: '(⌘⇧M)',
					windows: '(Ctrl⇧M)',
					linux: '(Ctrl⇧M)',
				},
			};
		default:
			return { label: '' };
	}
};

export function getTooltip(key, translator) {
	const defaultButtonLabel = getButtonLabel(key, translator);
	const translation = defaultButtonLabel.label;
	const combination =
		(defaultButtonLabel.combination && defaultButtonLabel.combination[OS]) || '';

	return `${translation} ${combination}`;
}
