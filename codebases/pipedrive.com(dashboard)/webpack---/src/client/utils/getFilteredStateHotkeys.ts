import { NavigationState, RemoveHotkeys } from '../store/navigation/types';
import { ViewState, RemoveHotkeysAction } from '../tools/ContextualView/store/types';

function getFilteredStateHotkeys(state: NavigationState | ViewState, action: RemoveHotkeys | RemoveHotkeysAction) {
	return state.hotkeys.filter((item) => item.hotkeys !== action.hotkeys && item.callback !== action.callback);
}

export default getFilteredStateHotkeys;
