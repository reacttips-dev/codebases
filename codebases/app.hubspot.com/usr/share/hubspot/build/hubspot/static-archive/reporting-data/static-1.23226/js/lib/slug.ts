export var slug = function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 75);
};