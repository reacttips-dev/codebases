'use es6';

import { connect } from 'react-redux';
import { getChatHeadingConfig } from '../../chat-heading-config/selectors/getChatHeadingConfig';
import { getChatHeadingResponders } from '../../responders/selectors/getChatHeadingResponders';
import { getInitialMessageText } from '../../selectors/widgetDataSelectors/getInitialMessageText';
import { getIsMobile } from '../../selectors/getIsMobile';
import { closeInitialMessageBubble } from '../actions/closeInitialMessageBubble';
import InitialMessageBubble from 'conversations-visitor-experience-components/visitor-widget/InitialMessageBubble';

var mapStateToProps = function mapStateToProps(state) {
  return {
    chatHeadingConfig: getChatHeadingConfig(state),
    chatHeadingResponders: getChatHeadingResponders(state),
    initialMessage: getInitialMessageText(state),
    mobile: getIsMobile(state)
  };
};

var mapDispatchToProps = {
  onClose: closeInitialMessageBubble
};
export default connect(mapStateToProps, mapDispatchToProps)(InitialMessageBubble);