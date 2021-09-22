import _tPartnerName from 'i18n!js/json/nls/universities';
import constants from 'bundles/catalogP/constants';
import CatalogModel from 'bundles/catalogP/models/catalogModel';
import imgix from 'js/lib/imgix';
import path from 'js/lib/path';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/l... Remove this comment to see the full error message
import STCert from 'js/lib/STCert';
import language from 'js/lib/language';

const Partner = CatalogModel.extend({
  includes: {
    instructors: {
      resource: 'instructors.v1',
      attribute: 'instructorIds',
    },
    courses: {
      resource: 'courses.v1',
      attribute: 'courseIds',
    },
  },

  resourceName: 'partners.v1',
  urlPath: 'partners',

  getLink() {
    return this.get('homeLink') || path.join(constants.config.dir.home, this.get('shortName'));
  },

  get(key: $TSFixMe) {
    const parentValue = this.constructor.__super__.get.apply(this, arguments);
    switch (key) {
      case 'name':
        return _tPartnerName(parentValue);
      default:
        return parentValue;
    }
  },

  getName() {
    return this.get('name');
  },

  getUnlocalizedName() {
    return this.constructor.__super__.get.apply(this, 'name');
  },

  // TODO(jnam) see if it's possible to actually localize the abbr name,
  // instead of returning the localized full partner name.
  getLocalizedAbbrName() {
    const userLanguageIsEnglish = language.getLanguageCode() === 'en';

    let localizedAbbrName = this.get('abbrName');

    if (!userLanguageIsEnglish) {
      localizedAbbrName = _tPartnerName(this.get('name'));
    }

    return localizedAbbrName;
  },

  getPrettyWebsiteUrl() {
    let url = this.get('links').website;
    url = url.replace(/^.*:\/\//, '');
    url = url.replace(/\/$/, '');
    return url;
  },

  getCertLogoUrlPromise() {
    return STCert.getSTCertIcon(this.get('shortName'));
  },

  getSquareLogo(options: $TSFixMe) {
    if (this.get('squareLogo')) {
      return imgix.processImage(this.get('squareLogo'), options || {});
    }
  },

  getLogoForCdp() {
    return this.get('classLogo') || this.get('logo');
  },

  getLogoForCertificate(options: $TSFixMe) {
    const logo = this.get('rectangularLogo') || this.get('logo') || this.get('classLogo') || this.get('squareLogo');

    return imgix.processImage(logo, options || {});
  },
});

export default Partner;
