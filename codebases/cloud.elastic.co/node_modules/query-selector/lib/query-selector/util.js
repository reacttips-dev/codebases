/**
 * attr fix for old ie
 * @author yiminghe@gmail.com
 */
var R_BOOLEAN = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
  R_FOCUSABLE = /^(?:button|input|object|select|textarea)$/i,
  R_CLICKABLE = /^a(?:rea)?$/i,
  R_INVALID_CHAR = /:|^on/;

var attrFix = {},
  propFix,
  attrHooks = {
    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
    tabindex: {
      get: function (el) {
        // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
        var attributeNode = el.getAttributeNode('tabindex');
        return attributeNode && attributeNode.specified ?
          parseInt(attributeNode.value, 10) :
          R_FOCUSABLE.test(el.nodeName) ||
          R_CLICKABLE.test(el.nodeName) && el.href ?
            0 :
            undefined;
      }
    }
  },
  boolHook = {
    get: function (elem, name) {
      // 转发到 prop 方法
      return elem[propFix[name] || name] ?
        // 根据 w3c attribute , true 时返回属性名字符串
        name.toLowerCase() :
        undefined;
    }
  },
  attrNodeHook = {};

attrHooks.style = {
  get: function (el) {
    return el.style.cssText;
  }
};

propFix = {
  hidefocus: 'hideFocus',
  tabindex: 'tabIndex',
  readonly: 'readOnly',
  'for': 'htmlFor',
  'class': 'className',
  maxlength: 'maxLength',
  cellspacing: 'cellSpacing',
  cellpadding: 'cellPadding',
  rowspan: 'rowSpan',
  colspan: 'colSpan',
  usemap: 'useMap',
  frameborder: 'frameBorder',
  contenteditable: 'contentEditable'
};

var ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
var doc = typeof document !== 'undefined' ? document : {};

function numberify(s) {
  var c = 0;
  // convert '1.2.3.4' to 1.234
  return parseFloat(s.replace(/\./g, function () {
    return (c++ === 0) ? '.' : '';
  }));
}

function ieVersion() {
  var m, v;
  if ((m = ua.match(/MSIE ([^;]*)|Trident.*; rv(?:\s|:)?([0-9.]+)/)) &&
    (v = (m[1] || m[2]))) {
    return doc.documentMode || numberify(v);
  }
}

function mix(s, t) {
  for (var p in t) {
    s[p] = t[p];
  }
}

function each(arr, fn) {
  var i = 0, l = arr.length;
  for (; i < l; i++) {
    if (fn(arr[i], i) === false) {
      break;
    }
  }
}
var ie = ieVersion();

if (ie && ie < 8) {
  attrHooks.style.set = function (el, val) {
    el.style.cssText = val;
  };

  // get attribute value from attribute node for ie
  mix(attrNodeHook, {
    get: function (elem, name) {
      var ret = elem.getAttributeNode(name);
      // Return undefined if attribute node specified by user
      return ret && (
        // fix #100
      ret.specified || ret.nodeValue) ?
        ret.nodeValue :
        undefined;
    }
  });

  // ie6,7 不区分 attribute 与 property
  mix(attrFix, propFix);

  // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
  attrHooks.tabIndex = attrHooks.tabindex;

  // 不光是 href, src, 还有 rowspan 等非 mapping 属性，也需要用第 2 个参数来获取原始值
  // 注意 colSpan rowSpan 已经由 propFix 转为大写
  each(['href', 'src', 'width', 'height', 'colSpan', 'rowSpan'], function (name) {
    attrHooks[name] = {
      get: function (elem) {
        var ret = elem.getAttribute(name, 2);
        return ret === null ? undefined : ret;
      }
    };
  });

  attrHooks.placeholder = {
    get: function (elem, name) {
      return elem[name] || attrNodeHook.get(elem, name);
    }
  };
}

if (ie) {
  var hrefFix = attrHooks.href = attrHooks.href || {};
  hrefFix.set = function (el, val, name) {
    var childNodes = el.childNodes,
      b,
      len = childNodes.length,
      allText = len > 0;
    for (len = len - 1; len >= 0; len--) {
      if (childNodes[len].nodeType !== 3) {
        allText = 0;
      }
    }
    if (allText) {
      b = el.ownerDocument.createElement('b');
      b.style.display = 'none';
      el.appendChild(b);
    }
    el.setAttribute(name, '' + val);
    if (b) {
      el.removeChild(b);
    }
  };
}

var RE_TRIM = /^[\s\xa0]+|[\s\xa0]+$/g,
  trim = String.prototype.trim;
var SPACE = ' ';

var getElementsByTagName;
getElementsByTagName = function (name, context) {
  return context.getElementsByTagName(name);
};

