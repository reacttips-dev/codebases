import { List, Map as ImmutableMap, Record } from 'immutable';
import { EMAIL_METADATA } from '../constants/attachmentTypes';
var EmailMetadata = Record({
  '@type': EMAIL_METADATA,
  to: List(),
  cc: List(),
  bcc: List(),
  clipStatus: '',
  from: ImmutableMap({
    name: '',
    email: ''
  }),
  subject: '',
  connectedAccountAddress: '',
  hasReplies: false,
  previousRepliesHtml: null,
  previousRepliesPlainText: null,
  originalSender: ImmutableMap({
    name: '',
    email: ''
  }),
  memberOfForwardedSubthread: false,
  forward: false
}, 'EmailMetadata');
export default EmailMetadata;