'use es6';

import { bindActionCreators } from 'redux';
import memoize from 'transmute/memoize';
import * as ReactRedux from 'react-redux';
import SalesContentIndexUIReduxContext from 'SalesContentIndexUI/data/redux/SalesContentIndexUIReduxContext';
var memoizedBindActionCreators = memoize(bindActionCreators);

var emptyFunction = function emptyFunction() {
  return null;
};

export default (function (mapStateToProps, mapDispatchToProps) {
  mapStateToProps = mapStateToProps || emptyFunction;
  return ReactRedux.connectAdvanced(function (dispatch) {
    return function (state, ownProps) {
      return Object.assign({}, memoizedBindActionCreators(mapDispatchToProps, dispatch), {}, ownProps, {}, mapStateToProps(state, ownProps));
    };
  }, {
    context: SalesContentIndexUIReduxContext
  });
});