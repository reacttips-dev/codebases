import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {grid} from '../../../utils/grid';
import {
  OFF_BLUE,
  FOCUS_BLUE,
  CHARCOAL,
  WHITE,
  MAKO,
  PUMPKIN,
  LIGHT_PUMPKIN
} from '../../../style/colors';
import {WEIGHT} from '../../../style/typography';
import ArrowUpIcon from '../../icons/arrow-up.svg';
import ArrowDownIcon from '../../icons/arrow-down.svg';

const Container = glamorous.ul({
  padding: 0,
  margin: 0,
  paddingBottom: grid(2)
});

const Option = glamorous.li(
  {
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    marginTop: 11,
    padding: `${grid(1)}px 13px`,
    listStyle: 'none',
    borderRadius: 17,
    fontWeight: WEIGHT.BOLD,
    '&:first-child': {
      marginTop: 0
    },
    '&:hover': {
      boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
      '& span': {
        display: 'block'
      }
    },
    '>svg': {
      flexShrink: 0
    }
  },
  ({active, altStyle, readOnly}) => ({
    cursor: readOnly ? 'default' : 'pointer',
    backgroundColor: active
      ? altStyle
        ? PUMPKIN
        : FOCUS_BLUE
      : altStyle
      ? LIGHT_PUMPKIN
      : OFF_BLUE,
    color: active ? WHITE : CHARCOAL,
    '& span': {
      display: active ? 'block' : 'none',
      color: active ? WHITE : MAKO
    },
    '> svg g': {
      '> path, > rect': {
        fill: active ? (altStyle ? PUMPKIN : FOCUS_BLUE) : WHITE
      },
      '> path[stroke]': {
        stroke: active ? (altStyle ? PUMPKIN : FOCUS_BLUE) : WHITE
      },
      '> path:first-child': {
        fill: active ? WHITE : altStyle ? PUMPKIN : FOCUS_BLUE
      }
    }
  })
);

const Arrow = glamorous.div({
  marginLeft: 9,
  display: 'flex'
});

const Text = glamorous.div({
  display: 'flex',
  height: 22,
  overflow: 'hidden',
  lineHeight: '22px',
  flexWrap: 'wrap',
  flexGrow: 1
});

const Title = glamorous.div({
  marginLeft: 11,
  marginRight: 11,
  flexShrink: 0,
  fontSize: 14,
  '.composer-narrow &': {
    fontSize: 13
  }
});

const Description = glamorous.span({
  fontSize: 12,
  fontWeight: WEIGHT.NORMAL,
  flexShrink: 0,
  flexGrow: 1,
  whiteSpace: 'nowrap',
  textAlign: 'right'
});

const all = option => option.title !== null;
const selected = key => option => option.key === key && option.title !== null;

const Options = ({active, options = [], selectedOption, innerRef, onClick, readOnly}) => {
  const byVisible = active ? all : selected(selectedOption);
  return (
    <Container innerRef={innerRef}>
      {options.filter(byVisible).map(option => {
        const {key, icon, title, description, altStyle} = option;
        const isSelected = selectedOption === key;
        const handleClick = readOnly
          ? null
          : event => {
              event.stopPropagation();
              onClick && onClick(option.key);
            };
        return (
          <Option
            key={key}
            onClick={handleClick}
            active={isSelected}
            altStyle={altStyle}
            readOnly={readOnly}
          >
            {icon}
            <Text>
              <Title>{title}</Title>
              <Description>{description}</Description>
            </Text>
            {!readOnly &&
              (isSelected && <Arrow>{active ? <ArrowUpIcon /> : <ArrowDownIcon />}</Arrow>)}
          </Option>
        );
      })}
    </Container>
  );
};

Options.propTypes = {
  active: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      icon: PropTypes.element,
      title: PropTypes.string,
      description: PropTypes.string
    })
  ),
  selectedOption: PropTypes.string,
  innerRef: PropTypes.object,
  onClick: PropTypes.func,
  readOnly: PropTypes.bool
};

export default Options;
