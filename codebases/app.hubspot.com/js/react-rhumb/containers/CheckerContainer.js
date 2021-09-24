'use es6';

import { connect } from 'react-redux';
import { getWidgetStartOpen } from '../../widget-ui/selectors/getWidgetStartOpen';
import { getWidgetDataAsyncData } from '../../widget-data/selectors/getWidgetDataAsyncData';
import { getThreadsAsyncData } from '../../threads/selectors/getThreadsAsyncData';
import Checker from '../components/Checker';

var mapStateToProps = function mapStateToProps(state) {
  return {
    startOpen: getWidgetStartOpen(state),
    threadsAsyncData: getThreadsAsyncData(state),
    widgetDataAsyncData: getWidgetDataAsyncData(state)
  };
};

export default connect(mapStateToProps)(Checker);