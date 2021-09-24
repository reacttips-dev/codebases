'use es6';

import { createTracker } from 'usage-tracker';
import events from 'SalesTemplateEditor/events.yaml';
import { TEMPLATE_EDITOR_INTERACTION, TEMPLATE_INTERACTION } from './Events';
export var tracker = createTracker({
  events: events,
  properties: {
    namespace: 'template-editor'
  }
});
export var track = function track(event) {
  var eventProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _eventProps$screen = eventProps.screen,
      screen = _eventProps$screen === void 0 ? 'index' : _eventProps$screen;
  tracker.track(event, Object.assign({
    screen: screen
  }, eventProps));
};
export var trackInteraction = function trackInteraction(action) {
  return track(TEMPLATE_EDITOR_INTERACTION, {
    action: action
  });
};
export var trackTemplateInteraction = function trackTemplateInteraction(_ref) {
  var action = _ref.action,
      ownership = _ref.ownership;
  return track(TEMPLATE_INTERACTION, {
    action: action,
    ownership: ownership
  });
};
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}