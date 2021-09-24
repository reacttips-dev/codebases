import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {GUNSMOKE, MAKO} from '../../../../style/colors';
import {BASE_TEXT} from '../../../../style/typography';
import CloseIcon from '../../../icons/close-thin.svg';

const SIZE = 24;

const Container = glamorous.div(
  {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '11px 13px'
  },
  ({placeholder}) => ({
    color: placeholder ? GUNSMOKE : MAKO
  })
);

const Label = glamorous.div({
  ...BASE_TEXT,
  marginRight: 12,
  fontSize: 14,
  width: '100%',
  '& input': {
    fontSize: 14
  },
  lineHeight: '24px',
  '.composer-narrow &': {
    fontSize: 13,
    '& input': {
      fontSize: 13
    }
  }
});

const IconWrap = glamorous.div({
  display: 'flex',
  marginRight: 10,
  width: SIZE,
  height: SIZE,
  '& img, & svg': {
    width: SIZE,
    height: SIZE
  }
});

const Close = glamorous.div({
  padding: 5,
  margin: -5
});

const Meta = ({icon, label, onDelete, onClick, placeholder = false, cancelAble = true}) => {
  return (
    <Container onClick={onClick} placeholder={placeholder}>
      <IconWrap>{typeof icon === 'string' ? <img src={icon} alt={label} /> : icon}</IconWrap>
      <Label>{label}</Label>
      {onDelete && cancelAble && (
        <Close
          onClick={event => {
            event.stopPropagation();
            onDelete();
          }}
        >
          <CloseIcon />
        </Close>
      )}
    </Container>
  );
};

Meta.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  placeholder: PropTypes.bool,
  cancelAble: PropTypes.bool
};

export default Meta;
