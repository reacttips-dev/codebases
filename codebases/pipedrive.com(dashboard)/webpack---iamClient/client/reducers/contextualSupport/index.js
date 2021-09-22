import { combineReducers } from 'redux';
import article from './article';
import search from './search';
import suggestions from './suggestions';
import sidebar from './sidebar';
import articleFeedback from './articleFeedback';

export default combineReducers({
	article,
	search,
	suggestions,
	sidebar,
	articleFeedback,
});
