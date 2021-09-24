import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {CONCRETE} from '../../../style/colors';
import {BASE_TEXT} from '../../../style/typography';
import CheckmarkIcon from './checkmark.svg';

const Container = glamorous.div(
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...BASE_TEXT,
    color: CONCRETE,
    cursor: 'pointer'
  },
  ({disabled}) => ({cursor: disabled ? 'default' : 'pointer'})
);

const Box = glamorous.div({
  display: 'flex',
  border: `1px solid ${CONCRETE}`,
  width: 17,
  minWidth: 17,
  height: 17,
  minHeight: 17,
  marginRight: 10,
  justifyContent: 'center',
  alignItems: 'center'
});

export default class Checkbox extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    customStyle: PropTypes.object,
    onToggle: PropTypes.func.isRequired,
    children: PropTypes.any
  };

  render() {
    const {children, checked, disabled, onToggle, customStyle = {}} = this.props;
    return (
      <Container onClick={disabled ? null : onToggle} disabled={disabled} style={customStyle}>
        <Box>{checked && <CheckmarkIcon />}</Box> {children}
      </Container>
    );
  }
}
