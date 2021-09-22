import { bindActionCreators, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { fetchAllStatistics } from './summary';

export enum SocketActionTypes {
	SOCKET_UPDATE_DEFAULT_CURRENCY = 'SOCKET_UPDATE_DEFAULT_CURRENCY',
}

export type SocketUpdateDefaultCurrency = Action<SocketActionTypes.SOCKET_UPDATE_DEFAULT_CURRENCY>;

export type SocketSettingsActions = SocketUpdateDefaultCurrency;

export const socketUpdateDefaultCurrency =
	(): ThunkAction<void, PipelineState, null, SocketUpdateDefaultCurrency> => (dispatch) => {
		const actions = bindActionCreators({ fetchAllStatistics }, dispatch);

		actions.fetchAllStatistics({ includeGoals: false });
	};
