'use es6'; // HACK: This is also used in our quick-fetches. To keep
// their bundle sizes down, we directly hardcode the objectTypeIds.
// This prevents us from having to pull in code from customer-data-objects.
// We'll enforce that the types are correct via tests.

export var isMigratedObjectTypeId = function isMigratedObjectTypeId(objectTypeId) {
  return !['0-3', '0-5'].includes(objectTypeId);
};