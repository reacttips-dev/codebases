'use es6';

import { connect } from 'react-redux';
import { getCurrentView } from './selectors/getCurrentView';
import CurrentView from './CurrentView';

var mapStateToProps = function mapStateToProps(state) {
  return {
    currentView: getCurrentView(state)
  };
};

export default connect(mapStateToProps)(CurrentView);