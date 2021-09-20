
import { openURL as electronOpenURL } from '../electron/ElectronService';
import AnalyticsService from '../modules/services/AnalyticsService';

/**
 * Handles opening of external links by verifying link protocol.
 * @param {string} href url to open.
 * @param {string} target - indicates where to open the link. Only required on browser. Default is '_self'.
 *  Supported values are '_blank', '_self', '_parent', '_top'
 */
export function openExternalLink (href, target = '_self') {

  // Bail out if starts with '#'
  if (_.startsWith(href, '#')) {
    return;
  }

  let url = new URL(href);

  if (url.host && url.host === 'go.pstmn.io') {
    AnalyticsService.addEventV2({
      category: 'learning_center',
      action: 'open',
      label: _.head(url.path)
    });
  }

  if (url.protocol == undefined) {
      href = 'http://' + href;
      electronOpenURL(href, target);
  }

  // protocol property contains the protocol name with : appended at the end
  // ref: https://developer.mozilla.org/en-US/docs/Web/API/URL/protocol
  else if (url.protocol == 'https:' || url.protocol == 'http:') {
    electronOpenURL(href, target);
  }

  else {
    pm.mediator.trigger('showExternalNavigationModal', href, (isConfirmed) => {
      if (!isConfirmed) {
        return;
      }
      electronOpenURL(href, target);
    });
  }
}


