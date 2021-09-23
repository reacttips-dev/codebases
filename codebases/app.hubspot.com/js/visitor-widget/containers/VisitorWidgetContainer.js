'use es6';

import { connect } from 'react-redux';
import VisitorWidget from 'conversations-visitor-experience-components/visitor-widget/components/VisitorWidget';
import I18n from 'I18n';
import { republishMessage } from '../../actions/PublishActions/republishMessage';
import { getChatHeadingConfig } from '../../chat-heading-config/selectors/getChatHeadingConfig';
import { showAvailabilityMessageInWidget } from '../../availability/selectors/showAvailabilityMessageInWidget';
import { getAvailabilityOfficeHoursWillReturnMessage } from '../../availability/selectors/getAvailabilityOfficeHoursWillReturnMessage';
import { getAvailabilityTypicalResponseTimeMessage } from '../../availability/selectors/getAvailabilityTypicalResponseTimeMessage';
import { navigateToStagedThread } from '../../navigation/actions/navigateToStagedThread';
import { getAssignedResponderInWidget } from '../../responders/selectors/getAssignedResponderInWidget';
import { getChatHeadingResponders } from '../../responders/selectors/getChatHeadingResponders';
import { getColoring } from '../../selectors/widgetDataSelectors/getColoring';
import { getSelectedThread } from '../../selected-thread/selectors/getSelectedThread';
import { getIsMobile } from '../../selectors/getIsMobile';
import { calculateUnseenThreadsCountExcludeCurrent } from '../../threads/selectors/calculateUnseenThreadsCountExcludeCurrent';
import { getShowBackButton } from '../../threads/selectors/getShowBackButton';
import { getWidgetLocation } from '../../selectors/widgetDataSelectors/getWidgetLocation';
import { navigateToThreadList } from '../../navigation/actions/navigateToThreadList';
import { getKnowledgeBaseEnabled } from '../../selectors/widgetDataSelectors/getKnowledgeBaseEnabled';
import { getShouldResizeContainer } from '../../visitor-widget/selectors/getShouldResizeContainer';
import { isCreatingThread } from '../../thread-create/selectors/stagedThreadSelectors';

var mapStateToProps = function mapStateToProps(state) {
  return {
    chatHeadingConfig: getChatHeadingConfig(state),
    chatHeadingResponders: getChatHeadingResponders(state),
    coloring: getColoring(state),
    customHeaderText: getKnowledgeBaseEnabled(state) ? I18n.text('conversations-visitor-ui.knowledgeBaseContainer.headerText') : null,
    isThreadAssigned: Boolean(getAssignedResponderInWidget(state)),
    mobile: getIsMobile(state),
    officeHoursMessage: getAvailabilityOfficeHoursWillReturnMessage(state),
    showAvailabilityMessage: showAvailabilityMessageInWidget(state, {
      thread: getSelectedThread(state)
    }),
    showBackButton: getShowBackButton(state),
    backButtonDisabled: isCreatingThread(state),
    typicalResponseTimeMessage: getAvailabilityTypicalResponseTimeMessage(state),
    unseenThreadsCountExcludingCurrentThread: calculateUnseenThreadsCountExcludeCurrent(state),
    widgetLocation: getWidgetLocation(state),
    shouldResizeContainer: getShouldResizeContainer(state)
  };
};

var mapDispatchToProps = {
  fetchAgentResponderIfNecessary: function fetchAgentResponderIfNecessary() {},
  createNewThread: navigateToStagedThread,
  republishMessage: republishMessage,
  navigateToThreadList: navigateToThreadList
};
export default connect(mapStateToProps, mapDispatchToProps)(VisitorWidget);