import { useEffect } from 'react';

const IAM_CLIENT = 'iam-client';

export const getConferenceMeetingCoachmarkOptions = ({
	integrationInstalled,
	detached,
	translator,
	actions = [],
}) => {
	const width = integrationInstalled ? 310 : 248;
	const appearance = detached
		? {
				placement: 'topRight',
				zIndex: 6001,
				align: {
					points: ['bl', 'tl'],
					offset: [0, -5],
				},
				width,
		  }
		: {
				placement: 'top',
				width,
		  };

	const commonOptions = {
		detached,
		appearance,
		actions,
	};

	if (integrationInstalled) {
		return {
			...commonOptions,
			tag: 'meeting_integration_zoom_installed',
			content: translator.gettext(
				'You now have everything set up to start scheduling video calls from Pipedrive',
			),
		};
	}

	return {
		...commonOptions,
		tag: 'meeting_integration_zoom_not_installed',
		content: translator.gettext('You can now create video call meeting links from Pipedrive'),
	};
};

let iamClient;

class Coachmark {
	constructor(webappApi, el) {
		this.webappApi = webappApi;
		this.el = el;

		this.remove = this.remove.bind(this);
		this.close = this.close.bind(this);
	}

	async loadIamClient() {
		if (!iamClient) {
			iamClient = await this.webappApi.componentLoader.load(IAM_CLIENT);
		}
	}

	async addCoachmark({ content, tag, appearance, detached, actions = [] }) {
		await this.loadIamClient();

		const actionsWithCloseCoachmark = actions.length
			? {
					actions: actions.map((action) => ({
						...action,
						handler: () => {
							action.handler && action.handler();
							this.close();
						},
					})),
			  }
			: {};

		try {
			this.coachmark = new iamClient.Coachmark({
				tag,
				parent: this.el,
				appearance,
				content,
				detached,
				...actionsWithCloseCoachmark,
				__debug: false,
			});
		} catch (error) {
			this.coachmark = null;
		}
	}

	remove() {
		this.coachmark && this.coachmark.remove();
	}

	close() {
		this.coachmark && this.coachmark.close();
	}
}

const useCoachmarkEffect = ({ webappApi, elRef, setCoachmark, options }) => {
	useEffect(() => {
		const coachmark = new Coachmark(webappApi, elRef.current);

		coachmark.addCoachmark(options);
		setCoachmark && setCoachmark(coachmark);

		return () => {
			coachmark.remove();
		};
	}, []);
};

export default useCoachmarkEffect;
