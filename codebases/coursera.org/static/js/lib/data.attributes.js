import $ from 'jquery';

const DataAttributes = function ($) {
  const parse = function (el, defaults, _prefix) {
    // TODO
    // read all data- attributes if no defaults is given? (can we do this?)
    const settings = {};
    const prefix = _prefix || '';

    for (const key in defaults) {
      const pkey = prefix + key.replace(/\./g, '-');
      const attr = $(el).attr(pkey);

      // if the attr doesn't appear, then we are the default
      if (attr === undefined) settings[key] = defaults[key];
      // if it does appear but it is empty or the value is 'true' then set it to true
      // if the key is the same as the value, that is indicative of an empty value as well
      else if ((typeof attr === 'string' && attr.length === 0) || /^\s*true\s*$/.test(attr) || pkey == attr)
        settings[key] = true;
      // if the value is 'false' set it to false
      else if (/^\s*false\s*$/.test(attr)) settings[key] = false;
      // otherwise, just set it to the string value
      else settings[key] = attr;
    }

    return settings;
  };

  const exports = {
    parse,
  };

  return exports;
};

export default DataAttributes($);
