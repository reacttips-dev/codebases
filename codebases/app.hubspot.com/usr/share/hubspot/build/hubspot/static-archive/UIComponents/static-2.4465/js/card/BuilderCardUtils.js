'use es6';

import { css } from 'styled-components';
import { OLAF } from 'HubStyleTokens/colors';
import LIGHT_COLORS from '../core/LightColors';
import { BUILDER_CARD_TITLE_BAR_BACKGROUND_COLOR_DEFAULT } from './BuilderCardConstants';
export var titlebarColorTheme = function titlebarColorTheme(use) {
  return css(["background-color:", ";color:", ";"], LIGHT_COLORS[use] || BUILDER_CARD_TITLE_BAR_BACKGROUND_COLOR_DEFAULT, use === 'heffalump' && OLAF);
};