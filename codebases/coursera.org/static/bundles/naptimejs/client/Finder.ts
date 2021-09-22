import Uri from 'jsuri';
import { NaptimeResourceType } from 'bundles/naptimejs/resources/NaptimeResource';
import NaptimeClient, { NaptimeClientQuery, NaptimeClientDataProcessor } from './NaptimeClient';

class Finder<Result, Resource extends NaptimeResourceType> extends NaptimeClient<Result, Resource> {
  finderName: string;

  static validateUrl(url: string) {
    const uri = new Uri(url);
    return uri.hasQueryParam('q');
  }

  constructor(
    resource: Resource,
    finderName: string,
    params?: NaptimeClientQuery,
    dataProcessor?: NaptimeClientDataProcessor<Result, Resource[]>
  ) {
    super(resource, params, dataProcessor);
    this.finderName = finderName;
  }

  getBaseUri() {
    const uri = new Uri(`/api/${this.resourceName}`);
    uri.addQueryParam('q', this.finderName);
    return uri;
  }

  isValid() {
    return this.finderName !== undefined;
  }

  getClientIdentifier() {
    return `Finder:${this.finderName}|${super.getClientIdentifier()}`;
  }
}

export default Finder;
