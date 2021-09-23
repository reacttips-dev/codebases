'use es6';

import pipe from 'transmute/pipe';
import curry from 'transmute/curry';
import { List, Map as ImmutableMap } from 'immutable';
import Raven from 'Raven';
import WidgetData from 'conversations-internal-schema/widget-data/records/WidgetData';
import Responder from 'conversations-internal-schema/responders/records/Responder';
import TypicalResponseTime from 'conversations-internal-schema/typical-response-time/records/TypicalResponseTime';
import { buildColorRecord } from 'conversations-visitor-experience-components/visitor-widget/util/color';
import WidgetAvailabilityOptions from 'conversations-internal-schema/availability/records/WidgetAvailabilityOptions';
import { buildWelcomeMessage } from './buildWelcomeMessage';
import { isTypeBot } from 'conversations-internal-schema/responders/operators/isTypeBot';
var enforceValues = curry(function (valuesToEnforce, subject) {
  return ImmutableMap(subject).merge(valuesToEnforce);
});
export var buildWidgetData = function buildWidgetData() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var responders = data.sendFrom || [];
  var sendFrom = data.sendFrom || [];
  var botResponder = data.sendFrom && isTypeBot(data.sendFrom[0]) ? Responder(sendFrom[0]) : null;
  var responder = botResponder || sendFrom[0];
  var returnValue;

  try {
    returnValue = pipe(enforceValues({
      availabilityOptions: new WidgetAvailabilityOptions(data.availabilityOptions),
      botResponder: botResponder,
      coloring: buildColorRecord(data.accentColor),
      gates: ImmutableMap(data.gates),
      inOfficeHours: data.inOfficeHours,
      message: buildWelcomeMessage(data.message),
      messagesPageUri: data.messagesPageUri,
      nextStartTime: data.nextOfficeHoursStartTime,
      responder: Responder(responder),
      responders: List(responders).map(Responder),
      sendFrom: List(sendFrom).map(Responder),
      typicalResponseTime: TypicalResponseTime(data.typicalResponseTime),
      widgetLocation: data.widgetLocation
    }), WidgetData)(data);
  } catch (e) {
    Raven.captureMessage('BUILD_WIDGET_DATA_ERROR', {
      extra: {
        data: data
      }
    });
  }

  return returnValue;
};