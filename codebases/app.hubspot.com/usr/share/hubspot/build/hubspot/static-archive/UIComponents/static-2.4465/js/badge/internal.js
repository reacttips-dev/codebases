'use es6';

import { css } from 'styled-components';
import { BADGE_ROUNDED_FONT_SIZE, BADGE_ROUNDED_HEIGHT } from 'HubStyleTokens/sizes';
import { FONT_FAMILIES, setBorderRadius, setFontSmoothing } from '../utils/Styles';
var badgeTextStyles = css(["", ";font-size:", ";", ";text-align:center;text-transform:uppercase;vertical-align:inherit;hyphens:manual;"], FONT_FAMILIES.bold, BADGE_ROUNDED_FONT_SIZE, setFontSmoothing('antialiased'));
export var badgeStylesMixin = css(["display:inline-block;", ";", ";line-height:", ";min-height:", ";"], badgeTextStyles, setBorderRadius(), BADGE_ROUNDED_HEIGHT, BADGE_ROUNDED_HEIGHT);