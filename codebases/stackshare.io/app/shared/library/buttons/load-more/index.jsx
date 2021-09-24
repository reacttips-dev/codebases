import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {CONCRETE, WHITE} from '../../../style/colors';
import ProgressIndicator, {BUTTON} from '../../indicators/indeterminate/circular';
import RoundButton from '../base/round';

const Container = glamorous(RoundButton)({background: WHITE}, ({loading}) =>
  loading ? {':hover': {border: `1px solid ${CONCRETE}`}} : {}
).withComponent('button');

export default class LoadMoreButton extends Component {
  static propTypes = {
    text: PropTypes.string,
    loading: PropTypes.bool,
    onClick: PropTypes.func
  };

  static defaultProps = {
    text: 'Load more'
  };

  render() {
    const {text, loading, onClick} = this.props;
    return (
      <Container disabled={loading} onClick={loading ? null : onClick} loading={loading}>
        {loading ? <ProgressIndicator size={BUTTON} /> : text}
      </Container>
    );
  }
}
