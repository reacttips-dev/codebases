'use es6';

import UserProfileContainer from 'SalesTemplateEditor/data/UserProfileContainer';
import GateContainer from 'SalesTemplateEditor/data/GateContainer';
import ScopesContainer from 'SalesTemplateEditor/data/ScopesContainer';
export var unpackContext = function unpackContext(context) {
  var keys = Object.keys(context);
  keys.forEach(function (key) {
    var value = context[key];

    switch (key) {
      case 'userProfile':
        UserProfileContainer.set(value);
        break;

      case 'gates':
        GateContainer.set(value);
        break;

      case 'scopes':
        ScopesContainer.set(value);
        break;

      default:
        break;
    }
  });
};