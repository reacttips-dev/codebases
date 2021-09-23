'use es6';

import { connect } from 'react-redux';
import FromUrlPanel from '../../components/browser/FromUrlPanel';
import { goBack } from '../../actions/Actions';

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return {
    onBack: function onBack() {
      dispatch(goBack());
    }
  };
};

export default connect(null, mapDispatchToProps)(FromUrlPanel);