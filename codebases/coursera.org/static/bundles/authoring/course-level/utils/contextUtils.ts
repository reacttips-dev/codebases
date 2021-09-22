import maxBy from 'lodash/maxBy';
import findKey from 'lodash/findKey';
import type { ActionContext } from 'js/lib/ActionContext';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { changeUserEnrollment } from 'bundles/course-v2/actions/ChangeViewSettingActions';
import { getWelcomeUrl } from 'bundles/course-v2/utils/Course';
import { authoringCourseContextTypes } from 'bundles/authoring/common/constants/authoringCourseContexts';
import type {
  BranchContextDefinition,
  GroupContextDefinition,
  AuthoringCourseContext,
  AuthoringCourseContextsWithCreationContexts,
  AuthoringCourseContextInformation,
  AuthoringCourseContextTypeName,
  SessionGroupContext,
  SessionGroupCreationContext,
} from 'bundles/authoring/common/types/authoringCourseContexts';
import type AuthoringCourse from 'bundles/author-common/models/AuthoringCourse';
import { branchStatus } from 'bundles/author-branches/constants';
import ContextStatusStates, {
  ContextStatusStatesStringMap,
} from 'bundles/authoring/course-level/constants/ContextStatusStates';
import { CourseCatalogType } from 'bundles/author-course/utils/types';

import type { BranchProperties } from 'bundles/author-branches/types/BranchProperties';
import type Session from 'bundles/author-common/models/Session';

import _t from 'i18n!nls/authoring';

export const openNewWindowWithCourseSlug = (courseSlug: string) => {
  return window.open(getWelcomeUrl(courseSlug), '_blank');
};

/**
 * Enrolls the user into a context based on the context type and branch info.
 * Per: https://coursera.atlassian.net/browse/PARTNER-15861
 *   > For public branch contexts,
 *       - If the branch does not have sessions attached yet (new/unlaunched):
 *         - enroll them into the "preview" type private session that should be created along with every new public branch.
 *       - If the branch is live or archived:
 *         - enroll them into the most recent public session on that branch.
 *   > For private branch contexts,
 *       - existing logic as item-level View as learner, since we don't have group/session info here.
 *   > For session group contexts,
 *       - use session and group info from courseContext to enroll user into that context.
 */
type EnrollmentConfig = {
  courseId: string;
  selectDefaultSessionForBranch: boolean;
  branch: BranchProperties;
  skipReloadWindow: boolean;
  userCanSwitchGroups: boolean;
  onCompleteChangeUserEnrollment?: () => void;
  newWindow?: Window | null;
  sessionId?: string | null;
  groupId?: string;
};

export const viewContextAsLearner = (
  actionContext: ActionContext,
  {
    courseContext,
    branch,
    courseSlug,
    courseId,
    skipReloadWindow = false,
    useSameWindow = false,
    userCanSwitchGroups = true,
    specifiedGroupId,
    onCompleteChangeUserEnrollment = () => {
      /* no-op */
    },
  }: {
    courseContext: AuthoringCourseContext;
    branch: BranchProperties;
    courseSlug: string;
    courseId: string;
    skipReloadWindow?: boolean;
    useSameWindow?: boolean;
    specifiedGroupId?: string;
    userCanSwitchGroups?: boolean;
    onCompleteChangeUserEnrollment?: () => void;
  }
) => {
  const onComplete = () => {
    onCompleteChangeUserEnrollment();
    openNewWindowWithCourseSlug(courseSlug);
  };

  let enrollmentConfig: EnrollmentConfig = {
    courseId,
    selectDefaultSessionForBranch: true,
    branch,
    skipReloadWindow,
    userCanSwitchGroups,
  };

  if (skipReloadWindow) {
    enrollmentConfig.onCompleteChangeUserEnrollment = onComplete;
  } else if (useSameWindow) {
    enrollmentConfig.newWindow = null;
  } else {
    enrollmentConfig.newWindow = openNewWindowWithCourseSlug(courseSlug);
  }

  if (courseContext.typeName === authoringCourseContextTypes.SESSION_GROUP) {
    enrollmentConfig = {
      ...enrollmentConfig,
      sessionId: courseContext.definition.sessionId,
      groupId: courseContext.definition.groupId,
      selectDefaultSessionForBranch: false,
    };
  } else if (courseContext.typeName === authoringCourseContextTypes.PUBLIC_BRANCH) {
    if (branch.branchStatus === branchStatus.NEW || branch.branchStatus === branchStatus.UPCOMING) {
      const previewSessionId = findKey(branch.associatedSessions, (session: Session) => session.isPreview) || null;

      enrollmentConfig = {
        ...enrollmentConfig,
        selectDefaultSessionForBranch: !previewSessionId, // use default only if a preview session was not found
        sessionId: previewSessionId,
      };
    }
  }

  if (specifiedGroupId) {
    enrollmentConfig.groupId = specifiedGroupId;
  }

  actionContext.executeAction(changeUserEnrollment, enrollmentConfig);
};

