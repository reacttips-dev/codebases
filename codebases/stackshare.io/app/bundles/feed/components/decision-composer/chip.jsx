import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {GUNSMOKE, MAKO} from '../../../../shared/style/colors';
import {BASE_TEXT} from '../../../../shared/style/typography';
import CloseIcon from './icons/close-icon.svg';

const Container = glamorous.div(
  {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '20px 12px'
  },
  ({placeholder}) => ({
    color: placeholder ? GUNSMOKE : MAKO
  })
);

const Label = glamorous.div({
  ...BASE_TEXT,
  marginRight: 10,
  width: '100%'
});

const IconWrap = glamorous.div({
  display: 'flex',
  marginRight: 5,
  width: 15,
  height: 15,
  '& img, & svg': {
    width: 15,
    height: 15
  }
});

const Close = glamorous.div({
  padding: 5,
  margin: -5
});

export default class Chip extends Component {
  static propTypes = {
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    onDelete: PropTypes.func,
    onClick: PropTypes.func,
    placeholder: PropTypes.bool
  };

  static defaultProps = {
    placeholder: false
  };

  handleDelete = () => {
    this.props.onDelete();
  };

  render() {
    const {icon, label, onDelete, onClick, placeholder} = this.props;
    return (
      <Container onClick={onClick} placeholder={placeholder}>
        <IconWrap>{typeof icon === 'string' ? <img src={icon} alt={label} /> : icon}</IconWrap>
        <Label>{label}</Label>
        {onDelete && (
          <Close onClick={this.handleDelete}>
            <CloseIcon />
          </Close>
        )}
      </Container>
    );
  }
}
