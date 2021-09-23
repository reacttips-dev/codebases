/* eslint-disable sort-keys */

import { Theme } from 'theme-ui'

const base = {
  cursor: 'pointer',
  fontFamily: 'body',
  fontSize: '14px',
  boxShadow: '-8px 4px 20px transparent',
  borderRadius: '4px',
  border: (theme: Theme): string => `1px solid ${theme.colors.text}`,
  transition: 'box-shadow 0.3s, background-color 0.3s',
  '&:hover': {
    boxShadow: (theme: Theme): string => `-8px 4px 20px ${theme.colors.tealDark[4]}`,
  },
  '&:disabled': {
    cursor: 'default',
    color: 'gray.4',
    borderColor: 'gray.4',
    backgroundColor: 'gray.1',
    boxShadow: '-8px 4px 20px transparent',
  },
}

export default {
  primary: {
    ...base,
    backgroundColor: 'tealDark.1',
    color: 'text',
    '&:focus': {
      backgroundColor: 'tealDark.4',
      outline: 'none',
    },
    '&:active': {
      backgroundColor: 'tealDark.4',
    },
  },
  secondary: {
    ...base,
    backgroundColor: 'background',
    color: 'text',
    '&:focus': {
      backgroundColor: 'tealDark.1',
      outline: 'none',
    },
    '&:active': {
      backgroundColor: 'tealDark.1',
    },
  },
  blank: {
    backgroundColor: 'transparent',
    color: 'text',
    border: '0px',
    margin: '0px',
    padding: '0px',
  },
  link: {
    cursor: 'pointer',
    position: 'relative',
    display: 'inline-block',
    borderRadius: '0px',
    padding: 0,
    margin: 0,
    color: 'inherit',
    bg: 'transparent',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
    // focus bubble
    '&:before': {
      content: '""',
      position: 'absolute',
      opacity: 0,
      transition: 'opacity 0.3s',
      left: 0,
      top: '50%',
      marginTop: '-1em',
      borderRadius: '50%',
      height: '2em',
      width: '100%',
      backgroundColor: 'tealDark.4',
      boxShadow: (theme: Theme): string => `0 0 4px 4px ${theme.colors.tealDark[4]}`,
    },
    // link line
    '&:after': {
      content: '""',
      position: 'absolute',
      left: 0,
      bottom: '0',
      height: '2px',
      width: '100%',
      borderRadius: '4px',
      backgroundColor: 'tealDark.4',
    },
    '&:hover:after': {
      height: '10px',
    },
    '&:focus': {
      outline: 'none',
    },
    '&:focus:before, &:active:before': {
      opacity: 1,
    },
    '&:disabled': {
      cursor: 'default',
      color: 'gray.4',
      '&:before, &:after': {
        display: 'none',
      },
    },
  },
}
