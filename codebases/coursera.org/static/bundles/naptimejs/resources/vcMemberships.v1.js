import path from 'js/lib/path';
import constants from 'bundles/catalogP/constants';
import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import NaptimeResource from './NaptimeResource';

class VcMemberships extends NaptimeResource {
  static RESOURCE_NAME = 'vcMemberships.v1';

  @requireFields('certificateCode')
  get certificateLink() {
    return this.certificateCode && path.join(constants.accomplishments.baseUrl, 'records', this.certificateCode);
  }

  @requireFields('certificateCode')
  get fullCertificateLink() {
    return this.certificateCode && path.join(constants.config.url.base, this.certificateLink);
  }
}

export default VcMemberships;
