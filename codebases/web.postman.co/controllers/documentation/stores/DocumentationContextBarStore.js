import { computed } from 'mobx';

import { DOCUMENTATION_ENTITY, DOCUMENTATION_LATEST_VERSION_STRING, DOCUMENTATION_STATUS } from '../constants';
import DocumentationMasterStore from './DocumentationMasterStore';

export default class DocumentationContextBarStore {
  static masterStoreGetMethod = {
    [DOCUMENTATION_ENTITY.COLLECTION]: 'getCollection',
    [DOCUMENTATION_ENTITY.FOLDER]: 'getFolder',
    [DOCUMENTATION_ENTITY.REQUEST]: 'getRequest'
  };

  /**
   * @param {String} entityType - The type of the entity
   * @param {String} entityUid - The uid of the entity in form of (ownerId-entityId)
   */
  constructor (entityType, entityUid) {
    this.entityType = entityType;
    this.entityUid = entityUid;

    this.masterStore = DocumentationMasterStore.getInstance();
  }

  get isOffline () {
    return this.masterStore.isOffline;
  }

  get isEditable () {
    return this.masterStore.isEditable;
  }

  get activeEnvironmentVariables () {
    return this.masterStore.activeEnvironmentVariables;
  }

  get isUserMemberOfActiveWorkspace () {
    return this.masterStore.isUserMemberOfActiveWorkspace;
  }

  @computed
  get entityData () {
    let { data, status } = this.masterStore.getData({
      uid: this.entityUid,
      type: this.entityType,
      versionTag: DOCUMENTATION_LATEST_VERSION_STRING
    }, {
      withPublishedData: true
    });
    return {
      isLoading: status === DOCUMENTATION_STATUS.LOADING,
      error: status === DOCUMENTATION_STATUS.ERROR,
      data
    };
  }

  @computed
  get parentCollectionData () {
    const { data } = this.entityData;

    if (this.entityType === DOCUMENTATION_ENTITY.COLLECTION) {
      return data;
    }

    if (!data) {
      return undefined;
    }

    const collectionUid = `${data.owner}-${data.collection}`;

    return this.masterStore.getData({
      uid: collectionUid,
      type: DOCUMENTATION_ENTITY.COLLECTION,
      versionTag: DOCUMENTATION_LATEST_VERSION_STRING
    }).data;
  }

  updateDescription (description) {
    this.masterStore.updateDescription(
      { type: this.entityType, uid: this.entityUid },
      description
    );
  }
}
