'use es6';

import { connect } from 'react-redux';
import compose from 'transmute/compose';
import { getCallDispositionsFromState } from '../selectors/getCallDispositions';
import { withCallDispositions } from '../decorators/RequireCallDispositions';
import CallDispositionsSelect from '../components/CallDispositionsSelect';
import { setCallDisposition } from '../../engagement/actions/engagementActions';
import { getAppIdentifierFromState } from '../../active-call-settings/selectors/getActiveCallSettings';

var mapStateToProps = function mapStateToProps(state) {
  return {
    options: getCallDispositionsFromState(state),
    appIdentifier: getAppIdentifierFromState(state)
  };
};

var mapDispatchToProps = {
  setCallDisposition: setCallDisposition
};
export default compose(connect(mapStateToProps, mapDispatchToProps), withCallDispositions(function (data) {
  return {
    options: data
  };
}))(CallDispositionsSelect);