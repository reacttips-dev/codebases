import { createBrowserHistory, History } from 'history';

export type HistoryState = { hasBeenBlocked?: boolean };
export type InternalHistory = History<HistoryState>;
export default createBrowserHistory() as InternalHistory;
