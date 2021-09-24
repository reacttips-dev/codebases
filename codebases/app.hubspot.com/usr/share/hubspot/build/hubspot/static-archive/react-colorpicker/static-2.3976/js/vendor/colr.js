'use strict';

var colrConvert = {
  grayscale: {
    rgb: grayscale2rgb,
  },
  hex: {
    rgb: hex2rgb,
  },
  rgb: {
    hsl: rgb2hsl,
    hsv: rgb2hsv,
    hex: rgb2hex,
    grayscale: rgb2grayscale,
  },
  hsl: {
    rgb: hsl2rgb,
    hsv: hsl2hsv,
  },
  hsv: {
    rgb: hsv2rgb,
    hsl: hsv2hsl,
  },
};

// convert a charcode to a hex val
function hexVal(c) {
  return c < 58
    ? c - 48 // 0 - 9
    : c < 71
    ? c - 55 // A - F
    : c - 87; // a - f
}

function hex2rgb(hex) {
  var i = hex[0] === '#' ? 1 : 0;
  var len = hex.length;

  if (len - i < 3) {
    throw new Error('hex input must be at least three chars long');
  }

  var r, g, b;

  var h1 = hexVal(hex.charCodeAt(0 + i));
  var h2 = hexVal(hex.charCodeAt(1 + i));
  var h3 = hexVal(hex.charCodeAt(2 + i));

  if (len - i >= 6) {
    r = (h1 << 4) + h2;
    g = (h3 << 4) + hexVal(hex.charCodeAt(3 + i));
    b = (hexVal(hex.charCodeAt(4 + i)) << 4) + hexVal(hex.charCodeAt(5 + i));
  } else {
    r = (h1 << 4) + h1;
    g = (h2 << 4) + h2;
    b = (h3 << 4) + h3;
  }

  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error('hex input is invalid');
  }

  return [r, g, b];
}

function rgb2hex(rgb) {
  return (
    '#' +
    ('000000' + ((rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16)).slice(
      -6
    )
  );
}

function rgb2hsl(rgb) {
  var r = rgb[0] / 255;
  var g = rgb[1] / 255;
  var b = rgb[2] / 255;

  var min = Math.min(r, g, b);
  var max = Math.max(r, g, b);
  var delta = max - min;
  var h, s, l;

  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else if (b === max) {
    h = 4 + (r - g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) {
    h += 360;
  }

  l = (min + max) / 2;

  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }

  return [h, s * 100, l * 100];
}

function rgb2hsv(rgb) {
  var r = rgb[0];
  var g = rgb[1];
  var b = rgb[2];
  var min = Math.min(r, g, b);
  var max = Math.max(r, g, b);
  var delta = max - min;
  var h, s, v;

  if (max === 0) {
    s = 0;
  } else {
    s = (delta / max) * 100;
  }

  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else if (b === max) {
    h = 4 + (r - g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) {
    h += 360;
  }

  v = (max / 255) * 100;

  return [h, s, v];
}

function hsl2rgb(hsl) {
  var h = hsl[0] / 360;
  var s = hsl[1] / 100;
  var l = hsl[2] / 100;

  var r, g, b;

  if (s === 0) {
    // monochrome
    r = g = b = l;
  } else {
    var q = l < 0.5 ? l * (s + 1) : l + s - l * s;
    var p = 2 * l - q;
    var t;

    // red
    t = h + 1 / 3;
    if (t < 0) {
      t += 1;
    } else if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      r = p + (q - p) * t * 6;
    } else if (t < 1 / 2) {
      r = q;
    } else if (t < 2 / 3) {
      r = p + (q - p) * (2 / 3 - t) * 6;
    } else {
      r = p;
    }

    // green
    t = h;
    if (t < 0) {
      t += 1;
    } else if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      g = p + (q - p) * t * 6;
    } else if (t < 1 / 2) {
      g = q;
    } else if (t < 2 / 3) {
      g = p + (q - p) * (2 / 3 - t) * 6;
    } else {
      g = p;
    }

    // blue
    t = h - 1 / 3;
    if (t < 0) {
      t += 1;
    } else if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      b = p + (q - p) * t * 6;
    } else if (t < 1 / 2) {
      b = q;
    } else if (t < 2 / 3) {
      b = p + (q - p) * (2 / 3 - t) * 6;
    } else {
      b = p;
    }
  }

  return [r * 255, g * 255, b * 255];
}

function hsl2hsv(hsl) {
  var h = hsl[0];
  var s = hsl[1] / 100;
  var l = hsl[2] / 100;
  var sv, v;

  if (s === 0) {
    return [h, 0, l * 100];
  }

  if (l === 0) {
    return [h, 0, 0];
  }

  l *= 2;
  s *= l <= 1 ? l : 2 - l;
  v = (l + s) / 2;
  sv = (2 * s) / (l + s);
  return [h, sv * 100, v * 100];
}

