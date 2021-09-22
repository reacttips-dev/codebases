import Uri from 'jsuri';
import { NaptimeResourceType } from 'bundles/naptimejs/resources/NaptimeResource';
import NaptimeClient from './NaptimeClient';

class GetAll<Resource extends NaptimeResourceType> extends NaptimeClient<InstanceType<Resource>[]> {
  static validateUrl(url: string) {
    const uri = new Uri(url);
    const regex = /.*api\/\w+\.v[0-9]+(?!\/?\w+)/i;
    return regex.test(url) && !uri.hasQueryParam('ids') && !uri.hasQueryParam('q');
  }

  getClientIdentifier() {
    return `Get:*|${super.getClientIdentifier()}`;
  }
}

export default GetAll;
