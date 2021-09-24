import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {CONCRETE, FOCUS_BLUE} from '../../../style/colors';
import {BASE_TEXT} from '../../../style/typography';

const Container = glamorous.div(
  {
    display: 'flex',
    flexDirection: 'row',
    ...BASE_TEXT,
    color: CONCRETE,
    cursor: 'pointer'
  },
  ({disabled}) => ({cursor: disabled ? 'default' : 'pointer'})
);

const Circle = glamorous.div({
  display: 'flex',
  border: `1px solid ${CONCRETE}`,
  borderRadius: 17,
  width: 17,
  minWidth: 17,
  height: 17,
  minHeight: 17,
  marginRight: 10,
  justifyContent: 'center',
  alignItems: 'center'
});

const Radio = glamorous.div({
  display: 'flex',
  borderRadius: 13,
  width: 11,
  minWidth: 11,
  height: 11,
  minHeight: 11,
  background: FOCUS_BLUE,
  justifyContent: 'center',
  alignItems: 'center'
});

export default class RadioButton extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    onToggle: PropTypes.func.isRequired,
    children: PropTypes.any
  };

  render() {
    const {children, checked, disabled, onToggle} = this.props;
    return (
      <Container onClick={disabled ? null : onToggle} disabled={disabled}>
        <Circle>{checked && <Radio />}</Circle> {children}
      </Container>
    );
  }
}
