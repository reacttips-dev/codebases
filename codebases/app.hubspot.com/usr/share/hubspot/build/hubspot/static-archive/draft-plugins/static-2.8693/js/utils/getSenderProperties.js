'use es6';

import I18n from 'I18n';
import { Map as ImmutableMap, List } from 'immutable';
var options = ['firstname', 'lastname', 'fullname', 'email', 'phonenumber'];

function makeProperty(name) {
  return ImmutableMap({
    label: I18n.text("draftPlugins.mergeTagGroupPlugin.senderProperties.properties." + name),
    name: name
  });
}

export default function () {
  return List([ImmutableMap({
    displayName: I18n.text('draftPlugins.mergeTagGroupPlugin.senderProperties.groupDisplayName'),
    name: 'senderInfo',
    properties: List(options).map(makeProperty)
  })]);
}