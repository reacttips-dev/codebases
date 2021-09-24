'use es6';

import { css, keyframes } from 'styled-components';
var DURATION = '1s';
var TIMING_FUNC = 'linear';
var DELAY = '0s';
var ITERATION = 'infinite';
var FILL_MODE = 'forwards';
var POSITION_X = 700;
var SHIMMER_ANIMATION = keyframes(["0%{background-position:-", "px 0}100%{background-position:", "px 0}"], POSITION_X, POSITION_X);
export var animation = css(["animation:", " ", " ", " ", " ", " ", ";"], SHIMMER_ANIMATION, DURATION, TIMING_FUNC, DELAY, ITERATION, FILL_MODE);