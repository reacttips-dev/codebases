import { List } from 'immutable';
import CallingProvider from '../../call-provider/records/CallingProvider';
import get from 'transmute/get';
import { getAircallCallingProvider } from './getAircallCallingProvider';
import getLocalDevelopmentWidgetInfo from './getLocalDevelopmentWidgetInfo';
export function getInstalledCallingProviders(_ref) {
  var installedCallingApplications = _ref.installedCallingApplications,
      isAircallInstalled = _ref.isAircallInstalled;
  var providers = List();

  if (isAircallInstalled) {
    providers = providers.push(getAircallCallingProvider());
  }

  if (installedCallingApplications) {
    installedCallingApplications.forEach(function (config) {
      var name = get('name', config);
      var url = get('url', config);

      if (url && name) {
        var widgetConfig = new CallingProvider(config);
        providers = providers.push(widgetConfig);
      }
    });
  }

  providers = getLocalDevelopmentWidgetInfo(providers);
  providers = providers.filter(function (widget) {
    return Boolean(widget.isReady && widget.name);
  });
  return providers;
}