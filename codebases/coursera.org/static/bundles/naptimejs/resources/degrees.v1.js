import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import certificateSlugs from 'bundles/naptimejs/util/certificateSlugs';
import NaptimeResource from './NaptimeResource';

// Manually filter out certificates until we distinguish between degrees and certificates on the backend
function isNotCertificate(degree) {
  return degree.slug && !certificateSlugs.includes(degree.slug);
}

class Degree extends NaptimeResource {
  static RESOURCE_NAME = 'degrees.v1';

  @requireFields('slug')
  static degreesByCourse(courseId, options = {}) {
    return this.finder(
      'byCourseId',
      Object.assign(
        {
          params: { courseId },
        },
        options
      ),
      (degrees) => degrees.filter(isNotCertificate)[0] || null
    );
  }

  @requireFields('slug')
  static degreesByS12n(s12nId, options = {}) {
    return this.finder(
      'byS12nId',
      Object.assign(
        {
          params: { s12nId },
        },
        options
      ),
      (degrees) => degrees.filter(isNotCertificate)[0] || null
    );
  }

  @requireFields('slug')
  static degreesBySlug(slug, options = {}) {
    return this.finder(
      'bySlug',
      Object.assign(
        {
          params: { slug },
        },
        options
      ),
      (degrees) => degrees.filter(isNotCertificate)[0] || null
    );
  }

  @requireFields('partnerId')
  static degreesByPartnerId(partnerId, options = {}) {
    return this.finder(
      'byPartnerId', 
      Object.assign(
        {
          params: { partnerId },
        },
        options
      ),
      (degrees) => degrees.filter(isNotCertificate) || null
    );
  }
}

export default Degree;
