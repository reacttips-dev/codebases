import Lightbulb from '../Lightbulb';

export async function initProactive(componentLoader, el) {
	const ProactiveFeedUi = await componentLoader.load('proactive-feed-ui');

	return new ProactiveFeedUi({
		el,
		componentLoader,
		Lightbulb,
	});
}

let sidebar = null;

export const toggleSupport = (options = { searchQuery: '' }) => {
	if (sidebar) {
		sidebar.toggle(options.searchQuery);
	} else {
		const win = window.open('//support.pipedrive.com/', '_blank');

		win.focus();
	}
};

export const hideSupport = () => {
	if (sidebar) {
		sidebar.hide();
	}
};

export const toggleFlowView = () => {
	if (sidebar) {
		sidebar.toggleFlowView();
	}
};

export const initIamSidebar = (iamClient, usersSize, signupData, ref, isHVC) => {
	const sidebarParams = {
		...(isHVC ? {} : { gettingStarted: iamClient.GettingStartedV2 }),
		appearance: {
			zIndex: {
				above: '.proactive, .iamClient__GettingStartedV2',
			},
		},
		companySize: `${usersSize}` || null,
		userMotive: signupData?.formData?.user_motive || null,
	};

	sidebar = new iamClient.Sidebar(ref.current, sidebarParams);
	return sidebar;
};

export const initGettingStarted = (iamClient, usersSize, signupData, ref) => {
	const cm = new iamClient.Coachmark({
		tag: 'emnt_gettingStartedV2_toggleButton',
		onReady: () => {
			return new iamClient.GettingStartedV2({
				parent: ref.current,
				companySize: `${usersSize}` || null,
				userMotive: signupData?.formData?.user_motive || null,
				onHide: () => cm.close(),
			});
		},
	});

	return cm;
};

export const showGSCoachmark = (targetElement, iamClient, content) => {
	return new iamClient.Coachmark({
		tag: 'secondary_menu_hover',
		parent: targetElement.current,
		content,
		appearance: {
			placement: 'bottomLeft',
			zIndex: {
				min: 45,
			},
			align: {
				points: ['tr', 'bc'],
				offset: [27, 5],
			},
			width: 332,
		},
		detached: true,
	});
};
