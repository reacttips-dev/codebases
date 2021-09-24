'use es6';

import { setThemeProperty, getThemeProperty } from '../../theme/defaultThemeOperators';
export var getSadColor = getThemeProperty('sadColor');
export var getNeutralColor = getThemeProperty('neutralColor');
export var getHappyColor = getThemeProperty('happyColor');
export var setSadColor = setThemeProperty('sadColor');
export var setNeutralColor = setThemeProperty('neutralColor');
export var setHappyColor = setThemeProperty('happyColor');