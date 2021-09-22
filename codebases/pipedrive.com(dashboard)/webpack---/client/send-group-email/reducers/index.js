import { combineReducers } from 'redux';
import messages from './messages';
import relatedObjects from './related-objects';
import recoverableRecipients from './recoverable-recipients';
import validatedEmails from './validated-emails';
import attachments from './attachments';

export default combineReducers({
	messages,
	relatedObjects,
	recoverableRecipients,
	validatedEmails,
	attachments
});
