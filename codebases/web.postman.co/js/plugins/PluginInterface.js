
import { reaction } from 'mobx';

import {
  DOCS_URL,
  DOCS_SECURITY_URL,
  SUPPORT_URL,
  TWITTER_URL
} from '../constants/AppUrlConstants';
import { getStore } from '../stores/get-store';
import EditorService from '../services/EditorService';
import { openExternalLink } from '../external-navigation/ExternalNavigationService';
import {
  REQUESTER_BOTTOM_PAME_FIND_REPLACE,
  REQUESTER_BOTTOM_PANE_CONSOLE
} from '@@runtime-repl/request-http/RequesterBottomPaneConstants';
import NavigationService from '../services/NavigationService';

class PluginInterface {
  initialize () {
    this.properties = {
      layout: {
        value: getStore('ConfigurationStore').get('editor.requestEditorLayoutName'),
        registerer: function (context, cb) {
          reaction(() => getStore('ConfigurationStore').get('editor.requestEditorLayoutName'), cb.bind(context));
        }
      },
      theme: {
        value: pm.settings.getSetting('postmanTheme') || 'light',
        registerer: function (context, cb) {
          pm.settings.on('setSetting:postmanTheme', cb, context);
        }
      },
      platform: {
        value: navigator.platform,
        registerer: _.noop
      },
      windows: {
        value: [],
        registerer: function (context, cb) {
          pm.appWindow.on('windowClosed', cb.bind(context, 'windowClosed'), context);
        }
      },
      modals: {
        value: null,
        registerer: function (context, cb) {
          pm.mediator.on('modalOpened', cb.bind(context, 'modalOpened'), context);
          pm.mediator.on('modalClosed', cb.bind(context, 'modalClosed'), context);
        }
      },
      xFlows: {
        value: null,
        registerer: function (context, cb) {
          pm.mediator.on('saveXFlowActivity', cb.bind(context), context);
        }
      }
    };
  }

  register (property, handler, context) {
    this.properties[property] &&
      this.properties[property].registerer(context, handler);
  }

  get (key) {
    return _.get(this, `properties[${key}].value`);
  }

  openWindow (windowType) {
    switch (windowType) {
      case 'requester':
        pm.mediator.trigger('newRequesterWindow');
        break;
      case 'console':
        pm.mediator.trigger('newConsoleWindow');
        break;
      default:
        break;
    }
  }

  toggleTwoPaneLayout () {
    pm.app.toggleLayout();
  }

  openURL (url) {
    openExternalLink(url);
  }

  openModal (modalName, options) {
    switch (modalName) {
      case 'settings':
        // open the settings modal via navigation
        pm.mediator.trigger('openSettingsModal', options.tab);
        break;
      case 'release-notes':
        EditorService.open('customview://releaseNotes');
        break;
      case 'x-flow-activity-feed':
        pm.mediator.trigger('openXFlowActivityFeed');
        break;
      default:
        break;
    }
  }

  toggleSidebar () {
    pm.mediator.trigger('toggleSidebar');
  }

  toggleFindReplace () {
    const store = getStore('RequesterBottomPaneUIStore');

    store && store.toggleTab(REQUESTER_BOTTOM_PAME_FIND_REPLACE);
  }

  toggleConsole () {
    const store = getStore('RequesterBottomPaneUIStore');

    store && store.toggleTab(REQUESTER_BOTTOM_PANE_CONSOLE);
  }
}

export default new PluginInterface();
