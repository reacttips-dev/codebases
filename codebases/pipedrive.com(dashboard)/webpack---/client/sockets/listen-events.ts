import { bindActionCreators, Dispatch } from 'redux';
import { socketAddDeal, SocketDealActions, socketDeleteDeal, socketUpdateDeal } from '../actions/deals-sockets';
import {
	socketAddDeal as forecastSocketAddDeal,
	socketDeleteDeal as forecastSocketDeleteDeal,
	socketUpdateDeal as forecastSocketUpdateDeal,
} from '../forecast-view/actions/deals-sockets';
import { socketUpdateDefaultCurrency, SocketSettingsActions } from '../actions/settings-sockets';
import { ViewTypes } from '../utils/constants';

import { store as forecastStore } from '../forecast-view/store';
import { getDealPeriodIndex } from '../forecast-view/selectors/deals';
import { getShowByOption } from '../forecast-view/selectors/settings';

const dispatchDealAction = (
	alertAction: Pipedrive.ISocketEvent['alert_action'],
	dispatch: Dispatch<SocketDealActions>,
	event: Pipedrive.ISocketEvent,
): undefined => {
	const actions = bindActionCreators({ socketAddDeal, socketUpdateDeal, socketDeleteDeal }, dispatch);
	const matchesFilters = event._meta.matches_filters ? event._meta.matches_filters.current : [];
	const originatingUserId = event._meta.user_id || 0;
	const userAgent = event._meta.user_agent;

	switch (alertAction) {
		case 'added':
			actions.socketAddDeal(event.current, matchesFilters);
			return;
		case 'updated':
			actions.socketUpdateDeal(event.current, matchesFilters, event.previous, originatingUserId, userAgent);
			return;
		case 'deleted':
			actions.socketDeleteDeal(event.previous);
			return;
		default:
			return;
	}
};

const dispatchForecastDealAction = (
	alertAction: Pipedrive.ISocketEvent['alert_action'],
	dispatch: Dispatch<SocketDealActions>,
	event: Pipedrive.ISocketEvent,
): undefined => {
	const state = forecastStore && forecastStore.getState();
	const actions = bindActionCreators(
		{ forecastSocketUpdateDeal, forecastSocketAddDeal, forecastSocketDeleteDeal },
		dispatch,
	);
	const matchesFilters = event._meta.matches_filters ? event._meta.matches_filters.current : [];
	const originatingUserId = event._meta.user_id || 0;
	const userAgent = event._meta.user_agent;

	switch (alertAction) {
		case 'added': {
			const dealPeriodIndex = getDealPeriodIndex(state, event.current);
			const dealStatus = event.current.status;

			let showBy = getShowByOption(state);

			if (dealStatus === 'won') {
				showBy = 'won_time';
			}

			actions.forecastSocketAddDeal(event.current, dealPeriodIndex, event.current[showBy], matchesFilters);

			return;
		}
		case 'updated':
			actions.forecastSocketUpdateDeal(
				event.current,
				matchesFilters,
				event.previous,
				originatingUserId,
				userAgent,
			);
			return;
		case 'deleted': {
			const previousDealPeriodIndex = getDealPeriodIndex(state, event.previous);

			actions.forecastSocketDeleteDeal(event.previous, previousDealPeriodIndex);

			return;
		}
		default:
			return;
	}
};

const dispatchSettingAction = (
	alertAction: Pipedrive.ISocketEvent['alert_action'],
	dispatch: Dispatch<SocketSettingsActions>,
): undefined => {
	const actions = bindActionCreators({ socketUpdateDefaultCurrency }, dispatch);

	switch (alertAction) {
		case 'updated':
			actions.socketUpdateDefaultCurrency();
			return;
		default:
			return;
	}
};

export default (
	socketHandler: Pipedrive.ISocketHandler,
	dispatch: Dispatch<SocketDealActions | SocketSettingsActions>,
	viewType: ViewTypes,
) => {
	function eventHandler(event: Pipedrive.ISocketEvent) {
		switch (event.alert_type) {
			case 'deal':
				if (ViewTypes.FORECAST === viewType) {
					return dispatchForecastDealAction(event.alert_action, dispatch, event);
				} else {
					return dispatchDealAction(event.alert_action, dispatch, event);
				}
			case 'userSetting':
				if (ViewTypes.FORECAST !== viewType) {
					return dispatchSettingAction(event.alert_action, dispatch);
				}
				return;
			default:
				return;
		}
	}

	socketHandler.on('api.', eventHandler);

	return function () {
		socketHandler.off('api.', eventHandler);
	};
};
