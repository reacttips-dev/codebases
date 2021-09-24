import serverRenderingUtils from '../../../helpers/serverRenderingUtils';

/**
 * Fires a new event each time the path is updated
 */
export const firePathUpdateEvent = (pathname?: string) => {
  if (!serverRenderingUtils.windowUndefined()) {
    if (pathname) {
      const event = new CustomEvent('pathnameUpdate', { detail: pathname });
      window.dispatchEvent(event);
    }
  }
};

/**
 * Determines if the banner should be shown based on the pathname or
 * if the user should refresh when in maintenance mode.
 */
export const shouldHandleWarningMode = (pathname?: string) =>
  new RegExp(/\/(dashboard|login|signup|switch)(\/|$)/g).test(pathname || '');

/**
 * Checks if website is in maintenance mode
 * To test the warning banner or warning screen behavior, visit server.js
 */
export const fetchMaintenanceModeStatus = () => {
  return fetch('/api/status')
    .then(res => res.json())
    .then(data => {
      return {
        show_warning_page: (data || {}).show_warning_page || '0',
        warning_banner_content: (data || {}).warning_banner_content || '',
      };
    })
    .catch(error => {
      return { show_warning_page: '0', warning_banner_content: '' };
    });
};
