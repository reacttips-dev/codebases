import constants from 'bundles/catalogP/constants';
import concatName from 'bundles/catalogP/lib/concatName';
import CatalogModel from 'bundles/catalogP/models/catalogModel';
import imgix from 'js/lib/imgix';
import path from 'js/lib/path';

const Instructor = CatalogModel.extend({
  includes: {
    partners: {
      resource: 'partners.v1',
      attribute: 'partnerIds',
    },
    courses: {
      resource: 'courses.v1',
      attribute: 'courseIds',
    },
  },

  resourceName: 'instructors.v1',

  urlPath: 'instructors',

  getFullName() {
    return (
      this.get('fullName') ||
      concatName({
        prefix: this.get('prefixName'),
        first: this.get('firstName'),
        middle: this.get('middleName'),
        last: this.get('lastName'),
        suffix: this.get('suffixName'),
      })
    );
  },

  getLink() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'home' does not exist on type 'UrlConfig'... Remove this comment to see the full error message
    return path.join(constants.config.url.home, 'instructor', this.get('shortName') || '~' + this.get('id'));
  },

  hasLink() {
    return this.get('shortName') || this.get('id');
  },

  getUniversity() {
    return this.get('universities').at(0);
  },

  getPrettyWebsite() {
    let url = this.get('websites').website;
    url = url.replace(/^.*:\/\//, '');
    url = url.replace(/\/$/, '');
    return url;
  },

  shouldDisplay() {
    // the instructor schema has no flag to check whether an instructor
    // has been filled out, so we use the full name to determine if an
    // instructor has been filled out (and should be displayed)
    return !!this.getFullName();
  },

  shouldDisplayOnPartnerPage() {
    return this.shouldDisplay() && this.get('displayOnPartnerPage');
  },

  getPhoto(width: $TSFixMe, height: $TSFixMe) {
    if (this.get('photo')) {
      return imgix.processImage(this.getPhotoSrc(), {
        width,
        height,
        fit: 'crop',
      });
    } else {
      return this.getPhotoSrc();
    }
  },

  getPhotoSrc() {
    if (this.get('photo')) {
      return this.get('photo');
    } else {
      // Return link to default 120x120 avatar.
      return path.join(constants.config.url.assets, 'images/icons/avatar.jpg');
    }
  },
});

export default Instructor;
