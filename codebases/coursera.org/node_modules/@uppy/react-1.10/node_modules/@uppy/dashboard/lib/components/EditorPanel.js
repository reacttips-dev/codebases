var _require = require('preact'),
    h = _require.h;

var classNames = require('classnames');

function EditorPanel(props) {
  var file = this.props.files[this.props.fileCardFor];
  return h("div", {
    class: classNames('uppy-DashboardContent-panel', props.className),
    role: "tabpanel",
    "data-uppy-panelType": "FileEditor",
    id: "uppy-DashboardContent-panel--editor"
  }, h("div", {
    class: "uppy-DashboardContent-bar"
  }, h("div", {
    class: "uppy-DashboardContent-title",
    role: "heading",
    "aria-level": "1"
  }, props.i18nArray('editing', {
    file: h("span", {
      class: "uppy-DashboardContent-titleFile"
    }, file.meta ? file.meta.name : file.name)
  })), h("button", {
    class: "uppy-DashboardContent-back",
    type: "button",
    onclick: props.hideAllPanels
  }, props.i18n('done'))), h("div", {
    class: "uppy-DashboardContent-panelBody"
  }, props.editors.map(function (target) {
    return props.getPlugin(target.id).render(props.state);
  })));
}

module.exports = EditorPanel;