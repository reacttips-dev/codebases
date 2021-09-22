import ResizeObserver from 'resize-observer-polyfill';

let groupEmailCoachmarkInstance;
let mailSchedulingCoachmark;

export const createGroupEmailCoachmark = async (API, node, translator) => {
	const iamClient = await API.componentLoader.load('iam-client');

	if (!node) {
		return;
	}

	// remove existing coachmark instance otherwise it wont re-render when selection changes
	if (groupEmailCoachmarkInstance) {
		groupEmailCoachmarkInstance.remove();
	}

	groupEmailCoachmarkInstance = new iamClient.Coachmark({
		tag: 'space_group_emailing',
		parent: node,
		content: translator.gettext('Bulk send personalized emails to multiple contacts at once.'),
		appearance: {
			zIndex: 5,
			placement: 'bottomRight'
		},
		actions: [
			{
				label: translator.gettext('Learn more'),
				handler: () => {
					window.open('https://support.pipedrive.com/hc/en-us/articles/360001417457');
					groupEmailCoachmarkInstance.close();
				}
			},
			{
				label: translator.gettext('Got it'),
				handler: () => groupEmailCoachmarkInstance.close(),
				primary: true
			}
		]
	});

	const coachmarkEl = groupEmailCoachmarkInstance.mountNode.getElementsByClassName(
		'iamClient__Coachmark'
	)[0];
	// To align coachmark left side with button, 24 stands for coachmark arrow's offset
	const halfButtonWidth = node.offsetWidth / 2 - 24;

	if (coachmarkEl) {
		coachmarkEl.style.width = '320px';
		coachmarkEl.style.transform = `translateX(-${halfButtonWidth}px)`;
	}
};

const addBodyEditorResizeObserver = (coachmark) => {
	const bodyEditorEl = document.querySelector('.bodyEditor');

	if (!bodyEditorEl) return;

	let bodyEditorInitialHeight;

	const resizeObserver = new ResizeObserver((entries) => {
		const bodyEditorNewHeight = entries[0]?.contentRect?.height;

		if (!bodyEditorNewHeight) return;

		if (!bodyEditorInitialHeight) bodyEditorInitialHeight = bodyEditorNewHeight;

		if (bodyEditorNewHeight !== bodyEditorInitialHeight) {
			coachmark.unqueue();
			resizeObserver.disconnect();
		}
	});

	resizeObserver.observe(bodyEditorEl);
};

export const createMailSchedulingCoachmark = async (API, translator, parent, onConfirm) => {
	const iamClient = await API.componentLoader.load('iam-client');

	mailSchedulingCoachmark = new iamClient.Coachmark({
		tag: 'schedule_email',
		parent,
		content: translator.gettext('You can schedule to send these emails later'),
		detached: true,
		parentContainer: parent.closest('.cui4-modal'),
		appearance: {
			zIndex: { above: '.cui4-modal' },
			placement: 'bottomLeft',
			align: {
				points: ['tr', 'br'],
				offset: [12, 12]
			}
		},
		onReady: (data) => {
			if (data.active) addBodyEditorResizeObserver(mailSchedulingCoachmark);
		},
		onConfirm: () => {
			mailSchedulingCoachmark.close();
			onConfirm();
		}
	});
};

export const getMailSchedulingCoachmark = () => mailSchedulingCoachmark;
export const getGroupEmailCoachmarkInstance = () => groupEmailCoachmarkInstance;