function hsv2rgb(hsv) {
  var h = hsv[0] / 60;
  var s = hsv[1] / 100;
  var v = hsv[2] / 100;

  var hi = Math.floor(h) % 6;

  var f = h - Math.floor(h);
  var p = 255 * v * (1 - s);
  var q = 255 * v * (1 - s * f);
  var t = 255 * v * (1 - s * (1 - f));
  v = 255 * v;

  switch (hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
}

function hsv2hsl(hsv) {
  var h = hsv[0];
  var s = hsv[1] / 100;
  var v = hsv[2] / 100;
  var sl, l;

  if (s === 0) {
    return [h, 0, v * 100];
  }

  if (v === 0) {
    return [h, 0, 0];
  }

  l = (2 - s) * v;
  sl = s * v;
  sl /= l <= 1 ? l : 2 - l;
  l /= 2;
  return [h, sl * 100, l * 100];
}

function grayscale2rgb(value) {
  return [value, value, value];
}

function rgb2grayscale(rgb) {
  return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
}

/*
 * DEPENDENCIES
 */

/*
 * CONSTRUCTOR
 */

function Colr() {
  if (this instanceof Colr === false) {
    return new Colr();
  }
  this._ = {};
}

/*
 * STATIC METHODS
 */

Colr.fromHex = function(hex) {
  return new Colr().fromHex(hex);
};

Colr.fromGrayscale = function(value) {
  return new Colr().fromGrayscale(value);
};

Colr.fromRgb = function(r, g, b) {
  return new Colr().fromRgb(r, g, b);
};

Colr.fromRgbArray = function(arr) {
  return new Colr().fromRgb(arr[0], arr[1], arr[2]);
};

Colr.fromRgbObject = function(obj) {
  return new Colr().fromRgb(obj.r, obj.g, obj.b);
};
Colr.fromHsl = function(h, s, l) {
  return new Colr().fromHsl(h, s, l);
};

Colr.fromHslArray = function(arr) {
  return new Colr().fromHsl(arr[0], arr[1], arr[2]);
};

Colr.fromHslObject = function(obj) {
  return new Colr().fromHsl(obj.h, obj.s, obj.l);
};

Colr.fromHsv = function(h, s, v) {
  return new Colr().fromHsv(h, s, v);
};

Colr.fromHsvArray = function(arr) {
  return new Colr().fromHsv(arr[0], arr[1], arr[2]);
};

Colr.fromHsvObject = function(obj) {
  return new Colr().fromHsv(obj.h, obj.s, obj.v);
};

/*
 * IMPORTERS
 */

// HEX

Colr.prototype.fromHex = function(input) {
  var value = colrConvert.hex.rgb(input);
  this._ = { rgb: value };
  return this;
};

// GRAYSCALE

Colr.prototype.fromGrayscale = function(input) {
  input = clampByte(input);
  var value = colrConvert.grayscale.rgb(input);
  this._ = { rgb: value };
  return this;
};

// RGB

Colr.prototype.fromRgb = function(r, g, b) {
  if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') {
    throw new Error('Arguments must be numbers');
  }
  var value = clampRgb(r, g, b);
  this._ = { rgb: value };
  return this;
};

Colr.prototype.fromRgbArray = function(arr) {
  return this.fromRgb(arr[0], arr[1], arr[2]);
};

Colr.prototype.fromRgbObject = function(obj) {
  return this.fromRgb(obj.r, obj.g, obj.b);
};

// HSL

Colr.prototype.fromHsl = function(h, s, l) {
  if (typeof h !== 'number' || typeof s !== 'number' || typeof l !== 'number') {
    throw new Error('Arguments must be numbers');
  }
  this._ = { hsl: clampHsx(h, s, l) };
  return this;
};

Colr.prototype.fromHslArray = function(arr) {
  return this.fromHsl(arr[0], arr[1], arr[2]);
};

Colr.prototype.fromHslObject = function(obj) {
  return this.fromHsl(obj.h, obj.s, obj.l);
};

// HSV

Colr.prototype.fromHsv = function(h, s, v) {
  if (typeof h !== 'number' || typeof s !== 'number' || typeof v !== 'number') {
    throw new Error('Arguments must be numbers');
  }
  this._ = { hsv: clampHsx(h, s, v) };
  return this;
};

Colr.prototype.fromHsvArray = function(arr) {
  return this.fromHsv(arr[0], arr[1], arr[2]);
};

Colr.prototype.fromHsvObject = function(obj) {
  return this.fromHsv(obj.h, obj.s, obj.v);
};

/*
 * EXPORTERS
 */

// HEX

Colr.prototype.toHex = function() {
  var cached = this._.hex;
  if (cached !== undefined) {
    return cached;
  }

  var input;
  var cachedFrom = this._.rgb;

  if (cachedFrom !== undefined) {
    input = cachedFrom;
  } else {
    input = this.toRawRgbArray();
  }

  input[0] = Math.round(input[0]);
  input[1] = Math.round(input[1]);
  input[2] = Math.round(input[2]);

  var value = colrConvert.rgb.hex(input);
  this._.hex = value;

  return value;
};

// GRAYSCALE

