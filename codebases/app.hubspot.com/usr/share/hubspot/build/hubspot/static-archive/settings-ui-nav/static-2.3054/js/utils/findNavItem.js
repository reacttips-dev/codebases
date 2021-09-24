'use es6';

var findNavItem = function findNavItem(pathname, navGroups) {
  if (!navGroups) {
    return undefined;
  }

  var match;
  navGroups.some(function (navGroup) {
    if (!navGroup) {
      return false;
    }

    navGroup.some(function (navItem) {
      var found = navItem.findMatchingItem(pathname);

      if (found) {
        match = found;
        return true;
      }

      return false;
    });

    if (match) {
      return true;
    }

    return false;
  });
  return match;
};

export default findNavItem;