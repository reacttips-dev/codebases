const createHistory = require('history').createBrowserHistory;

// Create an enhanced history that syncs navigation events with the store
const history = createHistory();

export { history };
