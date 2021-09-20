import { applySocketUpdates } from 'app/gamma/src/modules/state/apply-socket-updates';
import createStore from './store';

// eslint-disable-next-line @trello/no-module-logic
export const defaultStore = createStore([applySocketUpdates]);
