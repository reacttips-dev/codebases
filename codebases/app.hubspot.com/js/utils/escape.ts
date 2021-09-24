export var escape = function escape(string) {
  if (typeof string !== 'string') {
    return string;
  }

  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&grave;',
    '=': '&#x3D;'
  };
  var reg = /[&<>"'`=]/gi;
  var firstPass = string.replace(reg, function (match) {
    return map[match];
  });

  if (firstPass.match(/&lt;\/b&gt;/g)) {
    firstPass = ("" + firstPass.replace(/&lt;b&gt;/g, '<b>')).replace(/&lt;\/b&gt;/g, '</b>');
  }

  if (firstPass.match(/&lt;a class&#x3D;&quot;spellCheck&quot;&gt;/g)) {
    firstPass = ("" + firstPass.replace(/&lt;a class&#x3D;&quot;spellCheck&quot;&gt;/g, '<a class="spellCheck">')).replace(/&lt;\/b&gt;/g, '</a>');
  }

  return firstPass;
};