'use es6';

import pipe from 'transmute/pipe';
import get from 'transmute/get';
import PortalIdParser from 'PortalIdParser';
import ConversationStatusTypes from 'conversations-internal-schema/constants/ConversationStatusTypes';
import ThreadPreviewRecord from 'conversations-internal-schema/thread-preview/records/ThreadPreviewRecord';
import Thread from '../records/Thread';
import { setDefaultValues, enforceValues } from 'conversations-message-history/util/propertyValues';
import ChannelDetails from '../../channel-details/records/ChannelDetails';
/**
 * Build a Thread record from an JavaScript or Immutable object.
 *
 * @param {Object|Map|Thread} [props={}] - Properties to build the conversation from
 * @return {Thread}
 *
 */

export function buildThread() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var props = Object.assign({}, _ref);
  return pipe(setDefaultValues({
    portalId: PortalIdParser.get(),
    status: ConversationStatusTypes.STARTED
  }), enforceValues({
    unseenCount: get('unseenCount', props) || 0,
    threadPreview: ThreadPreviewRecord(get('threadPreview', props)),
    channelDetails: ChannelDetails(get('channelDetails', props))
  }), Thread)(props);
}