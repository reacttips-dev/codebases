'use es6';

import { ALERT_DANGER, CALYPSO, CALYPSO_MEDIUM, CANDY_APPLE_MEDIUM, FLINT, HEFFALUMP, LORAX, LORAX_MEDIUM, OLAF, OZ, OZ_MEDIUM } from 'HubStyleTokens/colors';
import { rgba } from '../core/Color';
export var ICON_COLOR_MAP = {
  danger: ALERT_DANGER,
  primary: LORAX,
  secondary: LORAX,
  'secondary-ghost': OLAF,
  tertiary: HEFFALUMP,
  success: OZ,
  link: CALYPSO,
  'on-dark': OLAF
};
export var ICON_SIZE_MAP = {
  xs: 10,
  sm: 16,
  md: 24
};
export var USES = ['danger', 'primary', 'primary-white', 'secondary', 'secondary-ghost', 'tertiary', 'success', 'tertiary-light', 'link', 'on-dark'];
export var USE_COLORS = {
  danger: CANDY_APPLE_MEDIUM,
  primary: LORAX_MEDIUM,
  'primary-white': FLINT,
  secondary: LORAX_MEDIUM,
  tertiary: FLINT,
  'tertiary-light': FLINT,
  success: OZ_MEDIUM,
  link: CALYPSO_MEDIUM,
  ghost: 'transparent',
  'on-dark': rgba(OLAF, 0.5)
};
export var USE_INDICATOR_COLORS = {
  danger: ALERT_DANGER,
  primary: LORAX,
  'primary-white': HEFFALUMP,
  secondary: LORAX,
  'secondary-ghost': OLAF,
  tertiary: HEFFALUMP,
  'tertiary-light': HEFFALUMP,
  success: OZ,
  link: CALYPSO,
  ghost: OLAF,
  'on-dark': OLAF
};
export var SIZE_OPTIONS = {
  xs: '20px',
  sm: '28px',
  md: '40px'
};