import Immutable from 'seamless-immutable';
import { reduce } from 'lodash';
import * as actions from 'actions/gettingStarted';

const initialState = Immutable.from({
	displayButton: true,
	displaySidebar: false,
	current: null,
	width: 'auto',
	stages: {
		signup_action: true,
		add_contact_action: false,
		add_deal_action: false,
		schedule_activity_action: false,
		drag_and_drop_deals_action: false,
	},
	suppressed: false,
});

export default function(state = initialState, action) {
	switch (action.type) {
		case actions.GETTINGSTARTED_SKIP:
			return Immutable.merge(state, {
				displayButton: false,
				displaySidebar: false,
			});
		case actions.GETTINGSTARTED_HIDE:
			return Immutable.merge(state, {
				displayButton: false,
				displaySidebar: false,
			});
		case actions.GETTINGSTARTED_TOGGLE:
			return Immutable.merge(state, {
				displaySidebar: action.displaySidebar,
				displayButton: !action.displaySidebar,
			});
		case actions.GETTINGSTARTED_ARTICLE_REQUEST:
			return Immutable.merge(state, {
				current: null,
			});
		case actions.GETTINGSTARTED_ARTICLE_RECEIVE:
			return Immutable.merge(state, {
				current: action.article,
				displayButton: false,
				displaySidebar: true,
			});
		case actions.GETTINGSTARTED_SAVE_WIDTH:
			return Immutable.merge(state, {
				width: action.width,
			});
		case actions.GETTINGSTARTED_COMPLETE_STAGE:
			return Immutable.merge(state, {
				stages: Object.assign({}, state.stages, reduce(action.stages, (stages, completedStage) => {
					stages[completedStage] = true;

					return stages;
				}, {})),
			});
		case actions.GETTINGSTARTED_SUPPRESS:
			return Immutable.merge(state, {
				suppressed: action.suppressed,
			});
		default:
			return state;
	}
}
