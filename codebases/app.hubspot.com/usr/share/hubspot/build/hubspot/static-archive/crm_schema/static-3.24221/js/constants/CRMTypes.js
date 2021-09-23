'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as ObjectTypes from 'customer-data-objects/constants/ObjectTypes';
export var types = {
  companies: ObjectTypes.COMPANY,
  contacts: ObjectTypes.CONTACT,
  deals: ObjectTypes.DEAL,
  engagements: ObjectTypes.ENGAGEMENT,
  tasks: ObjectTypes.TASK,
  tickets: ObjectTypes.TICKET,
  visits: ObjectTypes.VISIT
};
export var lookup = Object.keys(types).reduce(function (prev, typeKey) {
  return Object.assign({}, prev, _defineProperty({}, types[typeKey], typeKey));
}, {});