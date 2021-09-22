var _require = require('preact'),
    h = _require.h;

var classNames = require('classnames');

var ignoreEvent = require('../utils/ignoreEvent.js');

function PickerPanelContent(props) {
  return h("div", {
    class: classNames('uppy-DashboardContent-panel', props.className),
    role: "tabpanel",
    "data-uppy-panelType": "PickerPanel",
    id: "uppy-DashboardContent-panel--" + props.activePickerPanel.id,
    onDragOver: ignoreEvent,
    onDragLeave: ignoreEvent,
    onDrop: ignoreEvent,
    onPaste: ignoreEvent
  }, h("div", {
    class: "uppy-DashboardContent-bar"
  }, h("div", {
    class: "uppy-DashboardContent-title",
    role: "heading",
    "aria-level": "1"
  }, props.i18n('importFrom', {
    name: props.activePickerPanel.name
  })), h("button", {
    class: "uppy-DashboardContent-back",
    type: "button",
    onclick: props.hideAllPanels
  }, props.i18n('done'))), h("div", {
    class: "uppy-DashboardContent-panelBody"
  }, props.getPlugin(props.activePickerPanel.id).render(props.state)));
}

module.exports = PickerPanelContent;