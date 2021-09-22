import { ThunkAction } from 'redux-thunk';
import { getViewerDeals } from '../api/viewer';
import { DEALS_TO_LOAD } from '../utils/constants';
import { getSelectedLink } from '../selectors/links';
import sortDealsByActivityNextDate from '../utils/sortDealsByActivityNextDate';
import { isLoading, getLoadedDealsCount } from '../selectors/deals';
import { SetDealsRequestAction, SetDealsSuccessAction, SetDealsFailureAction } from './deals';
import { SetSummariesAction } from './summary';
import { DealActionTypes } from './deals.enum';

export const fetchViewerDeals =
	(
		limit: number = DEALS_TO_LOAD,
	): ThunkAction<
		void,
		PipelineState,
		null,
		SetDealsRequestAction | SetDealsSuccessAction | SetDealsFailureAction | SetSummariesAction
	> =>
	async (dispatch, getState) => {
		const state = getState();
		const loadedDealsCount = getLoadedDealsCount(state);
		const linkHash = getSelectedLink(state as Viewer.State).hash;

		if (isLoading(state)) {
			return;
		}

		dispatch({
			type: DealActionTypes.SET_DEALS_REQUEST,
			payload: {
				limit,
			},
		});

		try {
			const { deals = [], additionalData } = await getViewerDeals(linkHash, limit, loadedDealsCount);

			dispatch({
				type: DealActionTypes.SET_DEALS_SUCCESS,
				// Deals endpoint returns 'null' in case there is no data for the given pipeline + filter combination
				payload: {
					deals: deals ? sortDealsByActivityNextDate(deals) : [],
					mergeWithCurrentState: loadedDealsCount > 0,
					hasMore: additionalData ? additionalData.pagination.more_items_in_collection : false,
				},
			});
		} catch (error) {
			dispatch({
				type: DealActionTypes.SET_DEALS_FAILURE,
				error,
			});
		}
	};
