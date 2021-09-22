const _ = require('lodash');
const $ = require('jquery');

const addContextResizeObserver = (coachmark) => {
	if (!('ResizeObserver' in window)) return;

	// Monitor resize events in different contexts that would leave the detached coachmark floating in wrong place
	// 1) .mailThreadBody - present in 1.1) Mail > Inbox > Thread view > Reply 1.2) Flow > Reply thread modal
	// 2) form.composer - present in 2.1) Mail > Compose 2.2) Flow > Email tab
	const contextEl =
		document.querySelector('.mailThreadBody') ?? document.querySelector('form.composer');

	if (!contextEl) return;

	let initialWidth, initialHeight;

	const resizeObserver = new ResizeObserver((entries) => {
		const newWidth = entries[0]?.contentRect?.width;
		const newHeight = entries[0]?.contentRect?.height;

		if (!newWidth || !newHeight) return;

		if (!initialWidth) initialWidth = newWidth;

		if (!initialHeight) initialHeight = newHeight;

		if (newWidth !== initialWidth || newHeight !== initialHeight) {
			coachmark.remove();
			resizeObserver.disconnect();
		}
	});

	resizeObserver.observe(contextEl);

	// Prevent floating in wrong place after window reize in Flow > Reply thread modal
	$(window).on('resize', () => {
		coachmark.remove();
		$(window).off('resize');
	});
};

exports.scheduleMailDropdown = function(API, parent, tag, options) {
	// Specify parentContainers in different places to close the coachmark
	// 1) .cui4-modal - Flow > Reply thread modal
	// 2) form.composer - Flow > Email tab
	const parentContainer =
		parent.closest('.cui4-modal') ?? document.querySelector('form.composer');

	const coachmark = new API.Coachmark({
		tag,
		parent,
		content: _.gettext('You can schedule to send this email later'),
		detached: true,
		parentContainer,
		appearance: {
			placement: 'bottomLeft',
			zIndex: parent.closest('.cui4-modal') ? { above: '.cui4-modal' } : 10,
			align: {
				points: ['tr', 'br'],
				offset: [12, 12]
			}
		},
		onReady: (data) => {
			if (!data.active) return;

			$(parent).one('click', () => coachmark.close());

			addContextResizeObserver(coachmark);
		},
		onConfirm: () => {
			coachmark.close();
			options?.onConfirm?.();
		}
	});

	return coachmark;
};
