import specializationsCatalogPromise from 'bundles/catalogP/promises/specialization';
import Instructors from 'bundles/catalogP/models/instructors';

const fields = [
  'interchangeableMap',
  'interchangeableCourseIds',
  'primaryCourseIds',
  'partnerIds',
  'description',
  'id',
  'name',
  'shortName',
  'logo',
  'workload',
  'display',
  'details',
];

const includes = {
  partners: {
    fields: ['name', 'homeLink', 'shortName', 'logo', 'classLogo', 'description'],
  },
  instructors: {},
  interchangeableCourses: {},
  courses: {
    fields: [
      'courseType',
      'id',
      'name',
      'slug',
      'subtitleLanguages',
      'instructorIds',
      'courseStatus',
      'workload',
      'membershipIds',
    ],
    includes: {
      instructors: {
        fields: ['fullName', 'prefixName', 'firstName', 'middleName', 'lastName', 'suffixName', 'photo', 'title'],
      },
      primaryLanguages: {
        fields: ['englishName'],
      },
      memberships: {
        includes: {
          vcMembership: {
            fields: [],
          },
        },
      },
      details: {
        fields: ['name', 'shortName', 'ondemandCourseSlug', 'upcomingSessionId', 'aboutTheCourse'],
        includes: {
          sessions: {
            fields: [
              'active',
              'startDay',
              'startMonth',
              'startYear',
              'dbEndDate',
              'durationString',
              'hasSigTrack',
              'selfStudy',
              'study',
              'status',
            ],
            includes: {
              vcDetails: {
                fields: ['vcRegistrationOpen', 'vcPrice', 'vcRegularPrice'],
              },
            },
          },
        },
      },
    },
  },
};

export default (id: $TSFixMe) => {
  const promise = specializationsCatalogPromise({
    id,
    fields,
    includes,
  })
    .then((specializations: $TSFixMe) => specializations.at(0))
    .then((specialization: $TSFixMe) => {
      /* eslint-disable no-warning-comments */
      // HACK: Until instructors properly related on backend.
      const instructors = specialization
        .get('courses')
        .chain()
        .map((course: $TSFixMe) => course.get('instructors'))
        .invoke('toArray')
        .flatten()
        .uniq()
        .value();

      specialization.set('instructors', new Instructors(instructors));
      return specialization;
    });

  promise.done();
  return promise;
};