Colr.prototype.toGrayscale = function() {
  var cached = this._.grayscale;
  if (cached !== undefined) {
    return cached;
  }

  var input;
  var cachedFrom = this._.rgb;

  if (cachedFrom !== undefined) {
    input = cachedFrom;
  } else {
    input = this.toRawRgbArray();
  }

  var value = colrConvert.rgb.grayscale(input);
  this._.grayscale = value;
  return value;
};

// RGB

Colr.prototype.toRawRgbArray = function() {
  var cached = this._.rgb;
  if (cached !== undefined) {
    return cached;
  }

  var value;

  if ((value = this._.hsv) !== undefined) {
    value = colrConvert.hsv.rgb(value);
  } else if ((value = this._.hsl) !== undefined) {
    value = colrConvert.hsl.rgb(value);
  } else {
    throw new Error('No data to convert');
  }

  this._.rgb = value;
  return value;
};

Colr.prototype.toRawRgbObject = function() {
  var arr = this.toRawRgbArray();
  return { r: arr[0], g: arr[1], b: arr[2] };
};

Colr.prototype.toRgbArray = function() {
  var arr = this.toRawRgbArray();
  return [Math.round(arr[0]), Math.round(arr[1]), Math.round(arr[2])];
};

Colr.prototype.toRgbObject = function() {
  var arr = this.toRgbArray();
  return { r: arr[0], g: arr[1], b: arr[2] };
};

// HSL

Colr.prototype.toRawHslArray = function() {
  var cached = this._.hsl;
  if (cached !== undefined) {
    return cached;
  }

  var value;

  if ((value = this._.hsv) !== undefined) {
    value = colrConvert.hsv.hsl(value);
  } else if ((value = this._.rgb) !== undefined) {
    value = colrConvert.rgb.hsl(value);
  } else {
    throw new Error('No data to convert');
  }

  this._.hsl = value;
  return value;
};

Colr.prototype.toRawHslObject = function() {
  var arr = this.toRawHslArray();
  return { h: arr[0], s: arr[1], l: arr[2] };
};

Colr.prototype.toHslArray = function() {
  var arr = this.toRawHslArray();
  return [Math.round(arr[0]), Math.round(arr[1]), Math.round(arr[2])];
};

Colr.prototype.toHslObject = function() {
  var arr = this.toHslArray();
  return { h: arr[0], s: arr[1], l: arr[2] };
};

// HSV

Colr.prototype.toRawHsvArray = function() {
  var cached = this._.hsv;
  if (cached !== undefined) {
    return cached;
  }

  var value;

  if ((value = this._.hsl) !== undefined) {
    value = colrConvert.hsl.hsv(value);
  } else if ((value = this._.rgb) !== undefined) {
    value = colrConvert.rgb.hsv(value);
  } else {
    throw new Error('No data to convert');
  }

  this._.hsv = value;
  return value;
};

Colr.prototype.toRawHsvObject = function() {
  var arr = this.toRawHsvArray();
  return { h: arr[0], s: arr[1], v: arr[2] };
};

Colr.prototype.toHsvArray = function() {
  var arr = this.toRawHsvArray();
  return [Math.round(arr[0]), Math.round(arr[1]), Math.round(arr[2])];
};

Colr.prototype.toHsvObject = function() {
  var arr = this.toHsvArray();
  return { h: arr[0], s: arr[1], v: arr[2] };
};

/*
 * MODIFIERS
 */

Colr.prototype.lighten = function(amount) {
  var hsl = this.toRawHslArray();
  hsl[2] = clampPercentage(hsl[2] + amount);
  this._ = { hsl: hsl };
  return this;
};

Colr.prototype.darken = function(amount) {
  var hsl = this.toRawHslArray();
  hsl[2] = clampPercentage(hsl[2] - amount);
  this._ = { hsl: hsl };
  return this;
};

/*
 * MISC
 */

Colr.prototype.clone = function() {
  var colr = new Colr();
  colr._.hex = this._.hex;
  colr._.grayscale = this._.grayscale;

  if (this._.rgb !== undefined) {
    colr._.rgb = this._.rgb.slice(0);
  }
  if (this._.hsv !== undefined) {
    colr._.hsv = this._.hsv.slice(0);
  }
  if (this._.hsl !== undefined) {
    colr._.hsl = this._.hsl.slice(0);
  }

  return colr;
};

/*
 * UTILS
 */

function clampPercentage(val) {
  return Math.max(Math.min(val, 100), 0);
}

function clampByte(byte) {
  return Math.max(Math.min(byte, 255), 0);
}

function clampRgb(r, g, b) {
  return [
    Math.max(Math.min(r, 255), 0),
    Math.max(Math.min(g, 255), 0),
    Math.max(Math.min(b, 255), 0),
  ];
}

function clampHsx(h, s, x) {
  return [
    Math.max(Math.min(h, 360), 0),
    Math.max(Math.min(s, 100), 0),
    Math.max(Math.min(x, 100), 0),
  ];
}

var colr = Colr;

module.exports = colr;
