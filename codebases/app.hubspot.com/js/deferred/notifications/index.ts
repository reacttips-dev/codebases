import isApp from 'unified-navigation-ui/utils/isApp';
import navQuerySelector from 'unified-navigation-ui/utils/navQuerySelector';
export function setupNotifications() {
  if (!isApp()) {
    return;
  }

  var notificationsElement = navQuerySelector('.navNotifications');
  notificationsElement.addEventListener('click', function () {
    if (window.hubspot && window.hubspot.notifications && window.hubspot.notifications.openSidebar) {
      window.hubspot.notifications.openSidebar();
    } else {// TODO: fire a sentry for notifications not being available
    }
  });
}