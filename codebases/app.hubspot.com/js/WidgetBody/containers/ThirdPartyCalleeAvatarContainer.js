'use es6';

import { connect } from 'react-redux';
import ThirdPartyCalleeAvatar from '../components/ThirdPartyCalleeAvatar';
import { getSelectedCallableObjectFromState } from '../../active-call-settings/selectors/getActiveCallSettings';
import { getPortalIdFromState } from '../../Auth/selectors/authSelectors';

var mapStateToProps = function mapStateToProps(state) {
  return {
    selectedCallableObject: getSelectedCallableObjectFromState(state),
    portalId: getPortalIdFromState(state)
  };
};

export default connect(mapStateToProps)(ThirdPartyCalleeAvatar);