if (doc.createElement) {
  var div = doc.createElement('div');
  div.appendChild(document.createComment(''));
  if (div.getElementsByTagName('*').length) {
    getElementsByTagName = function (name, context) {
      var nodes = context.getElementsByTagName(name),
        needsFilter = name === '*';
      // <input id='length'>
      if (needsFilter || typeof nodes.length !== 'number') {
        var ret = [],
          i = 0,
          el;
        while ((el = nodes[i++])) {
          if (!needsFilter || el.nodeType === 1) {
            ret.push(el);
          }
        }
        return ret;
      } else {
        return nodes;
      }
    };
  }
}

var compareNodeOrder = ('sourceIndex' in (doc && doc.documentElement || {})) ? function (a, b) {
  return a.sourceIndex - b.sourceIndex;
} : function (a, b) {
  if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
    return a.compareDocumentPosition ? -1 : 1;
  }
  var bit = a.compareDocumentPosition(b) & 4;
  return bit ? -1 : 1;
};

var util = module.exports = {
  ie: ie,

  unique: (function () {
    var hasDuplicate,
      baseHasDuplicate = true;

    // Here we check if the JavaScript engine is using some sort of
    // optimization where it does not always call our comparison
    // function. If that is the case, discard the hasDuplicate value.
    // Thus far that includes Google Chrome.
    [0, 0].sort(function () {
      baseHasDuplicate = false;
      return 0;
    });

    function sortOrder(a, b) {
      if (a === b) {
        hasDuplicate = true;
        return 0;
      }

      return compareNodeOrder(a, b);
    }

    // 排序去重
    return function (elements) {
      hasDuplicate = baseHasDuplicate;
      elements.sort(sortOrder);

      if (hasDuplicate) {
        var i = 1, len = elements.length;
        while (i < len) {
          if (elements[i] === elements[i - 1]) {
            elements.splice(i, 1);
            --len;
          } else {
            i++;
          }
        }
      }
      return elements;
    };
  })(),

  getElementsByTagName: getElementsByTagName,

  getSimpleAttr: function (el, name) {
    var ret = el && el.getAttributeNode(name);
    if (ret && ret.specified) {
      return 'value' in ret ? ret.value : ret.nodeValue;
    }
    return undefined;
  },

  contains: ie ? function (a, b) {
    if (a.nodeType === 9) {
      a = a.documentElement;
    }
    // !a.contains => a===document || text
    // 注意原生 contains 判断时 a===b 也返回 true
    b = b.parentNode;

    if (a === b) {
      return true;
    }

    // when b is document, a.contains(b) 不支持的接口 in ie
    if (b && b.nodeType === 1) {
      return a.contains && a.contains(b);
    } else {
      return false;
    }
  } : function (a, b) {
    return !!(a.compareDocumentPosition(b) & 16);
  },

  isTag: function (el, value) {
    return value === '*' || el.nodeName.toLowerCase() === value.toLowerCase();
  },

  hasSingleClass: function (el, cls) {
    // consider xml
    // https://github.com/kissyteam/kissy/issues/532
    var className = el && util.getSimpleAttr(el, 'class');
    return className && (className = className.replace(/[\r\t\n]/g, SPACE)) &&
      (SPACE + className + SPACE).indexOf(SPACE + cls + SPACE) > -1;
  },

  startsWith: function (str, prefix) {
    return str.lastIndexOf(prefix, 0) === 0;
  },

  endsWith: function (str, suffix) {
    var ind = str.length - suffix.length;
    return ind >= 0 && str.indexOf(suffix, ind) === ind;
  },

  trim: trim ?
    function (str) {
      return str == null ? '' : trim.call(str);
    } :
    function (str) {
      return str == null ? '' : (str + '').replace(RE_TRIM, '');
    },

  attr: function (el, name) {
    var attrNormalizer, ret;
    // scrollLeft
    name = name.toLowerCase();
    // custom attrs
    name = attrFix[name] || name;
    if (R_BOOLEAN.test(name)) {
      attrNormalizer = boolHook;
    } else if (R_INVALID_CHAR.test(name)) {
      // only old ie?
      attrNormalizer = attrNodeHook;
    } else {
      attrNormalizer = attrHooks[name];
    }
    if (el && el.nodeType === 1) {
      // browsers index elements by id/name on forms, give priority to attributes.
      if (el.nodeName.toLowerCase() === 'form') {
        attrNormalizer = attrNodeHook;
      }
      if (attrNormalizer && attrNormalizer.get) {
        return attrNormalizer.get(el, name);
      }
      ret = el.getAttribute(name);
      if (ret === '') {
        var attrNode = el.getAttributeNode(name);
        if (!attrNode || !attrNode.specified) {
          return undefined;
        }
      }
      // standard browser non-existing attribute return null
      // ie<8 will return undefined , because it return property
      // so norm to undefined
      return ret === null ? undefined : ret;
    }
  }
};