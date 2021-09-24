'use es6';

import { Record, List } from 'immutable';
import { DISABLED } from './ConnectedAccountFeatureStates';
import EmailAlias from './EmailAlias';
var EmailAliasList = Record({
  aliases: List(),
  state: DISABLED
}, 'EmailAliasList');

EmailAliasList.fromJS = function (json) {
  if (!json || typeof json !== 'object') {
    return null;
  }

  return EmailAliasList(Object.assign({}, json, {
    aliases: json.aliases ? List(json.aliases.map(EmailAlias.fromJS)) : List()
  }));
};

export default EmailAliasList;