'use es6';

import { connect } from 'react-redux';
import compose from 'transmute/compose';
import CallWidgetFooter from '../components/CallWidgetFooter';
import { getIsCallProviderReady } from '../../selectors/getIsCallProviderReady';
import { getSelectedCallableObjectFromState } from '../../active-call-settings/selectors/getActiveCallSettings';

var mapStateToProps = function mapStateToProps(state) {
  return {
    isReady: getIsCallProviderReady(state)
  };
};

export default compose(connect(function (state) {
  return {
    selectedCallableObject: getSelectedCallableObjectFromState(state)
  };
}), connect(mapStateToProps))(CallWidgetFooter);