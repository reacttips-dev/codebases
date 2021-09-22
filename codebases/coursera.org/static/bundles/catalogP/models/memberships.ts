import _ from 'underscore';
import CatalogCollection from 'bundles/catalogP/models/catalogCollection';
import Membership from 'bundles/catalogP/models/membership';

const Memberships = CatalogCollection.extend({
  model: Membership,
  resourceName: 'memberships.v1',

  getEnrolledSessions() {
    return this.pluck('session');
  },

  getMembershipsForSession(session: $TSFixMe) {
    return new Memberships(
      this.findWhere({
        v1SessionId: session.get('id'),
      })
    );
  },

  getMembershipsForVCSession(session: $TSFixMe) {
    return new Memberships(
      this.getMembershipsForSession(session).filter(function (membership: $TSFixMe) {
        return membership.get('vcMembership');
      })
    );
  },

  filterByProgressStatus(status: $TSFixMe) {
    const validStatus = _(Membership.PROGRESS).chain().values().contains(status).value();
    if (!validStatus) {
      throw new Error('Invalid Progress Status: ' + status);
    } else {
      return new Memberships(
        this.filter(function (membership: $TSFixMe) {
          return membership.getCourseProgressStatus() === status;
        })
      );
    }
  },

  filterByOnDemand() {
    return new Memberships(
      this.filter(function (membership: $TSFixMe) {
        return membership.get('course').isOnDemand();
      })
    );
  },

  filterBySessionVerifiedCertificate() {
    return new Memberships(
      this.filter(function (membership: $TSFixMe) {
        return membership.hasSessionVerifiedCertificate();
      })
    );
  },

  filterByOnDemandVerifiedCertificate() {
    return new Memberships(
      this.filter(function (membership: $TSFixMe) {
        return membership.hasOnDemandVerifiedCertificate();
      })
    );
  },

  filterByEnrolledForOnDemandVerification() {
    return new Memberships(
      this.filter(function (membership: $TSFixMe) {
        return membership.hasEnrolledForOnDemandVerification();
      })
    );
  },

  filterByPassedWithoutVC() {
    return new Memberships(
      this.filter(function (membership: $TSFixMe) {
        return membership.hasPassedWithoutVC() || membership.hasPassedCapstone();
      })
    );
  },

  filterBySessionCertificatesReleased() {
    return new Memberships(
      this.filter(function (membership: $TSFixMe) {
        return membership.get('course').isSession() && membership.get('session.certificatesReleased');
      })
    );
  },

  filterByPassed() {
    return new Memberships(
      this.filter(function (membership: $TSFixMe) {
        return membership.hasPassed() || membership.hasPassed(true);
      })
    );
  },

  filterByPassedWithVC() {
    return new Memberships(
      this.filter(function (membership: $TSFixMe) {
        return membership.hasPassed(true);
      })
    );
  },

  getMembershipsWithHighestGrade(forVC: $TSFixMe) {
    if (this.length) {
      return this.max(function (membership: $TSFixMe) {
        return membership.getCourseGrade(forVC).score;
      });
    } else {
      return undefined;
    }
  },
});

export default Memberships;
