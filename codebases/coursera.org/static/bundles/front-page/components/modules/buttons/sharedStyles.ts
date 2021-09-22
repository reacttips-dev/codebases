import { StyleSheet } from '@coursera/coursera-ui';

export enum REBRAND_COLORS {
  BLUE = '#0056D2',
  BLUE_DARKER = '#00419E',
  BLUISH_WHITE = '#F3F8FF',
  PURPLE = '#382D8B',
  PURPLISH_WHITE = '#F7F6FE',
}

const focusOutline = `0 0 0 2px #FFF, 0 0 0 3px ${REBRAND_COLORS.PURPLE},0 0 0 4px ${REBRAND_COLORS.BLUISH_WHITE}`;

const styles = StyleSheet.create({
  button: {
    background: 'transparent',
    border: 'none',
    borderRadius: '4px',
    display: 'inline-block',
    fontFamily: 'Source Sans Pro, Arial, sans-serif',
    fontSize: '16px',
    fontWeight: 'bold',
    lineHeight: '24px',
    padding: '12px 32px',
    textAlign: 'center',
    transition: 'background-color 250ms ease-out, box-shadow 250ms ease-out, color 250ms ease-out',
    textDecoration: 'none',
    ':focus': {
      outline: 'none',
      textDecoration: 'none',
    },
    ':hover': {
      textDecoration: 'none',
    },
  },
  disabled: {
    backgroundColor: '#BDBDBD',
    color: '#FFFFFF',
  },
  primary: {
    backgroundColor: REBRAND_COLORS.BLUE,
    color: '#FFFFFF',
    ':focus': {
      backgroundColor: REBRAND_COLORS.BLUE_DARKER,
      boxShadow: focusOutline,
    },
    '@media (hover:hover)': {
      ':hover': {
        backgroundColor: REBRAND_COLORS.BLUE_DARKER,
      },
    },
    ':visited': {
      backgroundColor: REBRAND_COLORS.PURPLE,
    },
  },
  secondary: {
    backgroundColor: '#FFFFFF',
    border: `2px solid ${REBRAND_COLORS.BLUE}`,
    color: REBRAND_COLORS.BLUE,
    ':focus': {
      backgroundColor: REBRAND_COLORS.BLUISH_WHITE,
      boxShadow: focusOutline,
    },
    '@media (hover:hover)': {
      ':hover': {
        backgroundColor: '#F3F8FF',
      },
    },
    ':visited': {
      backgroundColor: REBRAND_COLORS.PURPLISH_WHITE,
      borderColor: REBRAND_COLORS.PURPLE,
      color: REBRAND_COLORS.PURPLE,
    },
  },
  tertiary: {
    backgroundColor: '#FFFFFF',
    border: '2px solid #1F1F1F',
    color: '#1F1F1F',
    ':focus': {
      backgroundColor: REBRAND_COLORS.BLUISH_WHITE,
      boxShadow: focusOutline,
    },
    '@media (hover:hover)': {
      ':hover': {
        backgroundColor: '#F3F8FF',
      },
    },
    ':visited': {
      backgroundColor: REBRAND_COLORS.PURPLE,
    },
  },
});

export default styles;
