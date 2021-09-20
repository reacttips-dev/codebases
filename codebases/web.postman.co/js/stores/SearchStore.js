import { observable, action } from 'mobx';

class TeamStore {

  @observable traceId = '';
  @observable relatedCollectionsTraceId = '';

  @action
  updateTraceId (traceId) {
    this.traceId = traceId || '';
  }

  @action
  clear () {
    this.traceId = '';
  }

  @action
  updateRelatedCollectionsTraceId (traceId) {
    this.relatedCollectionsTraceId = traceId || '';
  }

  @action
  clearRelatedCollectionTraceId () {
    this.relatedCollectionsTraceId = '';
  }
}

// We are specifically importing the search store without using the get-store abstraction.
// Therefore we are essentially exporting a single instance of searchStore.
// This ensures that get-store and normal imports return the
export default new TeamStore();
