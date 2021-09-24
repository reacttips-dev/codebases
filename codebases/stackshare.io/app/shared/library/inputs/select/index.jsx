import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {BASE_TEXT} from '../../../style/typography';
import {ASH, WHITE, MAKO, ERROR_RED, BLACK} from '../../../style/colors';

const CHEVRON_WIDTH = 10;

export const BLOCK = 'block';
export const INLINE_BLOCK = 'inline-block';

const Container = glamorous.div(
  {
    border: `1px solid ${ASH}`,
    borderRadius: 2,
    backgroundColor: WHITE,
    position: 'relative',
    cursor: 'pointer',
    ':hover': {
      border: `1px solid ${MAKO}`
    }
  },
  ({customOffset = 15}) => ({
    '::after': {
      border: `1px solid ${WHITE}`,
      borderWidth: CHEVRON_WIDTH / 2,
      borderColor: `${WHITE} transparent transparent transparent`,
      content: '""',
      position: 'absolute',
      right: customOffset - 3,
      top: customOffset - 1,
      pointerEvents: 'none'
    },
    '::before': {
      border: `1px solid ${MAKO}`,
      borderWidth: CHEVRON_WIDTH / 2,
      borderColor: `${MAKO} transparent transparent transparent`,
      content: '""',
      position: 'absolute',
      right: customOffset - 3,
      top: customOffset,
      pointerEvents: 'none'
    }
  }),
  ({display = INLINE_BLOCK}) => ({
    display
  })
);

export const SelectInput = glamorous.select(
  {
    ...BASE_TEXT,
    color: BLACK,
    minWidth: 106,
    width: '100%',
    height: 32,
    paddingLeft: 11,
    boxShadow: 'none',
    border: 'none',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    appearance: 'none',
    ':focus': {
      outline: 'none'
    },
    ':not(:focus)': {
      color: BLACK
    }
  },
  ({error}) => ({
    border: error ? `1px solid ${ERROR_RED}` : 'none',
    ':focus': {
      border: error ? `1px solid ${ERROR_RED}` : 'none'
    }
  })
);

const RequiredWrapper = glamorous.span({
  color: 'red'
});

export default class Select extends Component {
  static propTypes = {
    options: PropTypes.array,
    value: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    onSelect: PropTypes.func,
    display: PropTypes.oneOf([BLOCK, INLINE_BLOCK]),
    id: PropTypes.string,
    style: PropTypes.any,
    selectStyle: PropTypes.any,
    customOffset: PropTypes.number,
    width: PropTypes.number,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    isRequired: PropTypes.bool
  };

  handleOnChange = e => {
    const value = e.target.value;
    this.setState({value}, () => {
      this.props.onSelect(value);
    });
  };

  render() {
    const {
      options,
      value,
      width,
      display,
      id,
      label = '',
      placeholder = '',
      customOffset,
      style = {},
      selectStyle = {},
      error,
      isRequired = false
    } = this.props;
    return (
      <div style={style}>
        <label htmlFor={id}>
          {label}
          {isRequired && <RequiredWrapper>*</RequiredWrapper>}
        </label>
        <Container display={display} customOffset={customOffset} style={{width}}>
          <SelectInput
            id={id ? id : null}
            value={value}
            onChange={this.handleOnChange}
            style={selectStyle}
            error={Boolean(error)}
          >
            {placeholder && (
              <option value="" disabled selected hidden>
                {placeholder}
              </option>
            )}
            {options.map(({name, value}, i) => (
              <option value={value} key={i}>
                {name}
              </option>
            ))}
          </SelectInput>
        </Container>
      </div>
    );
  }
}
