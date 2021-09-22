import createFeedbackForCortana from 'owa-cortana-compose/lib/actions/createFeedbackForCortana';
import { newMessageV3 } from 'owa-mail-actions/lib/composeActions';
import { orchestrator } from 'satcheljs';

export default orchestrator(createFeedbackForCortana, actionMessage => {
    const { source, groupId, toRecipients, subject, body } = actionMessage;

    newMessageV3(source, groupId, toRecipients, subject, body);
});
