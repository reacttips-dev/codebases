import formatName from 'I18n/utils/formatName';

var memoize = function memoize(func) {
  var cache = {};
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var key = JSON.stringify(args);

    if (cache.hasOwnProperty(key)) {
      return cache[key];
    }

    var result = func.apply(void 0, args);
    cache[key] = result;
    return result;
  };
};

export var formatUserFullNameForDisplay = function formatUserFullNameForDisplay(user) {
  var email = user.email,
      firstName = user.firstName,
      lastName = user.lastName;

  if (!firstName || !lastName) {
    return email;
  }

  return formatName({
    firstName: firstName,
    lastName: lastName
  }) + " (" + email + ")";
}; // If both userA and userB have first/last name, sort by first name alphabetically.
// if both userA and userB only have emails, sort by email alphabetically.
// If only one user has a name, that gets sorted above users who only have an email.

export var getSortedUsers = memoize(function (users) {
  return users.sort(function (userA, userB) {
    var userAemail = userA.email,
        userAfirstName = userA.firstName,
        userAlastName = userA.lastName;
    var userBemail = userB.email,
        userBfirstName = userB.firstName,
        userBlastName = userB.lastName;

    if (userAfirstName && userBfirstName) {
      return ("" + userAfirstName + userAlastName).toLocaleLowerCase() > ("" + userBfirstName + userBlastName).toLocaleLowerCase() ? 1 : -1;
    }

    if (userAfirstName && !userBfirstName) {
      return -1;
    }

    if (!userAfirstName && userBfirstName) {
      return 1;
    }

    return userAemail.toLocaleLowerCase() > userBemail.toLocaleLowerCase() ? 1 : -1;
  });
});
export var formatOwnerName = function formatOwnerName(ownerInfo) {
  return formatName({
    firstName: ownerInfo.first_name,
    lastName: ownerInfo.last_name,
    email: ownerInfo.email
  });
};