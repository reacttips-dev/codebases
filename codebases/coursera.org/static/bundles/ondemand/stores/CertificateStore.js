import _ from 'lodash';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
import Memberships from 'bundles/catalogP/models/memberships';
import createLinkedModels from 'bundles/catalogP/lib/createLinkedModels';

const SERIALIZED_PROPS = ['loaded', 'rawMemberships'];

class CertificateStore extends BaseStore {
  static storeName = 'CertificateStore';

  static handlers = {
    LOAD_MEMBERSHIPS(rawMemberships) {
      this.loaded = true;
      this.rawMemberships = rawMemberships;
      this.initializeMembershipsModel();

      this.emitChange();
    },
  };

  constructor(dispatcher) {
    super(dispatcher);

    this.loaded = false;
    this.memberships = {};
    this.rawMemberships = null;
  }

  dehydrate() {
    return _.pick(this, ...SERIALIZED_PROPS);
  }

  rehydrate(state) {
    Object.assign(this, _.pick(state, ...SERIALIZED_PROPS));
    this.initializeMembershipsModel();
  }

  hasLoaded() {
    return this.loaded;
  }

  initializeMembershipsModel() {
    if (this.rawMemberships) {
      const memberships = createLinkedModels(Memberships.prototype.resourceName, this.rawMemberships);

      memberships.each((membership) => {
        this.memberships[membership.get('course').get('id')] = membership;
      });
    }
  }

  passedWithVerification(courseId: string) {
    /*
     * NOTE: membership.hasVerifiedCertificate returns true if a user has passed the course with
     * verification (even if a course certificate has not been issued)
     */
    const membership = this.memberships[courseId];
    return membership && membership.hasVerifiedCertificate();
  }

  /**
   * Returns true if certificate exists, false if membership does not exist or if certificate has not yet been earned.
   * Note that this behavior differs from many other common store functions - this function will never return undefined
   * in the case that the membership does not exist.
   */
  hasCertificate({ courseId }: { courseId: string }) {
    const membership = this.memberships[courseId];
    return !!membership && typeof membership.get('vcMembership.certificateCode') !== 'undefined';
  }

  getCertificateLink({ courseId }: { courseId: string }) {
    if (this.hasCertificate({ courseId })) {
      return this.memberships[courseId].getFullCertificateLink();
    }

    return null;
  }

  getCourseCertificateGrantTime({ courseId }: { courseId: string }) {
    if (this.hasCertificate({ courseId })) {
      return this.memberships[courseId].get('vcMembership.grantedAt');
    }

    return null;
  }

  getCourseGradeTimestamp({ courseId }: { courseId: string }) {
    if (this.passedWithVerification(courseId)) {
      return this.memberships[courseId].getCourseGrade().timestamp;
    }

    return null;
  }

  /* Returns the course grade timestamp if a certificate has not been issued yet, otherwise returns
   * the certificate grant time.
   */
  getCourseCompletionTime({ courseId }: { courseId: string }) {
    if (this.passedWithVerification(courseId)) {
      return this.hasCertificate({ courseId })
        ? this.getCourseCertificateGrantTime({ courseId })
        : this.getCourseGradeTimestamp({ courseId });
    }

    return null;
  }
}

export default CertificateStore;
