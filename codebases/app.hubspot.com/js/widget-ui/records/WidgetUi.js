'use es6';

import { Record } from 'immutable';
var WidgetUi = Record({
  isFullscreen: false,
  mobile: false,
  open: false,
  hideWelcomeMessage: false,
  domain: null,
  startOpen: undefined,
  url: null,
  userInteractedWithWidget: false,
  isEmbeddedInProduct: false,
  mode: null,
  isAttachmentDisabled: false,
  apiEnableWidgetCookieBanner: false,
  isInCMS: false
}, 'WidgetUi');
export default WidgetUi;