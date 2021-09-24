'use es6';

import { fromJS, List } from 'immutable';
import compose from 'transmute/compose';
import reduce from 'transmute/reduce';
import Status from '../../common-message-format/records/Status';
import { generateUuid } from '../../util/generateUuid';
import { generateUniqueClientTimestamp } from '../../util/timestamps';
import { ATTACHMENT_TYPE_ID, MENTIONS, FILES } from '../constants/attachmentTypes';
import CommentMessage from '../records/CommentMessage';
import { getId, getStatus, getTimestamp } from './commentMessageGetters';
import { setAttachments, setId, setStatus, setTimestamp } from './commentMessageSetters';
import { buildSenders } from '../../common-message-format/operators/buildSenders';
import { setSenders } from '../../common-message-format/operators/commonMessageSetters';
export var buildCommentMessage = function buildCommentMessage() {
  var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var status = Status(getStatus(attrs));
  var _attrs$attachments = attrs.attachments,
      attachments = _attrs$attachments === void 0 ? [] : _attrs$attachments,
      _attrs$senders = attrs.senders,
      senders = _attrs$senders === void 0 ? [] : _attrs$senders;
  var attachmentsList = reduce(List(), function (attachmentList, attachment) {
    var attachmentType = attachment[ATTACHMENT_TYPE_ID];
    return attachmentType === MENTIONS || attachmentType === FILES ? attachmentList.push(fromJS(attachment)) : attachmentList;
  }, attachments);
  var id = getId(attrs) || generateUuid();
  var timestamp = getTimestamp(attrs) || generateUniqueClientTimestamp('buildCommentMessage-timestamp');
  var sendersList = buildSenders(senders);
  return compose(setId(id), setStatus(status), setAttachments(attachmentsList), setTimestamp(timestamp), setSenders(sendersList))(CommentMessage(fromJS(attrs)));
};