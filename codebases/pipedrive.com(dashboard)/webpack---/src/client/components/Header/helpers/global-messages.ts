let globalMessages = null;

function setStyles(el) {
	return function () {
		const containerHeight = el.children.item(0) ? el.children.item(0).offsetHeight : 0;
		const ids = ['main-content', 'froot-header', 'froot-nav'];

		ids.map((id) => {
			document.getElementById(id).setAttribute('style', `top: ${containerHeight}px`);
		});

		document
			.getElementById('content-wrapper')
			.setAttribute('style', `grid-template-rows: 56px calc(100vh - (56px + ${containerHeight}px))`);

		window.app.global.fire('ui.event.globalmessages.render', null);
	};
}

export function forceFetch() {
	if (!globalMessages) {
		return;
	}

	globalMessages.forceFetch();
}

export async function initGlobalMessages(componentLoader, el) {
	if (!globalMessages) {
		const [userSelf, socketHandler, router, pdMetrics] = await Promise.all([
			componentLoader.load('webapp:user'),
			componentLoader.load('webapp:socket-handler'),
			componentLoader.load('froot:router'),
			componentLoader.load('webapp:metrics'),
		]);

		const proactiveGMFeature = userSelf?.companyFeatures.get('proactive_global_messages');
		const component = proactiveGMFeature ? 'proactive-feed-ui:globalMessages' : 'global-messages';
		const GlobalMessages = await componentLoader.load(component);

		globalMessages = new GlobalMessages({
			el,
			api: { userSelf, socketHandler, router, pdMetrics },
			onTransitionEnd: setStyles(el),
			hasUnsupportedBrowser: false,
		});

		globalMessages.render();
	}
}
