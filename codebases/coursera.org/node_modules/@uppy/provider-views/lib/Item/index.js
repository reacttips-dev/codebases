function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var _require = require('preact'),
    h = _require.h;

var classNames = require('classnames');

var ItemIcon = require('./components/ItemIcon');

var GridLi = require('./components/GridLi');

var ListLi = require('./components/ListLi');

module.exports = function (props) {
  var itemIconString = props.getItemIcon();
  var className = classNames('uppy-ProviderBrowserItem', {
    'uppy-ProviderBrowserItem--selected': props.isChecked
  }, {
    'uppy-ProviderBrowserItem--noPreview': itemIconString === 'video'
  });
  var itemIconEl = h(ItemIcon, {
    itemIconString: itemIconString
  });

  switch (props.viewType) {
    case 'grid':
      return h(GridLi, _extends({}, props, {
        className: className,
        itemIconEl: itemIconEl
      }));

    case 'list':
      return h(ListLi, _extends({}, props, {
        className: className,
        itemIconEl: itemIconEl
      }));

    default:
      throw new Error("There is no such type " + props.viewType);
  }
};