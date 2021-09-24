'use es6';

import PortalIdParser from 'PortalIdParser';
import { debug } from 'prompts-lib/util/DebugUtil';
var PROMPTS_SRC = "/modal-prompts/" + PortalIdParser.get();
var PROMPTS_CONTAINER_ID = 'prompts-modal-container';
var PROMPTS_IFRAME_ID = 'prompts-modal-iframe';

var ModalPromptsUI = function ModalPromptsUI() {
  var mainDocument = window.top.document;

  var createIframe = function createIframe() {
    var iframe = mainDocument.createElement('iframe');
    iframe.setAttribute('src', PROMPTS_SRC);
    iframe.setAttribute('id', PROMPTS_IFRAME_ID);
    var iframeStyle = iframe.style;
    iframeStyle.border = '0';
    iframeStyle.display = 'block';
    iframeStyle.height = '420px';
    iframeStyle.width = '600px';
    iframeStyle.margin = 'auto auto';
    return iframe;
  };

  var createOverlayContainer = function createOverlayContainer() {
    var container = mainDocument.createElement('div');
    container.setAttribute('id', PROMPTS_CONTAINER_ID);
    var style = container.style;
    style.display = 'none';
    style.contain = 'content';
    style.overflow = 'auto';
    style.position = 'fixed';
    style.top = '0';
    style.bottom = '0';
    style.left = '0';
    style.right = '0';
    style['-webkit-transition-property'] = 'none';
    style['-webkit-transition-delay'] = '0ms';
    style['-webkit-transition-duration'] = '100ms';
    style['transition-property'] = 'none';
    style['transition-delay'] = '0ms';
    style['transition-duration'] = '100ms';
    style['background-color'] = 'rgba(45,62,80,0.79)';
    style['padding-bottom'] = '60px';
    style['padding-top'] = '60px';
    style['z-index'] = '1111';
    return container;
  };

  var createPromptsUI = function createPromptsUI() {
    var overlay = createOverlayContainer();
    overlay.appendChild(createIframe());
    return overlay;
  };

  var calculateSize = function calculateSize(size) {
    return typeof size === 'string' ? size : size + "px";
  };

  return {
    loadIframe: function loadIframe() {
      var existingPrompt = mainDocument.getElementById(PROMPTS_CONTAINER_ID);

      if (existingPrompt) {
        debug('Prompts iframe is already loaded. Nothing to do.');
        return;
      }

      var promptsElement = createPromptsUI();
      mainDocument.body.appendChild(promptsElement);
    },
    resize: function resize(_ref) {
      var height = _ref.height,
          width = _ref.width;
      var iframe = mainDocument.getElementById(PROMPTS_IFRAME_ID);
      var iframeStyle = iframe.style;

      if (height) {
        iframeStyle.height = calculateSize(height);
      }

      if (width) {
        iframeStyle.height = calculateSize(width);
      }
    },
    show: function show() {
      var container = mainDocument.getElementById(PROMPTS_CONTAINER_ID);
      container.style.display = 'block';
    },
    close: function close() {
      var container = mainDocument.getElementById(PROMPTS_CONTAINER_ID);
      container.remove();
    }
  };
};

export default ModalPromptsUI();