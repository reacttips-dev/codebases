'use es6';

import { connect } from 'react-redux';
import { getThirdPartyCallingStatus } from '../../third-party-calling/selectors/thirdPartyCallingSelectors';
import WidgetAlerts from '../components/WidgetAlerts';

var mapStateToProps = function mapStateToProps(state) {
  return {
    thirdPartyStatus: getThirdPartyCallingStatus(state)
  };
};

export default connect(mapStateToProps)(WidgetAlerts);