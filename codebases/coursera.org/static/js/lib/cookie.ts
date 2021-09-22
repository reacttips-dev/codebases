/* eslint-disable no-param-reassign */
const identity = (x: any) => x;

type SetOptions = {
  days?: number;
  minutes?: number;
  expires?: Date | number;
  path?: string;
  raw?: boolean;
  domain?: string;
  secure?: boolean;
};

type GetOptions = {
  raw?: boolean;
};

type RemoveOptions = {
  path?: string;
  domain?: string;
  secure?: boolean;
  days?: number;
};

export const get = function (key: string, options?: GetOptions): string | null {
  options = options || {};
  const decode = options.raw ? identity : decodeURIComponent;

  const pairs = document.cookie.split('; ');
  for (let i = 0, pair; pairs[i]; i += 1) {
    pair = pairs[i].split('=');
    // IE saves cookies with empty string as 'c; ',
    // e.g. without '=' as opposed to EOMB, thus pair[1] may be undefined
    if (decode(pair[0]) === key) {
      const val = decode(pair[1] || '');
      return val === 'null' ? null : val;
    }
  }

  return null;
};

export const set = function (key: string, value?: {} | null, options?: SetOptions): string {
  options = options || {};
  const currentTime = new Date();

  if (value === null || value === undefined) {
    options.days = -1;
  }

  if (typeof options.days === 'number') {
    currentTime.setDate(currentTime.getDate() + options.days);
    options.expires = currentTime;
  } else if (typeof options.minutes === 'number') {
    currentTime.setMinutes(currentTime.getMinutes() + options.minutes);
    options.expires = new Date(currentTime);
  } else if (typeof options.expires === 'number') {
    const days = options.expires;
    const t = new Date();
    t.setDate(t.getDate() + days);
    options.expires = t;
  }

  if (!options.path) options.path = '/';

  const encode = options.raw ? identity : encodeURIComponent;
  let cookie = encode(key) + '=' + encode(String(value)) + '; path=' + options.path;

  // use expires attribute, max-age is not supported by IE
  if (options.expires) cookie += '; expires=' + options.expires.toUTCString();
  if (options.domain) cookie += '; domain=' + options.domain;
  if (options.secure) cookie += '; secure';

  document.cookie = cookie;

  return cookie;
};

export const setOnce = function (key: string, value: string, options: SetOptions): string {
  let currentValue = get(key, options);
  if (currentValue === null) {
    set(key, value, options);
    currentValue = value;
  }

  return currentValue;
};

export const remove = function (key: string, options?: RemoveOptions): void {
  options = options || {};
  options.days = -1;
  set(key, null, options);
};

export const removeAll = function (keys: string, options: RemoveOptions): void {
  for (let i = keys.length; i >= 0; i -= 1) {
    remove(keys[i], options);
  }
};

export default {
  set,
  setOnce,
  get,
  remove,
  removeAll,
};
