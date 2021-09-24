import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, CATHEDRAL, GUNSMOKE, ERROR_RED} from '../../../style/colors';
import {BASE_TEXT} from '../../../style/typography';
import {Loader} from '../../loaders/loader';

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  ...BASE_TEXT
});

const Input = glamorous.textarea(
  {
    width: '100%',
    boxSizing: 'border-box',
    ...BASE_TEXT,
    height: 100,
    fontSize: 14,
    padding: 15,
    borderRadius: 2,
    color: CATHEDRAL,
    caretColor: CATHEDRAL,
    WebkitAppearance: 'none',
    '::placeholder': {
      ...BASE_TEXT,
      fontSize: 14,
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

const Error = glamorous.div({
  ...BASE_TEXT,
  fontSize: 14,
  color: ERROR_RED,
  marginTop: 6,
  letterSpacing: 0.4
});

export default class TextAreaInput extends Component {
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
    loading: PropTypes.bool
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
      inputRef,
      borderWidth,
      loading = false
    } = this.props;

    return (
      <Container style={style}>
        {label && <label htmlFor={id}>{label}</label>}
        {!loading && (
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
        )}
        {loading && <Loader h={100} w="100%" animate />}
        {error && <Error>{error}</Error>}
      </Container>
    );
  }
}
