'use es6';

import { connect } from 'react-redux';
import compose from 'transmute/compose';
import NetworkQuality from '../components/NetworkQuality';
import { getMosScore } from '../selectors/getNetworkQuality';

var mapStateToProps = function mapStateToProps(state) {
  return {
    mosScore: getMosScore(state)
  };
};

export default compose(connect(mapStateToProps))(NetworkQuality);