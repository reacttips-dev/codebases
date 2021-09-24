'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from 'react-dom';
import UIApplication from 'UIComponents/app/UIApplication';
import ErrorPage from './ErrorPage';
import I18n from 'I18n';
import Raven from 'Raven';
var containerId = 'crm-error-root';
/**
 * A replacement for ReactDOM.createPortal. ReactDOM.createPortal requires
 * that we're inside of a React tree, which we can't guarantee is true in some
 * places in CRM applications. Instead, we call ReactDOM.render directly,
 * rendering the overlay in a separate parent div. This function mimics the
 * behavior of the legacy ErrorPageMixer.
 *
 * @deprecated Each app should be handling their own error logic in a
 * declarative, contextual manner. In our current world with imperative routing
 * this is challenging, but once the migration to React Router is complete,
 * each app should remove usages of this API in favor of local, contextual
 * errors.
 */

export function createErrorOverlay(errorCode) {
  var overlay = /*#__PURE__*/_jsx(UIApplication, {
    name: "crm-overlay",
    children: /*#__PURE__*/_jsx(ErrorPage, {
      errorCode: errorCode
    })
  });

  console.error("Error: Page failed to load due to API request failure. Check network logs for requests with status code " + errorCode + ".");
  Raven.captureMessage('[createErrorOverlay] legacy error overlay mounted', {
    extra: {
      errorCode: errorCode
    },
    level: 'info'
  });

  if (document.getElementById(containerId)) {
    ReactDOM.render(overlay, document.getElementById(containerId));
    return;
  }

  var modalEl = document.createElement('div');
  modalEl.id = containerId;
  document.body.insertBefore(modalEl, document.querySelector('.app'));
  document.title = I18n.text('errorPage.generic.error');
  ReactDOM.render(overlay, modalEl);
}