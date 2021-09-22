function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

/**
 * Adapted from preact-virtual-list: https://github.com/developit/preact-virtual-list
 *
 * © 2016 Jason Miller
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Adaptations:
 * - Added role=presentation to helper elements
 * - Tweaked styles for Uppy's Dashboard use case
 */
var _require = require('preact'),
    h = _require.h,
    Component = _require.Component;

var STYLE_INNER = {
  position: 'relative',
  // Disabled for our use case: the wrapper elements around FileList already deal with overflow,
  // and this additional property would hide things that we want to show.
  //
  // overflow: 'hidden',
  width: '100%',
  minHeight: '100%'
};
var STYLE_CONTENT = {
  position: 'absolute',
  top: 0,
  left: 0,
  // Because the `top` value gets set to some offset, this `height` being 100% would make the scrollbar
  // stretch far beyond the content. For our use case, the content div actually can get its height from
  // the elements inside it, so we don't need to specify a `height` property at all.
  //
  // height: '100%',
  width: '100%',
  overflow: 'visible'
};

var VirtualList = /*#__PURE__*/function (_Component) {
  _inheritsLoose(VirtualList, _Component);

  function VirtualList(props) {
    var _this;

    _this = _Component.call(this, props) || this; // The currently focused node, used to retain focus when the visible rows change.
    // To avoid update loops, this should not cause state updates, so it's kept as a plain property.

    _this.handleResize = function () {
      _this.resize();
    };

    _this.handleScroll = function () {
      _this.setState({
        offset: _this.base.scrollTop
      });

      if (_this.props.sync) {
        _this.forceUpdate();
      }
    };

    _this.focusElement = null;
    _this.state = {
      offset: 0,
      height: 0
    };
    return _this;
  }

  var _proto = VirtualList.prototype;

  _proto.resize = function resize() {
    if (this.state.height !== this.base.offsetHeight) {
      this.setState({
        height: this.base.offsetHeight
      });
    }
  };

  _proto.componentWillUpdate = function componentWillUpdate() {
    if (this.base.contains(document.activeElement)) {
      this.focusElement = document.activeElement;
    }
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    // Maintain focus when rows are added and removed.
    if (this.focusElement && this.focusElement.parentNode && document.activeElement !== this.focusElement) {
      this.focusElement.focus();
    }

    this.focusElement = null;
    this.resize();
  };

  _proto.componentDidMount = function componentDidMount() {
    this.resize();
    window.addEventListener('resize', this.handleResize);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  };

  _proto.render = function render(_ref) {
    var data = _ref.data,
        rowHeight = _ref.rowHeight,
        renderRow = _ref.renderRow,
        _ref$overscanCount = _ref.overscanCount,
        overscanCount = _ref$overscanCount === void 0 ? 10 : _ref$overscanCount,
        sync = _ref.sync,
        props = _objectWithoutPropertiesLoose(_ref, ["data", "rowHeight", "renderRow", "overscanCount", "sync"]);

    var _this$state = this.state,
        offset = _this$state.offset,
        height = _this$state.height; // first visible row index

    var start = Math.floor(offset / rowHeight); // actual number of visible rows (without overscan)

    var visibleRowCount = Math.floor(height / rowHeight); // Overscan: render blocks of rows modulo an overscan row count
    // This dramatically reduces DOM writes during scrolling

    if (overscanCount) {
      start = Math.max(0, start - start % overscanCount);
      visibleRowCount += overscanCount;
    } // last visible + overscan row index + padding to allow keyboard focus to travel past the visible area


    var end = start + visibleRowCount + 4; // data slice currently in viewport plus overscan items

    var selection = data.slice(start, end);

    var styleInner = _extends({}, STYLE_INNER, {
      height: data.length * rowHeight
    });

    var styleContent = _extends({}, STYLE_CONTENT, {
      top: start * rowHeight
    }); // The `role="presentation"` attributes ensure that these wrapper elements are not treated as list
    // items by accessibility and outline tools.


    return h("div", _extends({
      onScroll: this.handleScroll
    }, props), h("div", {
      role: "presentation",
      style: styleInner
    }, h("div", {
      role: "presentation",
      style: styleContent
    }, selection.map(renderRow))));
  };

  return VirtualList;
}(Component);

module.exports = VirtualList;