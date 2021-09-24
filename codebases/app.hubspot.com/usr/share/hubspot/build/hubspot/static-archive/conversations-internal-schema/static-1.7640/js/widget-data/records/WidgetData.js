'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Record;

import { Record } from 'immutable';
import Message from '../../message/records/Message';
import ColoringRecord from '../../coloring/records/ColoringRecord';
import TypicalResponseTime from '../../typical-response-time/records/TypicalResponseTime';
import WidgetAvailabilityOptions from '../../availability/records/WidgetAvailabilityOptions';
import GDPRConsentOptions from './GDPRConsentOptions';
import { V1, RIGHT_ALIGNED } from '../constants/widgetDataTypes';
var TYPE = '@type';
export default Record((_Record = {}, _defineProperty(_Record, TYPE, V1), _defineProperty(_Record, "botResponder", null), _defineProperty(_Record, "chatflowId", null), _defineProperty(_Record, "coloring", ColoringRecord()), _defineProperty(_Record, "gates", null), _defineProperty(_Record, "gdprConsentOptions", GDPRConsentOptions()), _defineProperty(_Record, "inOfficeHours", false), _defineProperty(_Record, "knowledgeBaseUrl", null), _defineProperty(_Record, "language", null), _defineProperty(_Record, "meetingsLinkText", null), _defineProperty(_Record, "meetingsLinkUrl", null), _defineProperty(_Record, "message", Message()), _defineProperty(_Record, "messagesPageUri", null), _defineProperty(_Record, "nextOfficeHoursStartTime", 0), _defineProperty(_Record, "privateLoad", false), _defineProperty(_Record, "sendFrom", null), _defineProperty(_Record, "sessionId", null), _defineProperty(_Record, "showingHsBranding", false), _defineProperty(_Record, "shouldListenToGdprBannerConsent", true), _defineProperty(_Record, "typicalResponseTime", TypicalResponseTime()), _defineProperty(_Record, "usingOfficeHours", false), _defineProperty(_Record, "availabilityOptions", new WidgetAvailabilityOptions()), _defineProperty(_Record, "showPreviousConversations", true), _defineProperty(_Record, "widgetLocation", RIGHT_ALIGNED), _Record), 'WidgetData');