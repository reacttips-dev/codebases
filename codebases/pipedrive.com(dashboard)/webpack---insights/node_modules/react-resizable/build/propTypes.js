"use strict";

exports.__esModule = true;
exports.resizableProps = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDraggable = require("react-draggable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resizableProps = {
  /*
  * Restricts resizing to a particular axis (default: 'both')
  * 'both' - allows resizing by width or height
  * 'x' - only allows the width to be changed
  * 'y' - only allows the height to be changed
  * 'none' - disables resizing altogether
  * */
  axis: _propTypes.default.oneOf(['both', 'x', 'y', 'none']),
  className: _propTypes.default.string,

  /*
  * Require that one and only one child be present.
  * */
  children: _propTypes.default.element.isRequired,

  /*
  * These will be passed wholesale to react-draggable's DraggableCore
  * */
  draggableOpts: _propTypes.default.shape({
    allowAnyClick: _propTypes.default.bool,
    cancel: _propTypes.default.string,
    children: _propTypes.default.node,
    disabled: _propTypes.default.bool,
    enableUserSelectHack: _propTypes.default.bool,
    offsetParent: _propTypes.default.node,
    grid: _propTypes.default.arrayOf(_propTypes.default.number),
    handle: _propTypes.default.string,
    nodeRef: _propTypes.default.object,
    onStart: _propTypes.default.func,
    onDrag: _propTypes.default.func,
    onStop: _propTypes.default.func,
    onMouseDown: _propTypes.default.func,
    scale: _propTypes.default.number
  }),

  /*
  * Initial height
  * */
  height: _propTypes.default.number.isRequired,

  /*
  * Customize cursor resize handle
  * */
  handle: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.func]),

  /*
  * If you change this, be sure to update your css
  * */
  handleSize: _propTypes.default.arrayOf(_propTypes.default.number),
  lockAspectRatio: _propTypes.default.bool,

  /*
  * Max X & Y measure
  * */
  maxConstraints: _propTypes.default.arrayOf(_propTypes.default.number),

  /*
  * Min X & Y measure
  * */
  minConstraints: _propTypes.default.arrayOf(_propTypes.default.number),

  /*
  * Called on stop resize event
  * */
  onResizeStop: _propTypes.default.func,

  /*
  * Called on start resize event
  * */
  onResizeStart: _propTypes.default.func,

  /*
  * Called on resize event
  * */
  onResize: _propTypes.default.func,

  /*
  * Defines which resize handles should be rendered (default: 'se')
  * 's' - South handle (bottom-center)
  * 'w' - West handle (left-center)
  * 'e' - East handle (right-center)
  * 'n' - North handle (top-center)
  * 'sw' - Southwest handle (bottom-left)
  * 'nw' - Northwest handle (top-left)
  * 'se' - Southeast handle (bottom-right)
  * 'ne' - Northeast handle (top-center)
  * */
  resizeHandles: _propTypes.default.arrayOf(_propTypes.default.oneOf(['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'])),

  /*
  * If `transform: scale(n)` is set on the parent, this should be set to `n`.
  * */
  transformScale: _propTypes.default.number,

  /*
   * Initial width
   */
  width: _propTypes.default.number.isRequired
};
exports.resizableProps = resizableProps;