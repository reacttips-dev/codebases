import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import path from 'js/lib/path';
import NaptimeResource from './NaptimeResource';

class Partner extends NaptimeResource {
  static RESOURCE_NAME = 'partners.v1';

  @requireFields('links')
  get prettyWebsiteUrl() {
    let url = this.links.website;
    url = url.replace(/^.*:\/\//, '');
    url = url.replace(/\/$/, '');
    return url;
  }

  @requireFields('homeLink', 'shortName')
  get partnerPageUrl() {
    if (this.homeLink) {
      return this.homeLink;
    } else {
      return path.join('/', this.shortName);
    }
  }

  @requireFields('rectangularLogo', 'logo', 'classLogo', 'squareLogo')
  get logoForCert() {
    return this.rectangularLogo || this.logo || this.classLogo || this.squareLogo;
  }
}

export default Partner;
