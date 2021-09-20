import PropTypes from 'prop-types';
export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    YELLOW: 'yellow',
};

export const ThemeType = PropTypes.oneOf(_.values(THEMES));