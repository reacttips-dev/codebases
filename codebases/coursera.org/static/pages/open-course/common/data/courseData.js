/* Returns a promise for the course data object from the course data API. */

// TODO(lewis): Replace with more well defined error. We should NOT use a SSR error here.
import JSApplicationError from 'bundles/ssr/lib/errors/JSApplicationError';

import Q from 'q';
import _ from 'underscore';
import handleResponse from 'bundles/naptime/handleResponse';
import memoize from 'js/lib/memoize';
import api from 'pages/open-course/common/coursesApi';

const includes = ['instructorIds', 'partnerIds', '_links'].join(',');

const fields = [
  'brandingImage',
  'certificatePurchaseEnabledAt',
  'partners.v1(squareLogo,rectangularLogo)',
  'instructors.v1(fullName)',
  'overridePartnerLogos',
  'sessionsEnabledAt',
  'domainTypes',
  'premiumExperienceVariant',
  'isRestrictedMembership',
].join(',');

const getCourse = function (naptimeResponse) {
  if (!naptimeResponse.elements) {
    throw new JSApplicationError('Course data missing from response');
  }

  const course = naptimeResponse.elements[0];

  course.instructors = _(course.instructorIds).map(function (instructorId) {
    return naptimeResponse.getLinkedObject('instructors.v1', instructorId);
  });
  course.universities = _(course.partnerIds).map(function (partnerId) {
    return naptimeResponse.getLinkedObject('partners.v1', partnerId);
  });
  return course;
};

export const fromSlug = memoize(function (courseSlug) {
  if (!courseSlug) return Q.reject('Missing courseSlug argument');

  return Q(
    api.get('', {
      data: {
        q: 'slug',
        slug: courseSlug && courseSlug.toLowerCase(),
        includes,
        fields,
      },
    })
  )
    .then(handleResponse)
    .then(getCourse);
});

export const fromId = memoize(function (courseId) {
  if (!courseId) return Q.reject('Missing courseId argument');

  return Q(
    api.get(courseId, {
      data: {
        includes,
        fields,
      },
    })
  )
    .then(handleResponse)
    .then(getCourse);
});

export default { fromSlug, fromId };
