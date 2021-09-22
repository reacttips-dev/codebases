import Uri from 'jsuri';
import buildUri from 'bundles/naptimejs/util/buildUri';
import generateUniqueId from 'bundles/naptimejs/util/generateUniqueId';

class NaptimeMutationClient {
  constructor(resource, data) {
    this.resource = resource;
    this.resourceName = resource.RESOURCE_NAME;
    this.data = data || {};
    this.mutationId = generateUniqueId();
  }

  getBaseUri() {
    return new Uri(`/api/${this.resourceName}`);
  }

  getUri() {
    return buildUri(this.getBaseUri(), this.data.params);
  }

  get params() {
    return this.data.params;
  }

  get body() {
    return (this.data && this.data.body) || {};
  }

  setMutationId(id) {
    this.mutationId = id;
  }
}

export default NaptimeMutationClient;
