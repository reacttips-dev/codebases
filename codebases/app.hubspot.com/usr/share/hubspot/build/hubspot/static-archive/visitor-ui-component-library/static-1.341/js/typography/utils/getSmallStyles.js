'use es6';

import { css } from 'styled-components';
export var getSmallStyles = css(["font-size:12px;line-height:18px;"]);
export var getGlobalSmallStyles = css(["small{", "}"], getSmallStyles);