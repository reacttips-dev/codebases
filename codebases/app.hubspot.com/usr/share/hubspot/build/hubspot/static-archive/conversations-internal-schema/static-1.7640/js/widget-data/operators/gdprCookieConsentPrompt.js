'use es6';

import pipe from 'transmute/pipe';
import { getMessage } from './widgetDataGetters';
import { getGdprCookieConsentPrompt } from '../../message/operators/messageGetters';
export var gdprCookieConsentPrompt = pipe(getMessage, getGdprCookieConsentPrompt);