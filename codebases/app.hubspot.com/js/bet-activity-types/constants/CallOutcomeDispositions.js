'use es6';

import { Map as ImmutableMap, OrderedMap } from 'immutable';
import once from 'transmute/once';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
export var NO_ANSWER = '73a0d17f-1163-4015-bdd5-ec830791da20';
export var BUSY = '9d9162e7-6cf3-4944-bf63-4dff82258764';
export var WRONG_NUMBER = '17b47fee-58de-441e-a44c-c6300d46f273';
export var LEFT_LIVE_MESSAGE = 'a4c4c377-d246-4b32-a13b-75a56a4cd0ff';
export var LEFT_VOICEMAIL = 'b2cf5968-551e-4856-9783-52b3da59a7d0';
export var CONNECTED = 'f240bbac-87c9-4f6e-bf70-924b57d47db7';
export var SELECT_AN_OUTCOME = undefined;
export var getAllCallDispositions = once(function () {
  return ImmutableMap({
    SELECT_AN_OUTCOME: SELECT_AN_OUTCOME,
    NO_ANSWER: NO_ANSWER,
    BUSY: BUSY,
    WRONG_NUMBER: WRONG_NUMBER,
    LEFT_LIVE_MESSAGE: LEFT_LIVE_MESSAGE,
    LEFT_VOICEMAIL: LEFT_VOICEMAIL,
    CONNECTED: CONNECTED
  }).reduce(function (acc, value, key) {
    return acc.set(value, propertyLabelTranslator(key.toLowerCase())); // call dispositions are hardcoded above and thus are all HubSpot-defined
  }, OrderedMap());
});