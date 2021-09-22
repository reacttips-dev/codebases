"use strict";

function Cache(options) {
  this.map = new Map;
  this.newest = null;
  this.oldest = null;
  this.max = options && options.max;
  this.dispose = options && options.dispose;
}

exports.Cache = Cache;

var Cp = Cache.prototype;

Cp.has = function (key) {
  return this.map.has(key);
};

Cp.get = function (key) {
  var entry = getEntry(this, key);
  return entry && entry.value;
};

function getEntry(cache, key) {
  var entry = cache.map.get(key);
  if (entry &&
      entry !== cache.newest) {
    var older = entry.older;
    var newer = entry.newer;

    if (newer) {
      newer.older = older;
    }

    if (older) {
      older.newer = newer;
    }

    entry.older = cache.newest;
    entry.older.newer = entry;

    entry.newer = null;
    cache.newest = entry;

    if (entry === cache.oldest) {
      cache.oldest = newer;
    }
  }

  return entry;
}

Cp.set = function (key, value) {
  var entry = getEntry(this, key);
  if (entry) {
    return entry.value = value;
  }

  entry = {
    key: key,
    value: value,
    newer: null,
    older: this.newest
  };

  if (this.newest) {
    this.newest.newer = entry;
  }

  this.newest = entry;
  this.oldest = this.oldest || entry;

  this.map.set(key, entry);

  return entry.value;
};

Cp.clean = function () {
  if (typeof this.max === "number") {
    while (this.oldest &&
           this.map.size > this.max) {
      this.delete(this.oldest.key);
    }
  }
};

Cp.delete = function (key) {
  var entry = this.map.get(key);
  if (entry) {
    if (entry === this.newest) {
      this.newest = entry.older;
    }

    if (entry === this.oldest) {
      this.oldest = entry.newer;
    }

    if (entry.newer) {
      entry.newer.older = entry.older;
    }

    if (entry.older) {
      entry.older.newer = entry.newer;
    }

    this.map.delete(key);

    if (typeof this.dispose === "function") {
      this.dispose(key, entry.value);
    }

    return true;
  }

  return false;
};
