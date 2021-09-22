import concatName from 'bundles/catalogP/lib/concatName';
import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import config from 'js/app/config';
import path from 'js/lib/path';
import NaptimeResource from './NaptimeResource';

class Instructor extends NaptimeResource {
  static RESOURCE_NAME = 'instructors.v1';

  @requireFields('fullName', 'prefixName', 'firstName', 'middleName', 'lastName', 'suffixName')
  get fullDisplayName() {
    return (
      this.fullName ||
      concatName({
        prefix: this.prefixName,
        first: this.firstName,
        middle: this.middleName,
        last: this.lastName,
        suffix: this.suffixName,
      })
    );
  }

  @requireFields('firstName', 'lastName')
  get displayName() {
    return concatName({
      first: this.firstName,
      last: this.lastName,
    });
  }

  @requireFields('shortName', 'id')
  get link() {
    return path.join('/', 'instructor', this.shortName || '~' + this.id);
  }

  @requireFields('photo')
  get photoOrAvatar() {
    return this.photo || path.join(config.url.assets, 'images/icons/avatar.jpg');
  }

  @requireFields('fullDisplayName')
  get shouldDisplay() {
    // the instructor schema has no flag to check whether an instructor
    // has been filled out, so we use the full name to determine if an
    // instructor has been filled out (and should be displayed)
    return !!this.fullDisplayName;
  }

  @requireFields('displayOnPartnerPage', 'shouldDisplay')
  get shouldDisplayOnPartnerPage() {
    return this.shouldDisplay && this.displayOnPartnerPage;
  }
}

export default Instructor;
