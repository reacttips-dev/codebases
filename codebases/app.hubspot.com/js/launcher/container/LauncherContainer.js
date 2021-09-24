'use es6';

import { connect } from 'react-redux';
import { calculateUnseenThreadsCount } from '../../threads/selectors/calculateUnseenThreadsCount';
import { getColoring } from '../../selectors/widgetDataSelectors/getColoring';
import { getIsOpen } from '../../selectors/getIsOpen';
import { getShowLauncherBadge } from '../../visitor-widget/selectors/getShowLauncherBadge';
import Launcher from 'conversations-visitor-experience-components/visitor-widget/Launcher';

var mapStateToProps = function mapStateToProps(state) {
  return {
    badgeNumber: calculateUnseenThreadsCount(state),
    coloring: getColoring(state),
    open: getIsOpen(state),
    showBadge: getShowLauncherBadge(state)
  };
};

export default connect(mapStateToProps)(Launcher);