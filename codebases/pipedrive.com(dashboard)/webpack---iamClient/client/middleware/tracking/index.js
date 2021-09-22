import Sesheta from '@pipedrive/pdw-sesheta';
import { debounce } from 'lodash';
import pdMetrics from 'utils/pdMetrics';

const debouncedHandlers = {};

function makeSesheta() {
	const conf = (window && window.app && window.app.config && window.app.config.sesheta) || { id: 'SESHETA_ID', key: 'SESHETA_KEY' };

	return new Sesheta(conf);
}

export const sendSeshetaEvent = (name, data, user) => {
	const seshetaClient = makeSesheta();
	const userAgent = {
		ua_name: navigator.userAgent,
		ua_ver: navigator.appVersion,
		ua_os_name: navigator.platform,
	};

	seshetaClient.addEvent({
		name: `iam-client.${name}`,
		data: {
			...user,
			...userAgent,
			page_url: window.location.href,
			time: Date.now(),
			data,
		},
	});
};

export default store => next => action => {
	if (!action.meta) {
		return next(action);
	}

	const { user } = store.getState();
	const normalizedUserData = {
		user_id: user.userId,
		company_id: user.companyId,
		user_lang: user.userLang,
	};

	if (action.meta.sesheta) {
		const eventName = action.meta.sesheta.name;
		const debounceTime = action.meta.sesheta.debounce;
		const eventArguments = [eventName, action.meta.sesheta.data, normalizedUserData];

		if (debounceTime) {
			if (!debouncedHandlers[eventName]) {
				debouncedHandlers[eventName] = debounce((...params) => {
					sendSeshetaEvent(...params);
					debouncedHandlers[eventName] = null;
				}, debounceTime);
			}

			debouncedHandlers[eventName](...eventArguments);
		} else {
			sendSeshetaEvent(...eventArguments);
		}
	}

	if (action.meta.amplitude) {
		const debounceTime = action.meta.amplitude.debounce;
		const eventInfo = action.meta.amplitude.event;
		const eventArguments = [
			null,
			eventInfo.component,
			eventInfo.action,
			{ ...normalizedUserData, ...action.meta.amplitude.data },
		];

		if (debounceTime) {
			const debounceId = `${eventInfo.component}.${eventInfo.action}`;

			if (!debouncedHandlers[debounceId]) {
				debouncedHandlers[debounceId] = debounce((...params) => {
					pdMetrics.trackUsage(...params);
					debouncedHandlers[debounceId] = null;
				}, debounceTime);
			}

			debouncedHandlers[debounceId](...eventArguments);
		} else {
			pdMetrics.trackUsage(...eventArguments);
		}
	}

	next(action);
};
