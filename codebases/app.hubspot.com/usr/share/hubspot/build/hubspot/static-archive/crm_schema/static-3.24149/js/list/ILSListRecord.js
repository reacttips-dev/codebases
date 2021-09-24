'use es6';

import { Map as ImmutableMap } from 'immutable';
import { OBJECT_LIST } from 'customer-data-objects/constants/ObjectTypes';
import makeObjectRecord from 'customer-data-objects/record/makeObjectRecord';
var ILSListRecord = makeObjectRecord({
  idKey: 'id',
  objectType: OBJECT_LIST,
  recordName: 'ILSListRecord',
  defaults: {
    classicListId: null,
    description: null,
    filterBranch: null,
    folderId: null,
    folderName: null,
    id: null,
    listReferenceCount: 0,
    listReferences: {
      name: null,
      referenceId: null,
      referenceType: null
    },
    membershipCount: null,
    metadata: ImmutableMap({
      authorId: null,
      createdAt: 0,
      definitionUpdatedAt: 0,
      deletedAt: 0,
      processingStatus: null,
      updatedAt: 0
    }),
    name: null,
    objectTypeId: null,
    processingType: null,
    version: null
  }
}, {
  primary: ['name'],
  secondary: ['id']
});
var DefaultEmptyList = ILSListRecord();

ILSListRecord.getDefaultList = function () {
  return DefaultEmptyList;
};

ILSListRecord.isDefaultList = function (instance) {
  return instance === DefaultEmptyList;
};

export default ILSListRecord;