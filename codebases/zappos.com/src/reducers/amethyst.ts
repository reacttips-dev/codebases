import { CLEAR_EVENT_QUEUE, STORE_EVENT_IN_QUEUE } from 'constants/reduxActions';
import { AmethystEvent } from 'actions/amethyst';
import { AppAction } from 'types/app';

export type AmethystState = {
  queue: AmethystEvent[];
};

const initialState: AmethystState = {
  queue: []
};

export default function amethyst(state: Readonly<AmethystState> = initialState, action: AppAction): AmethystState {
  switch (action.type) {
    case STORE_EVENT_IN_QUEUE:
      const { event } = action;
      const newQueue = [ ...state.queue ];
      newQueue.push(event);
      return { ...state, queue: newQueue };
    case CLEAR_EVENT_QUEUE:
      return { ...state, queue: initialState.queue };
    default:
      return state;
  }
}
