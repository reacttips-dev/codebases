import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, CATHEDRAL, GUNSMOKE, ERROR_RED, TARMAC} from '../../../style/colors';
import {BASE_TEXT} from '../../../style/typography';
import Search from '../../icons/search.svg';
import Clear from '../../icons/close-circle.svg';

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  ...BASE_TEXT,
  ' label': {
    fontWeight: 700,
    marginBottom: 5,
    color: TARMAC
  }
});

const Input = glamorous.input(
  {
    width: '100%',
    boxSizing: 'border-box',
    ...BASE_TEXT,
    height: 45,
    lineHeight: '45px',
    fontSize: 14,
    padding: '0 15px 0 35px',
    borderRadius: 2,
    color: CATHEDRAL,
    caretColor: CATHEDRAL,
    WebkitAppearance: 'none',
    '::placeholder': {
      ...BASE_TEXT,
      fontSize: 14,
      lineHeight: '45px',
      color: GUNSMOKE
    },
    ':focus': {
      outline: 'none'
    }
  },
  ({error, borderWidth = '2'}) => ({
    border: error ? `${borderWidth}px solid ${ERROR_RED}` : `1px solid ${ASH}`,
    ':focus': {
      border: error ? `${borderWidth}px solid ${ERROR_RED}` : `1px solid ${GUNSMOKE}`
    }
  })
);

const InputContainer = glamorous.div({
  position: 'relative'
});

const Error = glamorous.div({
  ...BASE_TEXT,
  fontSize: 14,
  color: ERROR_RED,
  marginTop: 6,
  letterSpacing: 0.4,
  '> a': {
    color: ERROR_RED
  }
});

const SearchIcon = glamorous(Search)({
  position: 'absolute',
  left: 10,
  width: 18,
  height: 18,
  top: '50%',
  marginTop: '-9px'
});

const ClearIcon = glamorous(Clear)({
  position: 'absolute',
  right: 10,
  width: 20,
  height: 20,
  top: '50%',
  marginTop: '-10px',
  cursor: 'pointer'
});

export default class SearchTextInput extends Component {
  static propTypes = {
    value: PropTypes.any,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    onChange: PropTypes.func,
    onKeyDown: PropTypes.func,
    onBlur: PropTypes.func,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    readOnly: PropTypes.bool,
    maxLength: PropTypes.number,
    borderWidth: PropTypes.number,
    name: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
    style: PropTypes.any,
    inputBoxStyle: PropTypes.any,
    inputRef: PropTypes.func,
    onClear: PropTypes.func
  };

  render() {
    const {
      value,
      placeholder,
      label = '',
      onChange,
      onKeyDown,
      onBlur,
      error,
      readOnly,
      maxLength,
      name,
      id,
      type,
      style = {},
      inputBoxStyle = {},
      borderWidth,
      onClear,
      inputRef
    } = this.props;

    return (
      <Container style={style}>
        {label && <label htmlFor={id}>{label}</label>}
        <InputContainer>
          <SearchIcon />
          <Input
            innerRef={inputRef}
            maxLength={maxLength}
            placeholder={placeholder}
            value={value}
            onKeyDown={onKeyDown}
            onChange={onChange}
            onBlur={onBlur}
            readOnly={readOnly}
            name={name}
            id={id}
            type={type}
            error={Boolean(error)}
            style={inputBoxStyle}
            borderWidth={borderWidth}
          />
          {value && <ClearIcon onClick={onClear} />}
        </InputContainer>
        {error && <Error>{error}</Error>}
      </Container>
    );
  }
}
