import Q from 'q';
import _ from 'underscore';
import S12nCollection from 'bundles/catalogP/models/s12ns';
import s12nPromise from 'bundles/catalogP/promises/s12ns';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import s12nPricePromise from 'bundles/payments/promises/s12nPrice';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import vcPricesPromise from 'bundles/payments/promises/vcPrices';

const fields = [
  'capstone',
  'cmlDescription',
  'description',
  'interchangeableCourseIds',
  'productVariant',
  'launchedAt',
  'logo',
  'metadata',
  'partnerLogoOverrides',
  'premiumExperienceVariant',
  'projectsOverview',
  'tagline',
];

const includes = {
  partners: {
    fields: ['description', 'squareLogo', 'classLogo'],
  },
  instructors: {
    fields: ['shortName', 'profileId'],
    includes: {
      partners: {
        fields: ['name'],
      },
    },
  },
  courses: {
    fields: [
      'name',
      'description',
      'workload',
      'subtitleLanguages',
      'courseType',
      'startDate',
      'v2Details',
      'courseStatus',
    ],
    includes: {
      v2Details: {
        fields: ['plannedLaunchDate', 'sessionsEnabledAt'],
        includes: {
          sessions: {},
        },
      },
      courseProgress: {},
      memberships: {
        fields: ['grade', 'vcMembershipId'],
      },
      vcMemberships: {
        fields: ['certificateCode'],
      },
      subtitleLanguages: {},
      instructors: {
        fields: ['shortName', 'prefixName', 'firstName', 'middleName', 'lastName', 'suffixName', 'photo', 'title'],
      },
    },
  },
};

const minimalFields = ['interchangeableCourseIds', 'launchedAt', 'logo', 'metadata', 'premiumExperienceVariant'];

const minimalIncludes = {
  membership: {
    includes: {
      courses: {
        includes: {
          v2Details: {
            includes: {
              sessions: {},
            },
          },
        },
      },
      suggestedSessionSchedule: {
        fields: ['suggestedSessions'],
      },
    },
  },
  partners: {
    fields: ['name', 'homeLink'],
  },
  courses: {
    fields: ['startDate', 'description'],
    includes: {
      v2Details: {
        fields: ['plannedLaunchDate'],
        includes: {
          sessions: {},
        },
      },
      courseProgress: {},
      memberships: {
        fields: ['grade', 'vcMembershipId'],
      },
      vcMemberships: {
        fields: ['certificateCode'],
      },
    },
  },
  memberships: {},
};

const handleOptions = (options: $TSFixMe) => {
  if (options.includeMembership) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'membership' does not exist on type '{ pa... Remove this comment to see the full error message
    includes.membership = {
      fields: ['createdAt', 'updatedAt', 'status', 'role', 'eligibleForCapstone', 'completionStatus'],
      includes: {},
    };
  }
};

const addPrices = (s12n: $TSFixMe) => {
  const courseIds = s12n.get('courses').map((course: $TSFixMe) => course.get('id'));

  return Q.all([s12nPricePromise(s12n.get('id')), vcPricesPromise(courseIds)])
    .spread(function (s12nPrice, vcPrices) {
      s12n.set({ price: s12nPrice });

      s12n.get('courses').each(function (course: $TSFixMe) {
        const vcPrice = _(vcPrices).findWhere({
          productItemId: course.get('id'),
        });
        course.set('price', vcPrice);
      });
      return s12n;
    })
    .catch(function () {
      return Q(s12n);
    });
};

const addPricesToRawS12n = (rawS12n: $TSFixMe) => {
  const { id, courseIds } = rawS12n;

  return Q.all([s12nPricePromise(id), vcPricesPromise(courseIds)])
    .spread((s12nPrice, vcPrices) => {
      rawS12n.price = s12nPrice;
      return rawS12n;
    })
    .catch(() => rawS12n);
};

export const fromId = (s12nId: $TSFixMe, options: $TSFixMe) => {
  if (options) {
    handleOptions(options);
  }

  return s12nPromise({
    id: s12nId,
    fields,
    includes,
  })
    .then(function (s12nCollection: $TSFixMe) {
      return s12nCollection.at(0);
    })
    .then(addPrices);
};

export const fromSlug = (s12nSlug: $TSFixMe, options: $TSFixMe) => {
  if (options) {
    handleOptions(options);
  }
  return s12nPromise({
    q: 'slug',
    slug: s12nSlug,
    fields,
    includes,
  })
    .then(function (s12nCollection: $TSFixMe) {
      if (s12nCollection.length > 0) {
        return s12nCollection.at(0);
      } else {
        throw new Error('No specialization with that slug exists.');
      }
    })
    .then(addPrices);
};

/**
 * Fetches the primary specializations that an On-Demand course belongs to, and returns it as a backbone model.
 *
 * Returns `undefined` if there is no specialization that the course belongs to.
 *
 * `userId` is optional because primary s12ns exist for anonymous users.
 */
export const primaryS12ns = (courseId: $TSFixMe, userId: $TSFixMe) => {
  if (!courseId) {
    return Q.reject(new Error('Missing courseId argument'));
  }

  return s12nPromise({
    q: 'primary',
    courseId,
    userId,
    fields: minimalFields,
    includes: minimalIncludes,
  })
    .then((s12nCollection: $TSFixMe) => {
      return Q.allSettled(s12nCollection.map(addPrices)).then(() => s12nCollection);
    })
    .catch(() => new S12nCollection());
};

/**
 * Fetches the primary specialization that an On-Demand course belongs to, and returns it as a plain json object.
 *
 * Returns `undefined` if there is no specialization that the course belongs to.
 *
 * `userId` is optional because primary s12ns exist for anonymous users.
 */
export const rawPrimaryS12ns = (courseId: $TSFixMe, userId: $TSFixMe) => {
  if (!courseId) {
    return Q.reject(new Error('Missing courseId argument'));
  }

  const options = {
    q: 'primary',
    courseId,
    userId,
    fields: minimalFields,
    includes: minimalIncludes,
  };

  return s12nPromise(options, true)
    .then((rawS12ns: $TSFixMe) => Q.allSettled(rawS12ns.elements.map(addPricesToRawS12n)).then(() => rawS12ns))
    .catch(() => []);
};

export default {
  fromId,
  fromSlug,
  primaryS12ns,
  rawPrimaryS12ns,
};
