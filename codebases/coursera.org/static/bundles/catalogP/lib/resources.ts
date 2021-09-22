import searches from 'bundles/catalogP/models/searches';
import courses from 'bundles/catalogP/models/courses';
import courseProgress from 'bundles/catalogP/models/courseProgress';
import courseLists from 'bundles/catalogP/models/courseLists';
import instructors from 'bundles/catalogP/models/instructors';
import languages from 'bundles/catalogP/models/languages';
import signatureTrackProfiles from 'bundles/catalogP/models/signatureTrackProfiles';
import sessions from 'bundles/catalogP/models/sessions';
import v1Details from 'bundles/catalogP/models/v1Details';
import v2Details from 'bundles/catalogP/models/v2Details';
import partners from 'bundles/catalogP/models/partners';
import categories from 'bundles/catalogP/models/categories';
import specializations from 'bundles/catalogP/models/specializations';
import memberships from 'bundles/catalogP/models/memberships';
import specializationMemberships from 'bundles/catalogP/models/specializationMemberships';
import s12nMemberships from 'bundles/catalogP/models/s12nMemberships';
import vcMemberships from 'bundles/catalogP/models/vcMemberships';
import v1VcDetails from 'bundles/catalogP/models/v1VcDetails';
import s12ns from 'bundles/catalogP/models/s12ns';
import s12nProgresses from 'bundles/catalogP/models/s12nProgresses';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import { Sessions } from 'bundles/course-sessions/models/Sessions';
import onDemandSessionMemberships from 'bundles/catalogP/models/onDemandSessionMemberships';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import { SuggestedSessionSchedules } from 'bundles/course-sessions/models/SuggestedSessionSchedules';

export default {
  'search.v1': searches,
  'courses.v1': courses,
  'onDemandCoursesProgress.v1': courseProgress,
  'courseLists.v1': courseLists,
  'instructors.v1': instructors,
  'languages.v1': languages,
  'signatureTrackProfiles.v1': signatureTrackProfiles,
  'v1Sessions.v1': sessions,
  'v1Details.v1': v1Details,
  'v2Details.v1': v2Details,
  'partners.v1': partners,
  'categories.v1': categories,
  'specializations.v1': specializations,
  'memberships.v1': memberships,
  'specializationMemberships.v1': specializationMemberships,
  'onDemandSpecializationMemberships.v1': s12nMemberships,
  'vcMemberships.v1': vcMemberships,
  'v1VcDetails.v1': v1VcDetails,
  'onDemandSpecializations.v1': s12ns,
  'onDemandSpecializationProgress.v1': s12nProgresses,
  'onDemandSessions.v1': Sessions,
  'onDemandSessionMemberships.v1': onDemandSessionMemberships,
};
