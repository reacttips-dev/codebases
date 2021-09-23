'use es6';

import pipe from 'transmute/pipe';
import { getMessage } from './widgetDataGetters';
import { getGdprConsentToProcessEnabled } from '../../message/operators/messageGetters';
export var gdprConsentToProcessEnabled = pipe(getMessage, getGdprConsentToProcessEnabled);