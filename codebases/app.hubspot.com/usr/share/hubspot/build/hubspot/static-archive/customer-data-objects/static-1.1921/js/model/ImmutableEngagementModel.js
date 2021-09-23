'use es6';

import { COMPANY, CONTACT, DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { List } from 'immutable';
import * as ImmutableModel from './ImmutableModel';
var emptyList = List();
export var getIdKey = ImmutableModel.getIdKey;
export var getId = ImmutableModel.getId;
export var getObjectType = ImmutableModel.getObjectType;
export function getAssociationPath(associationObjectType) {
  switch (associationObjectType) {
    case COMPANY:
      return ['associations', 'companyIds'];

    case CONTACT:
      return ['associations', 'contactIds'];

    case DEAL:
      return ['associations', 'dealIds'];

    case TICKET:
      return ['associations', 'ticketIds'];

    default:
      return undefined;
  }
}
export function getAssociations(record, associationObjectType) {
  var path = getAssociationPath(associationObjectType);

  if (!path) {
    return emptyList;
  }

  return record.getIn(path) || emptyList;
}

function _parseProperty(property) {
  if (property === 'task.taskType') {
    property = 'metadata.taskType';
  }

  return property.split('.');
}

export function getProperty(record, property) {
  return record.getIn(_parseProperty(property));
}
export function hasProperty(record, property) {
  return record.hasIn(_parseProperty(property));
}
export function setProperty(record, property, value) {
  return record.setIn(_parseProperty(property.split('.')), value);
}
export function toString(record) {
  return getProperty(record, 'metadata.body') || getProperty(record, 'metadata.text');
}