// returns the corresponding branchId from the selected context, since multiple contexts can have the same branchId
export const getContextByContextId = (courseContexts: Array<AuthoringCourseContext>, contextId: string) => {
  return courseContexts.find(({ definition }) =>
    contextId.startsWith('group~')
      ? (definition as GroupContextDefinition).groupId === contextId.split('group~')[1]
      : definition.authoringCourseBranchId === contextId
  );
};

export const hasCreatingBranch = (courseContexts: Array<AuthoringCourseContextsWithCreationContexts>) => {
  return !!courseContexts.find(
    (context) =>
      context?.definition?.status === ContextStatusStates.CREATING &&
      context.typeName !== authoringCourseContextTypes.SESSION_GROUP_CREATION_JOB
  );
};

export const hasCreatingContext = (courseContexts: Array<AuthoringCourseContextsWithCreationContexts>) => {
  return !!courseContexts.find((context) => context.definition?.status === ContextStatusStates.CREATING);
};

export const getCreatedContexts = (courseContexts: Array<AuthoringCourseContextsWithCreationContexts>) => {
  return courseContexts.filter(
    (context) =>
      context.typeName !== authoringCourseContextTypes.SESSION_GROUP_CREATION_JOB &&
      (ContextStatusStatesStringMap as Record<string, string | undefined>)[context.definition.status] !==
        ContextStatusStates.CREATING
  ) as Array<AuthoringCourseContext>;
};

export const getLatestSelectableBranchId = (courseContexts: Array<AuthoringCourseContext>) => {
  if (courseContexts.length === 1) {
    return courseContexts[0].definition.authoringCourseBranchId;
  }

  const isNotArchived = (context: AuthoringCourseContext) =>
    !([ContextStatusStates.ARCHIVED, ContextStatusStates.ENDED] as string[]).includes(context.definition.status);
  const isAlreadyCreated = (context: AuthoringCourseContext) =>
    context.definition.status !== ContextStatusStates.CREATING;

  let selectableContexts = courseContexts.filter((context) => isNotArchived(context) && isAlreadyCreated(context));

  if (selectableContexts.length === 0) {
    selectableContexts = courseContexts.filter(isAlreadyCreated);
  }

  const latestContext = maxBy(selectableContexts, (c) => c.definition.createdAt) || selectableContexts[0];
  return latestContext?.definition?.authoringCourseBranchId || null;
};

export const canCreateNewBranch = (courseContexts: Array<AuthoringCourseContextsWithCreationContexts>) => {
  const isPrivate = (context: AuthoringCourseContextsWithCreationContexts) =>
    context.typeName !== authoringCourseContextTypes.PUBLIC_BRANCH;

  return !courseContexts.find((context) => {
    const mappedStatus = (ContextStatusStatesStringMap as Record<string, string | undefined>)[
      context.definition.status
    ];

    return (
      mappedStatus !== ContextStatusStates.LIVE &&
      mappedStatus !== ContextStatusStates.ARCHIVED &&
      !isPrivate(context) &&
      context.definition.status !== ContextStatusStates.UPCOMING
    );
  });
};

// Apart from private, a course can either have public or enterprise catalog instances.
// This util determines whether those should be hidden in the UI, given an AuthoringCourse.
// see mapping at: http://go.dkandu.me/course-audience-settings
export const shouldHideCatalogContexts = (course: AuthoringCourse): boolean => {
  return !!course.isRestrictedMembership && !course.isLimitedToEnterprise;
};

// whether to treat a partner as an organization for custom messaging and UI treatment
export const isPartnerOrganization = (
  course: AuthoringCourse,
  { isPrivateAuthoringPartner = false }: { isPrivateAuthoringPartner?: boolean }
) => course.isLimitedToEnterprise || isPrivateAuthoringPartner;

