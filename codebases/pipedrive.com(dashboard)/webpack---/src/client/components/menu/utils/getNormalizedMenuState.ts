import { MenuStateLocal, MenuStateUserSetting } from '../types';

/**
 * @summary Gets normalized menu state based on the local navigation.menuState
 * and the memoized state from user.settings.get('froot_menu_state')
 * adding missing keys to the final result if needed.
 */
export function getNormalizedMenuState(
	state: MenuStateLocal,
	memoizedState: MenuStateUserSetting[] = [],
): MenuStateLocal {
	if (!memoizedState.length) {
		return state;
	}

	const allKeys = Object.keys(state);
	const memoizedKeys = memoizedState.map(({ key }) => key);

	const missingState = allKeys.reduce((acc, key) => {
		if (memoizedKeys.includes(key)) {
			return acc;
		}

		return { ...acc, [key]: state[key] };
	}, {});

	const memoizedStateObject = memoizedState.reduce((acc, { key, value }) => {
		return { ...acc, [key]: value };
	}, {});

	return {
		...memoizedStateObject,
		...missingState,
	};
}
