/**
 *
 *  Backend Feature Definitions:
 *  https://github.com/webedx-spark/infra-services/blob/main/libs/authorizationLib/src/main/scala/org/coursera/authorization/FeatureInstanceFactory.scala
 *
 *  name: the feature name, representing a slice of underlying business domain or functionality
 *  verbs: a list of actions that the subject is trying to invoke
 *  instanceId: the particular feature instance (instance id of a course-scoped feature is course id)
 *  scopeType: scope of the feature ie: course, branch
 *
 */

import type { FeaturePermissions, InputFeatures } from 'bundles/teach-course/utils/types';

import { FEATURE, VERB } from 'bundles/authoring/common/utils/permissions/permissionFeatures';

export default function getNavigationFeatures(courseId: string): InputFeatures {
  return [
    {
      instanceId: courseId,
      features: [
        {
          name: FEATURE.COURSE,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_CONTENT,
          verbs: [VERB.UPDATE, VERB.READ, VERB.PUBLISH],
        },
        {
          name: FEATURE.COURSE_GRADES,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_GRADEBOOK,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_GRADING_FORMULA,
          verbs: [VERB.READ, VERB.UPDATE],
        },
        {
          name: FEATURE.COURSE_MESSAGES,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_INVITATIONS,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_ROSTER,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_TEAMS,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_SUPPORT_DASHBOARD,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_ANALYTICS,
          verbs: [VERB.READ, VERB.EXPORT],
        },
        {
          name: FEATURE.COURSE_SETTINGS,
          verbs: [VERB.READ, VERB.UPDATE],
        },
        {
          name: FEATURE.COURSE_CERTIFICATE_SETTINGS,
          verbs: [VERB.READ, VERB.UPDATE],
        },
        {
          name: FEATURE.COURSE_GROUPS_SESSIONS,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_EVENTS,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_SCHEDULE,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_SESSION_SCHEDULE,
          verbs: [VERB.READ, VERB.UPDATE],
        },
        {
          name: FEATURE.COURSE_LEARN_VIEW_AS_LEARNER,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_LEARN_VIEW_AS_LEARNER_GROUP_SWITCHER,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_TEACH_VIEW_AS_LEARNER,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_LEARN_ACT_AS_LEARNER,
          verbs: [VERB.UPDATE],
        },
        {
          name: FEATURE.COURSE_FEEDBACK,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_TEAM_WORKSPACE,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_AUTHOR_DISCUSSIONS,
          verbs: [VERB.READ],
        },
        {
          name: FEATURE.COURSE_AUTHOR_STAFF,
          verbs: [VERB.READ, VERB.UPDATE],
        },
        {
          name: FEATURE.COURSE_VERSIONS,
          verbs: [VERB.CREATE],
        },
        {
          name: FEATURE.COURSE_ANNOUNCEMENTS,
          verbs: [VERB.READ, VERB.UPDATE],
        },
        {
          name: FEATURE.COURSE_GRADING_POLICY,
          verbs: [VERB.READ, VERB.UPDATE],
        },
      ],
    },
  ];
}

export function hasPermission(permissions: FeaturePermissions, featureName: string, verb: string): boolean {
  const feature = permissions[featureName];
  return !!(feature && feature[verb]);
}

export function canViewViewAsLearnerForTeach(permissions: FeaturePermissions): boolean {
  return hasPermission(permissions, FEATURE.COURSE_TEACH_VIEW_AS_LEARNER, VERB.READ);
}

export function canViewViewAsLearnerBannerForLearn(permissions: FeaturePermissions): boolean {
  return hasPermission(permissions, FEATURE.COURSE_LEARN_VIEW_AS_LEARNER, VERB.READ);
}

export function canViewGroupSwitcherInViewAsLearnerForLearn(permissions: FeaturePermissions): boolean {
  return hasPermission(permissions, FEATURE.COURSE_LEARN_VIEW_AS_LEARNER_GROUP_SWITCHER, VERB.READ);
}

export function canViewAuthoringChangeLog(permissions: FeaturePermissions): boolean {
  return hasPermission(permissions, FEATURE.COURSE_CONTENT, VERB.READ);
}

export function canToggleEditModeForActAsLearner(permissions: FeaturePermissions): boolean {
  return hasPermission(permissions, FEATURE.COURSE_LEARN_ACT_AS_LEARNER, VERB.UPDATE);
}
