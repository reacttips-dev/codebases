import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import BaseButton from './button.jsx';
import Label from './label.jsx';
import {PHONE} from '../../../../../shared/style/breakpoints';

const Button = glamorous(BaseButton)({}, ({fill}) => ({
  textDecoration: 'none',
  ':hover > svg': {
    '> g, > g > g, > g > rect, > path': {
      fill
    }
  }
}));

const HideOnPhone = glamorous.span({
  display: 'inline',
  [PHONE]: {
    display: 'none'
  }
});

export default class Points extends Component {
  static propTypes = {
    count: PropTypes.number,
    icon: PropTypes.element,
    fill: PropTypes.string,
    label: PropTypes.string,
    link: PropTypes.string,
    onClick: PropTypes.func
  };

  render() {
    const {count, icon, fill, label, link, onClick} = this.props;
    const labelContent = label || (
      <Fragment>
        {count}
        <HideOnPhone>&nbsp;</HideOnPhone>p<HideOnPhone>oints</HideOnPhone>
      </Fragment>
    );

    if (count === 0) {
      return null;
    }

    return (
      <Button href={link} fill={fill} onClick={onClick}>
        {icon}
        <Label>{labelContent}</Label>
      </Button>
    );
  }
}
