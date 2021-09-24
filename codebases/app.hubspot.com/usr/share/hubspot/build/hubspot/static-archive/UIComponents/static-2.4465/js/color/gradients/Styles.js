'use es6';

import { css } from 'styled-components';
import { CALYPSO, LORAX, NORMAN, OLAF, OZ, SORBET } from 'HubStyleTokens/colors';
export var getGradient = function getGradient(foregroundColor, gradientDirection, startColor, startColorStop, endColor, endColorStop) {
  return css(["color:", ";background-color:", ";background-image:linear-gradient( ", ",", " ", ",", " ", " ) !important;"], foregroundColor, startColor, gradientDirection, startColor, startColorStop, endColor, endColorStop);
};
export var getBlueOceanGradient = css(["", ";"], getGradient(OLAF, '89deg', CALYPSO, undefined, OZ, undefined));
export var getSlorbaxGradient = css(["", ";"], getGradient(OLAF, '89deg', LORAX, undefined, SORBET, undefined));
export var getEricRichardRedGradient = css(["", ";"], getGradient(OLAF, '89deg', NORMAN, undefined, LORAX, undefined));