// Overview page's public/catalog section messaging based on partner type
export const getCatalogMessages = (
  course: AuthoringCourse,
  partnerTypeMetadata: { isPrivateAuthoringPartner?: boolean }
) => {
  const isOrganization = isPartnerOrganization(course, partnerTypeMetadata);

  return {
    contextLabel: isOrganization ? _t('Your Organization') : _t('Public'),
    labelTooltip: isOrganization
      ? _t('Enrollment available only to learners in your organization')
      : _t('Enrollment available to all Coursera learners'),
    zeroStateMessage: isOrganization
      ? _t('No instances created for your organization yet.')
      : _t(
          `No public versions have been created. Click <strong>Create New</strong> if you'd like to create a public version so that anyone can enroll from the public Coursera catalog.`
        ),
  };
};

// whether a course is an "empty shell" based on contexts info
export const isEmptyCourseShell = (
  contexts: Array<AuthoringCourseContextInformation | AuthoringCourseContextsWithCreationContexts>
) => {
  return (contexts || []).length === 0;
};

/**
 * determines whether a course context is private based on its context type name
 * @param {AuthoringCourseContextTypeName} contextTypeName the context type name of the course context
 * @returns {boolean} false if the context type name equals authoringCourseContextTypes.PUBLIC_BRANCH, true otherwise
 */
export const isPrivateContext = (contextTypeName: AuthoringCourseContextTypeName): boolean => {
  return contextTypeName !== authoringCourseContextTypes.PUBLIC_BRANCH;
};

/**
 * returns the label displayed on the context-level TeachHeader
 * @param {AuthoringCourseContextTypeName} contextTypeName the context type name of the course context
 * @param {CourseCatalogType} courseCatalogType the catalog type of the course
 * @returns {string} the label name, Private, Your Org, or Public (the same as the context section in the course-level overview page)
 */
export const getContextTypeLabel = (
  contextTypeName: AuthoringCourseContextTypeName,
  courseCatalogType: CourseCatalogType
): string => {
  if (isPrivateContext(contextTypeName)) {
    return _t('Private');
  } else if (courseCatalogType === CourseCatalogType.ENTERPRISE) {
    return _t('Your Org');
  } else {
    return _t('Public');
  }
};

/**
 * given course context, return its context id based on the typeName of the course context
 * @param {AuthoringCourseContextsWithCreationContexts} context a course context
 * @returns {string} the context id found based on the typeName
 */
export const getContextIdFromContext = (context: AuthoringCourseContextsWithCreationContexts): string => {
  let contextId;
  switch (context.typeName) {
    case authoringCourseContextTypes.SESSION_GROUP:
      contextId = (context as SessionGroupContext).definition.groupId;
      break;
    case authoringCourseContextTypes.PUBLIC_BRANCH:
    case authoringCourseContextTypes.PRIVATE_BRANCH:
      contextId = (context.definition as BranchContextDefinition).authoringCourseBranchId;
      break;
    case authoringCourseContextTypes.SESSION_GROUP_CREATION_JOB:
    default:
      contextId = (context as SessionGroupCreationContext).definition.creationId;
      break;
  }
  return contextId;
};

/**
 * find the course context that matches an escaped context id from an array of course contexts
 * @param {String} escapedContextId the "escaped" context id, for example, for a "raw" context id "publicBranchContext~authoringBranch!~6gKQGiRnEeuxmQ78CaFjhQ", the escaped context id is authoringBranch~6gKQGiRnEeuxmQ78CaFjhQ
 * @param {Array<AuthoringCourseContextsWithCreationContexts>} contexts an array of the course contexts
 * @returns {AuthoringCourseContextsWithCreationContexts | undefined} the course context that matches the escaped context id, could to be undefined because it the matched context may not be found
 */
export const getContextByEscapedContextId = (
  escapedContextId: string,
  contexts: Array<AuthoringCourseContextsWithCreationContexts>
): AuthoringCourseContextsWithCreationContexts | undefined => {
  return contexts.find((courseContext) => {
    const potentialContextId = getContextIdFromContext(courseContext);
    return potentialContextId === escapedContextId;
  });
};

/**
 * find the uniquely identified id for a course context to be used in ContextSwitcher for choosing the right underlying branchId
 * @param {AuthoringCourseContext} context a course context
 * @returns {string} the uniquely identified id for the given context
 */
export const getIdForContextSwitcher = (context: AuthoringCourseContext): string => {
  const groupId = context.typeName === authoringCourseContextTypes.SESSION_GROUP ? context.definition.groupId : null;
  const authoringCourseBranchId = context.definition.authoringCourseBranchId;
  return groupId ? `group~${groupId}` : authoringCourseBranchId;
};
