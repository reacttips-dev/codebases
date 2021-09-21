function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EMPTY_ATTR_LIST = [];
export var NODE_TYPE_ELEMENT = 1;
export var NODE_TYPE_TEXT = 3;
export var NODE_TYPE_FRAGMENT = 11;
export var SELF_CLOSING = {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};
export var Node =
/*#__PURE__*/
function () {
  function Node() {
    _classCallCheck(this, Node);

    _defineProperty(this, "nodeType", void 0);

    _defineProperty(this, "nodeName", void 0);

    _defineProperty(this, "nodeValue", void 0);

    _defineProperty(this, "childNodes", void 0);
  }

  _createClass(Node, [{
    key: "toString",
    value: function toString(isXHTML) {
      return isXHTML ? '' : '';
    }
  }]);

  return Node;
}();
export var TextNode =
/*#__PURE__*/
function (_Node) {
  _inherits(TextNode, _Node);

  function TextNode(value) {
    var _this;

    _classCallCheck(this, TextNode);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextNode).apply(this, arguments));
    _this.nodeType = NODE_TYPE_TEXT;
    _this.nodeName = '#text';
    _this.nodeValue = value;
    return _this;
  } // eslint-disable-next-line no-unused-vars


  _createClass(TextNode, [{
    key: "toString",
    value: function toString(isXHTML) {
      return escape(this.nodeValue);
    }
  }]);

  return TextNode;
}(Node);
export var ElementNode =
/*#__PURE__*/
function (_Node2) {
  _inherits(ElementNode, _Node2);

  function ElementNode(name, attributes, childNodes) {
    var _this2;

    _classCallCheck(this, ElementNode);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ElementNode).apply(this, arguments));

    _defineProperty(_assertThisInitialized(_this2), "_name", void 0);

    _defineProperty(_assertThisInitialized(_this2), "_attrMap", void 0);

    _defineProperty(_assertThisInitialized(_this2), "_isSelfClosing", void 0);

    _defineProperty(_assertThisInitialized(_this2), "childNodes", void 0);

    _defineProperty(_assertThisInitialized(_this2), "attributes", void 0);

    if (attributes == null) {
      attributes = EMPTY_ATTR_LIST;
    }

    var isSelfClosing = SELF_CLOSING[name] === true;
    _this2.nodeType = NODE_TYPE_ELEMENT;
    _this2._name = name.toLowerCase();
    _this2.attributes = attributes;
    _this2._attrMap = new Map(attributes.map(function (attr) {
      return [attr.name, attr];
    }));
    _this2.nodeName = name.toUpperCase();
    _this2.childNodes = [];
    _this2._isSelfClosing = isSelfClosing;

    if (!isSelfClosing && childNodes) {
      childNodes.forEach(_this2.appendChild, _assertThisInitialized(_this2));
    }

    return _this2;
  }

  _createClass(ElementNode, [{
    key: "appendChild",
    value: function appendChild(node) {
      if (node.nodeType === NODE_TYPE_FRAGMENT && node.childNodes) {
        var _this$childNodes;

        this.childNodes && (_this$childNodes = this.childNodes).push.apply(_this$childNodes, _toConsumableArray(node.childNodes));
      } else {
        this.childNodes && this.childNodes.push(node);
      }
    }
  }, {
    key: "getAttribute",
    value: function getAttribute(name) {
      var attr = this._attrMap.get(name);

      if (attr) {
        return attr.value;
      }
    }
  }, {
    key: "toString",
    value: function toString(isXHTML) {
      var attributes = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _step.value,
              name = _step$value.name,
              value = _step$value.value;
          attributes.push(name + (value ? '="' + escapeAttr(value) + '"' : ''));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var attrString = attributes.length ? ' ' + attributes.join(' ') : '';

      if (this._isSelfClosing) {
        return '<' + this._name + attrString + (isXHTML ? '/>' : '>');
      }

      var childNodes = this.childNodes ? this.childNodes.map(function (node) {
        return node.toString(isXHTML);
      }).join('') : '';
      return '<' + this._name + attrString + '>' + childNodes + '</' + this._name + '>';
    }
  }, {
    key: "tagName",
    get: function get() {
      return this.nodeName;
    }
  }, {
    key: "className",
    get: function get() {
      return this.getAttribute('class') || '';
    }
  }]);

  return ElementNode;
}(Node);
export var FragmentNode =
/*#__PURE__*/
function (_Node3) {
  _inherits(FragmentNode, _Node3);

  function FragmentNode(childNodes) {
    var _this3;

    _classCallCheck(this, FragmentNode);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(FragmentNode).apply(this, arguments));

    _defineProperty(_assertThisInitialized(_this3), "childNodes", void 0);

    _this3.nodeType = NODE_TYPE_FRAGMENT;
    _this3.childNodes = [];

    if (childNodes) {
      childNodes.forEach(_this3.appendChild, _assertThisInitialized(_this3));
    }

    return _this3;
  }

  _createClass(FragmentNode, [{
    key: "appendChild",
    value: function appendChild(node) {
      if (node.nodeType === NODE_TYPE_FRAGMENT && node.childNodes) {
        var _this$childNodes2;

        this.childNodes && (_this$childNodes2 = this.childNodes).push.apply(_this$childNodes2, _toConsumableArray(node.childNodes));
      } else {
        this.childNodes && this.childNodes.push(node);
      }
    }
  }, {
    key: "toString",
    value: function toString(isXHTML) {
      var childNodes = this.childNodes;
      return childNodes ? childNodes.map(function (node) {
        return node.toString(isXHTML);
      }).join('') : '';
    }
  }]);

  return FragmentNode;
}(Node);

function escape(html) {
  return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(html) {
  return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}