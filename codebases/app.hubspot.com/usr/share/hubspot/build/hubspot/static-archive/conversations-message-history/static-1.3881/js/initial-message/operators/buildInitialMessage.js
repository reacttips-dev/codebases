'use es6';

import { fromJS, Map as ImmutableMap } from 'immutable';
import get from 'transmute/get';
import { buildAttachments } from '../../common-message-format/operators/buildAttachments';
import Status from '../../common-message-format/records/Status';
import { generateUuid } from '../../util/generateUuid';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import InitialMessage from '../records/InitialMessage';
export var buildInitialMessage = function buildInitialMessage() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var timestamp = get('timestamp', props);
  return InitialMessage({
    id: get('id', props) || generateUuid(),
    sender: ImmutableMap(fromJS(get('sender', props))),
    status: Status(get('status', props)),
    attachments: buildAttachments(get('attachments', props)),
    clientType: get('clientType', props),
    richText: get('richText', props),
    text: get('text', props),
    timestamp: timestamp || generateUniqueClientTimestamp()
  });
};