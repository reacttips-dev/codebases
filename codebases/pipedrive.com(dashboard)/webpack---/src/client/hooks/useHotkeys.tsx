import { Dispatch, useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { addHotkeys, removeHotkeys } from '../store/navigation/actions';
import { addDrawerHotkeys, removeDrawerHotkeys } from '../tools/ContextualView/store/actions';

type Key = string;
export type Keys = Key[];
export type Callback = (event: KeyboardEvent) => void;

export interface StoredHotkeys {
	hotkeys: Keys;
	callback: Callback;
}

export function shouldTrigger(event: KeyboardEvent) {
	const element = event.target as HTMLElement;

	const isRepeating = event.repeat;
	const isInput = ['INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName) || element.isContentEditable;
	// CUI4 modals or elements with role="dialog" are in DOM
	const isModalOpen =
		document.querySelectorAll('.cui4-modal.cui4-modal--visible, [role="dialog"], .cui4-image-overlay').length !== 0;
	// Special inputs that are not input,select or textarea. For example CUI4 select.
	const isSpecialInput = !!element.closest('[role="textbox"], [role="combobox"]');

	if (isRepeating || isInput || isModalOpen || isSpecialInput) {
		return false;
	}

	return true;
}

export function useHotkeysRoot() {
	const store = useStore();

	useEffect(() => {
		const eventHandler = (event: KeyboardEvent) => {
			if (!shouldTrigger(event)) {
				return;
			}

			const state = store.getState();
			const hotkeys = state.hotkeys || state.navigation?.hotkeys;

			const matchingHotkeys = hotkeys.filter((hotkey) => hotkey.hotkeys.includes(event.key));

			matchingHotkeys.forEach((hotkey) => {
				hotkey.callback(event);
			});
		};

		document.addEventListener('keyup', eventHandler);

		return () => document.removeEventListener('keyup', eventHandler);
	}, []);
}

export function useDrawerHotkeys(keys: Key, callback: Callback, deps = []): void {
	const dispatch = useDispatch();

	useEffect(() => {
		const keysToBind = [keys];

		dispatch(addDrawerHotkeys(keysToBind, callback));

		return () => {
			dispatch(removeDrawerHotkeys(keysToBind, callback));
		};
	}, deps);
}

export default function useHotkeys(keys: Keys | Key, callback: Callback, deps = []): void {
	const dispatch = useDispatch();

	useEffect(() => {
		const keysToBind = Array.isArray(keys) ? keys : [keys];

		dispatch(addHotkeys(keysToBind, callback));

		return () => {
			dispatch(removeHotkeys(keysToBind, callback));
		};
	}, deps);
}

/**
 * READ ME FIRST BEFORE USING
 *
 * TL;DR:
 *
 * the 3rd argument, `dispatch`, should be created inside a component
 * **that gets rendered in froot**, meaning that going up the parent component tree,
 * the very first redux store will be froot's.
 *
 * See this PR for an example:
 * https://github.com/pipedrive/froot/pull/827/files#r702805919
 *
 * ---
 *
 * Problem: If a component takes in a custom hook,
 * and that hook calls `useDispatch` to get the dispatch,
 * the `useDispatch` function will resolve the dispatch
 * to the first parent redux store in it's component path.
 *
 * If the component has it's own redux store
 * and it is **not** the one you want to dispatch to (most likely),
 * then we have a bug, because the `dispatch` function
 * will dispatch to the wrong store.
 *
 * Solution: To fix this, you need to provide the dispatch function yourself,
 * and it **must** be created outside the scope of the inner component / inner redux store,
 * so that the dispatch points to our own store.
 *
 * ---
 *
 * note - in general, each repo/microFE should use a custom context, as explained in [1]:
 *
 * > The <Provider> component allows you to specify an alternate context via the context prop.
 * > This is useful if you're building a complex reusable component,
 * > and you don't want your store to collide with any Redux store your consumers' applications might use.
 *
 * And it's not hard to do at all!
 *
 * Though since we're not doing this yet (at least in search-fe),
 * the change might be a breaking one [2] (even if it would fix bugs),
 * thus will need need thorough if one wants to fix it for their service/microFE,
 * since others can get affected by it.
 *
 * Thus, before that is done (at least on search-fe),
 * this temporary fix should be a good work-around.
 *
 * [1] https://react-redux.js.org/api/hooks#custom-context
 * [2] https://xkcd.com/1172
 *
 */
export function useHotkeysWithCustomDispatch(
	keys: Keys | Key,
	callback: Callback,
	dispatch: Dispatch<any>,
	deps: any[] = [],
): void {
	useEffect(() => {
		const keysToBind = Array.isArray(keys) ? keys : [keys];

		dispatch(addHotkeys(keysToBind, callback));

		return () => {
			dispatch(removeHotkeys(keysToBind, callback));
		};
	}, deps);
}
