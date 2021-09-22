import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Q from 'q';
import OpenCourseEnrollModal from 'bundles/certificate-enroll/components/OpenCourseEnrollModal';
import S12nEnrollModal from 'bundles/s12n-enroll/components/StandaloneEnrollModal';
import ContentRequiresEnrollModal from 'bundles/ondemand/components/ContentRequiresEnrollModal';
import courseMembershipPromise from 'pages/open-course/common/promises/membership';
import membership from 'pages/open-course/common/promises/membership';
import { primaryS12ns } from 'bundles/s12n-common/service/promises/s12ns';

const UserRejectedEnrollPromptException = function () {};

const ensureEnrolled = (userId, course, verificationDisplay) => {
  const courseId = course.get('id');

  return courseMembershipPromise(userId, courseId).then((courseMembership) => {
    if (courseMembership.hasEnrolledRole()) {
      return Q();
    } else {
      return primaryS12ns(courseId, userId).then((s12nCollection) => {
        const s12n = s12nCollection.at(0);

        // Note: Hack to allow full access payers to enroll in courses that
        // were not launched when they purchased. Once pre-enrollment is available,
        // we'll make bulk payers pre-enroll and won't need to rely on this.
        if (s12n && verificationDisplay.get('productOwnership.owns')) {
          return membership(userId, courseId).invoke('enroll');
        }

        const deferred = Q.defer();
        const mountNode = $('<div></div>').appendTo('body');

        let component;

        if (s12n) {
          component = React.createElement(S12nEnrollModal, {
            s12nId: s12n.get('id'),
            courseIdOverride: courseId,
            showFreeOption: !s12n.get('membership').isEnrolled(),
            isContentGate: true,
            onFail: deferred.reject.bind(deferred, new UserRejectedEnrollPromptException()),
            onEnroll: deferred.resolve,
          });

          ReactDOM.render(component, mountNode.get(0));
        } else if (course.isCertificatePurchaseEnabled()) {
          if ($('.rc-PhoenixEnrollModal').length === 0) {
            // Bugfix: some pages already have phoenix enroll modal (e.g., join course banner),
            // causing all modals to appear. We should append a new modal iff none is present
            component = React.createElement(OpenCourseEnrollModal, { course });
            ReactDOM.render(component, mountNode.get(0));
          }
        } else {
          // use the Standard modal only if we need it
          component = React.createElement(ContentRequiresEnrollModal, {
            course,
            onClose: deferred.reject.bind(deferred, new UserRejectedEnrollPromptException()),
          });
          ReactDOM.render(component, mountNode.get(0));
        }

        return deferred.promise.finally(mountNode.remove.bind(mountNode));
      });
    }
  });
};

ensureEnrolled.UserRejectedEnrollPromptException = UserRejectedEnrollPromptException;

export default ensureEnrolled;
