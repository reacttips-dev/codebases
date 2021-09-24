'use es6';

import { Record } from 'immutable';
import ChannelDetails from '../../channel-details/records/ChannelDetails';
export default Record({
  assignedAgentId: null,
  channelDetails: ChannelDetails(),
  currentUrl: null,
  latestMessageTimestamp: 0,
  latestReadTimestamp: 0,
  responder: null,
  source: null,
  status: null,
  threadId: null,
  unseenCount: 0,
  hasFileAttachment: false,
  previewText: null,
  previewMessageId: null
}, 'Thread');