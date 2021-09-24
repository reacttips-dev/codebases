import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {CHARCOAL, CATHEDRAL, WHITE, ASH, CONCRETE, GUNSMOKE} from '../../../style/colors';
import Circular, {BUTTON} from '../../../library/indicators/indeterminate/circular';
import CloseIcon from '../../icons/close.svg';
import {ALPHA} from '../../../style/color-utils';

export const REMOVE = 'remove';
export const CLOSE = 'close';

export const THEME_LIGHT = 'light';
export const THEME_DARK = 'dark';

const Button = glamorous.div(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: '50%',
    cursor: 'pointer'
  },
  ({theme}) => ({
    backgroundColor: theme === THEME_DARK ? CHARCOAL : ALPHA(ASH, 0.28),
    ':hover': {
      backgroundColor: theme === THEME_DARK ? CATHEDRAL : ALPHA(ASH, 0.5)
    },
    '> svg > g': {
      fill: theme === THEME_DARK ? WHITE : GUNSMOKE,
      stroke: theme === THEME_DARK ? WHITE : GUNSMOKE
    }
  })
);

const RemoveIcon = glamorous.span(
  {
    width: 14,
    height: 3
  },
  ({theme}) => ({
    backgroundColor: theme === THEME_DARK ? WHITE : CONCRETE
  })
);

export default class CircularButton extends Component {
  static propTypes = {
    type: PropTypes.oneOf([REMOVE, CLOSE]),
    theme: PropTypes.oneOf([THEME_LIGHT, THEME_DARK]),
    processing: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    processing: false,
    theme: THEME_DARK
  };

  static renderIcon(type, processing, theme) {
    if (processing) {
      return <Circular size={BUTTON} />;
    }
    switch (type) {
      case REMOVE:
        return <RemoveIcon theme={theme} />;
      case CLOSE:
        return <CloseIcon />;
      default:
        return null;
    }
  }
  render() {
    const {type, processing, onClick, theme} = this.props;
    return (
      <Button onClick={onClick} theme={theme}>
        {CircularButton.renderIcon(type, processing)}
      </Button>
    );
  }
}
