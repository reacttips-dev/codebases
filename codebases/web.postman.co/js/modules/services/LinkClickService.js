import { getStore } from '../../stores/get-store';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';
import { openNewRequestTab } from '@@runtime-repl/request-http/_api/RequestInterface';

/**
 * Returns the domain of an URL
 *
 * for e.g.
 *
 * https://google.com/foo -> https://google.com
 * google.com/foo -> google.com
 *
 *
 * @param {String} url
 *
 * @returns {String}
 */
function getFirstPart (url) {
  var indexOfTS = url.indexOf('//');
  if (indexOfTS == -1) {
    return url.split('/')[0];
  }
  else {
    var fp = url.substring(indexOfTS + 2);
    return url.substring(0, indexOfTS) + '//' + fp.split('/')[0];
  }

}

/**
 * Handles open link actions.
 *
 * Can open a link in a Postman tab or a in a browser.
 *
 * Also handles the retain headers settings.
 *
 * @param {String} link
 * @param {Object} [options]
 * @param {Boolean} [options.openInBrowser] use this option to open a link in the browser
 */
export function openLink (link, options) {
  // get the backing model for active tab
  // @todo: create a nicer API to get this
  let activeEditor = getStore('EditorStore').find(getStore('ActiveWorkspaceSessionStore').activeEditor),
      requestContext = {};

  // set up request headers only if active tab is a request
  if (activeEditor && activeEditor.model && activeEditor.model.requestId) {
    requestContext = {
      url: activeEditor.model.getViewModel('url') || '',
      headerData: activeEditor.model.getViewModel('headerData') || []
    };
  }

  // expand link url for relative links if active tab is request
  if (requestContext.url && link[0] == '/') {
    link = getFirstPart(requestContext.url) + link;
  }

  if (_.get(options, 'openInBrowser', false)) {
    // open in browser
    openExternalLink(link);
  }
  else {
    // create a new request
    let initialValue = {
      url: link
    };

    // populate headers if needed
    if (pm.settings.getSetting('retainLinkHeaders')) {
      initialValue.headerData = requestContext.headerData || [];
    }

    // open in new tab
    openNewRequestTab({ initialValue });
  }

}
