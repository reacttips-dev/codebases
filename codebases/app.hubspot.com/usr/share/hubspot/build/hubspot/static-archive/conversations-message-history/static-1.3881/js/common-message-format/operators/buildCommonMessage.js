'use es6';

import { fromJS } from 'immutable';
import compose from 'transmute/compose';
import getIn from 'transmute/getIn';
import { generateUuid } from '../../util/generateUuid';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { STATUS } from '../constants/keyPaths';
import CommonMesage from '../records/CommonMessage';
import { buildAttachments } from './buildAttachments';
import { buildStatus } from './buildStatus';
import { getId, getTimestamp } from './commonMessageFormatGetters';
import { setAttachments, setId, setStatus, setTimestamp } from './commonMessageFormatSetters';
import { setMessageDirection, setRecipients, setSenders } from './commonMessageSetters';
import { buildRecipients } from './buildRecipients';
import { buildSenders } from './buildSenders';
export var buildCommonMessage = function buildCommonMessage() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var status = buildStatus(getIn(STATUS, props));
  var attachments = buildAttachments(props.attachments);
  var recipients = buildRecipients(props.recipients);
  var senders = buildSenders(props.senders);
  var messageDirection = props.messageDirection || '';
  var id = getId(props) || generateUuid();
  var timestamp = getTimestamp(props) || generateUniqueClientTimestamp('buildCommonMessage-timestamp');
  return compose(setId(id), setStatus(status), setAttachments(attachments), setTimestamp(timestamp), setRecipients(recipients), setSenders(senders), setMessageDirection(messageDirection))(CommonMesage(fromJS(props)));
};