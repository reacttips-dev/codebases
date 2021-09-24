'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import getSenderProperties from './getSenderProperties';

function getDefaultProperties() {
  return ImmutableMap({
    contactProperties: List(),
    companyProperties: List(),
    dealProperties: List(),
    ticketProperties: List(),
    senderProperties: getSenderProperties(),
    placeholderProperties: List()
  });
}

export default function (properties) {
  return getDefaultProperties().merge(properties);
}