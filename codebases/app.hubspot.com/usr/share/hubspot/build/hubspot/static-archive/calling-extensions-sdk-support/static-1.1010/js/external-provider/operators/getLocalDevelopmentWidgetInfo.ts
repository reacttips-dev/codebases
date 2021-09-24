import { getSetting } from '../../local-settings/localSettings';
import CallingProvider from '../../call-provider/records/CallingProvider';
import getIn from 'transmute/getIn';
import setIn from 'transmute/setIn';
var overrideKey = 'CallingExtensions';
var OLD_LOCAL_SETTINGS_PREFIX = 'LocalSettings:Sales:';
export function getOverrideValue() {
  var overrideValue = getSetting(overrideKey);
  var oldOverrideValue = getSetting(overrideKey, null, undefined, OLD_LOCAL_SETTINGS_PREFIX);

  if (overrideValue || oldOverrideValue) {
    var _ref = overrideValue || oldOverrideValue,
        name = _ref.name,
        url = _ref.url,
        options = _ref.options,
        height = _ref.height,
        width = _ref.width,
        isReady = _ref.isReady,
        supportsCustomObjects = _ref.supportsCustomObjects;

    var widgetInfo = {
      name: name,
      url: url,
      isReady: isReady === undefined ? true : isReady,
      height: options ? options.height : height,
      width: options ? options.width : width,
      supportsCustomObjects: supportsCustomObjects
    };
    return new CallingProvider(widgetInfo);
  }

  return null;
}
export default function applyLocalStorageOverrides(widgetList) {
  var localStorageWidget = getOverrideValue();

  if (localStorageWidget) {
    // Find the widget with name
    var widgetIndex = widgetList.findIndex(function (widget) {
      if (widget) {
        return widget.get('name') === localStorageWidget.get('name');
      }

      return false;
    });

    if (widgetIndex > -1) {
      // If the widget exists, override the settings
      var widget = getIn([widgetIndex], widgetList);
      widget = widget.mergeWith(function (oldValue, override) {
        return override === undefined ? oldValue : override;
      }, localStorageWidget);
      widgetList = setIn(["" + widgetIndex], widget, widgetList);
    } else {
      widgetList = widgetList.push(localStorageWidget);
    }
  }

  return widgetList;
}