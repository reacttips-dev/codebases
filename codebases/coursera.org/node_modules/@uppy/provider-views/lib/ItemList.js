function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var _require = require('preact'),
    h = _require.h;

var Item = require('./Item/index');

var getSharedProps = function getSharedProps(fileOrFolder, props) {
  return {
    id: fileOrFolder.id,
    title: fileOrFolder.name,
    getItemIcon: function getItemIcon() {
      return fileOrFolder.icon;
    },
    isChecked: props.isChecked(fileOrFolder),
    toggleCheckbox: function toggleCheckbox(e) {
      return props.toggleCheckbox(e, fileOrFolder);
    },
    columns: props.columns,
    showTitles: props.showTitles,
    viewType: props.viewType,
    i18n: props.i18n
  };
};

module.exports = function (props) {
  if (!props.folders.length && !props.files.length) {
    return h("div", {
      class: "uppy-Provider-empty"
    }, props.i18n('noFilesFound'));
  }

  return h("div", {
    class: "uppy-ProviderBrowser-body"
  }, h("ul", {
    class: "uppy-ProviderBrowser-list",
    onscroll: props.handleScroll,
    role: "listbox" // making <ul> not focusable for firefox
    ,
    tabindex: "-1"
  }, props.folders.map(function (folder) {
    return Item(_extends({}, getSharedProps(folder, props), {
      type: 'folder',
      isDisabled: props.isChecked(folder) ? props.isChecked(folder).loading : false,
      handleFolderClick: function handleFolderClick() {
        return props.handleFolderClick(folder);
      }
    }));
  }), props.files.map(function (file) {
    return Item(_extends({}, getSharedProps(file, props), {
      type: 'file',
      isDisabled: false
    }));
  })));
};