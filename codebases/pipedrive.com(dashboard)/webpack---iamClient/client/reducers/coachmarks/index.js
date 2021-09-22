import Immutable from 'seamless-immutable';
import { find, without } from 'lodash';
import * as actions from 'actions/coachmarks';

const initialState = Immutable.from({
	all: null,
	fetching: false,
	queue: [],
	unquequed: [],
	suppressed: false,
});

export const normalize = (cm) => {
	if (!cm) {
		return;
	}

	return Object.assign({}, cm, {
		active: cm.active || cm.activeFlag,
		important: cm.important || cm.importantFlag || false,
		isSavedInServer: cm.isSavedInServer || false,
		priority: cm.priority || 0,
	});
};

// eslint-disable-next-line complexity
export default function(state = initialState, action) {
	switch (action.type) {
		case actions.COACHMARKS_REQUEST:
			return Immutable.merge(state, {
				fetching: true,
			});
		case actions.COACHMARKS_RECEIVE:
			return Immutable.merge(state, {
				fetching: false,
				all: state.all ? state.all.concat(action.results.map(normalize)) : action.results.map(normalize),
				queue: state.queue.map((cm) => {
				/*
					Replace placeholder in a queue with an actual CM data
					if it is available in the newly arrived data
				*/
					return normalize(find(action.results, { tag: cm.tag })) || cm;
				}),
			});
		case actions.COACHMARKS_CLOSE:
			return Immutable.merge(state, {
				all: without(state.all, find(state.all, { tag: action.tag })),
				queue: without(state.queue, find(state.queue, { tag: action.tag })),
				unquequed: without(state.unquequed, find(state.unquequed, { tag: action.tag })),
			});
		case actions.COACHMARKS_NOTIFY:
			return Immutable.merge(state, {
				all: state.all.map((cm) => {
					if (cm.tag === action.tag) {
						return Object.assign({}, cm, {
							tag: action.tag,
							isSavedInServer: true,
						});
					} else {
						return cm;
					}
				}),
			});
		case actions.COACHMARKS_ENQUEUE:
			return Immutable.merge(state, {
				unquequed: without(state.unquequed, find(state.unquequed, { tag: action.tag })),
				queue: state.queue.concat(
				/*
					Enqueue a coachmark from a list of fetched coachmark
					or put a placeholder whilst it is still to be fetched
				*/
					find(state.all, { tag: action.tag }) || { tag: action.tag },
				),
			});
		case actions.COACHMARKS_UNQUEUE:
			return Immutable.merge(state, {
				unquequed: state.unquequed.concat(
					find(state.all, { tag: action.tag }) || { tag: action.tag },
				),
				queue: without(state.queue, find(state.queue, { tag: action.tag })),
			});
		case actions.COACHMARKS_DROP_QUEUE:
			return Immutable.merge(state, {
				queue: state.queue.filter(item => !!item.keepDuringNavigation),
			});
		case actions.COACHMARKS_SUPPRESS:
			return Immutable.merge(state, {
				suppressed: action.suppressed,
			});
		default:
			return state;
	}
}
