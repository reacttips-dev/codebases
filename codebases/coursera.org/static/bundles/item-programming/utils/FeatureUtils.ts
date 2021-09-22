import epicClient from 'bundles/epic/client';
import UserAgent from 'js/lib/useragent';
import { getWorkspaceHealthCheck } from 'bundles/item-workspace/utils/WorkspaceApiUtils';
import type { WorkspaceV1LaunchResponse } from 'bundles/item-workspace/types/WorkspaceItem';
import { isLabVersioningExperimentEnabled } from 'bundles/admin-workspaces/utils/FeatureUtils';

export const isOnInternetExplorer = (): boolean => {
  return new UserAgent(navigator.userAgent).browser.name === 'IE';
};

// Detect third-party cookies by making a series of requests.
// Instead of creating a new endpoint just for detecting cookies, just leverage the existing launch/health APIs.
// If `isHealthy: true` we could potentially navigate straight to the launch path, and avoid a second launch.
// Most of the time we'll have `isHealthy: false` while the workspace initializes.
export const isThirdPartyCookiesEnabled = async ({
  workspaceId,
  launchUrl,
}: Pick<WorkspaceV1LaunchResponse, 'workspaceId' | 'launchUrl'>): Promise<boolean> => {
  try {
    // Hit the launch URL from www.coursera.org to get a workspaceId-wkspc-sid cookie to use with getWorkspaceHealthCheck
    // This consumes the token, and may assign the correct cookie.
    // If cookie assignment is successful, we could optimize something to avoid
    // If cookie assignment is unsuccessful, we will need another token generation for the actual usage of the lab.
    // TODO(riwong/rbenkar): Fix redirects to /workspaces/authenticate on seemingly-valid tokens. CP-1256
    if (launchUrl) {
      await fetch(launchUrl, {
        // Allow the Set-Cookie response header to actually take effect, for the next request to succeed
        credentials: 'include',
      });
    }

    // Hit the health-check API, which will fail if the cookie doesn't exist.
    if (workspaceId && launchUrl) {
      const healthCheck = await getWorkspaceHealthCheck(workspaceId, new URL(launchUrl).hostname);
      return typeof healthCheck?.isHealthy === 'boolean';
    }

    // In any other case (workspaceId/launchUrl not defined, or healthCheck isn't boolean),
    // just pretend that third-party cookies are blocked.
    return false;
  } catch (e) {
    // Just assume they're blocked. We want to reset the launch button
    return false;
  }
};

// https://tools.coursera.org/epic/experiment/FktPcIgQEeqaUsP2OLkXSg
export const isIframeLabsEnabledForUser = (): boolean => {
  return epicClient.get('Workspaces', 'isIframeLabsEnabledForUser');
};

// https://tools.coursera.org/epic/experiment/N31VgIgLEeqaUsP2OLkXSg
export const isIframeLabsDisabledForCourse = (courseId: string): boolean => {
  const iframeLabsDisabledCourseIds: Array<string> = epicClient.get('Workspaces', 'iframeLabsDisabledCourseIds') || [];
  return iframeLabsDisabledCourseIds.includes(courseId);
};

// https://tools.coursera.org/epic/experiment/MK6j4IgPEeqzjOl1OAX49w
export const isIframeLabsEnabledForCourse = (courseId: string): boolean => {
  const iframeLabsEnabledCourseIds: Array<string> = epicClient.get('Workspaces', 'iframeLabsEnabledCourseIds') || [];
  return iframeLabsEnabledCourseIds.includes(courseId);
};

// https://tools.coursera.org/epic/experiment/vQ530AHBEeubmnesvrmjlA
export const isNewDomainEnabledForUser = (): boolean => {
  return epicClient.get('Workspaces', 'isNewDomainEnabledForUser');
};

// https://tools.coursera.org/epic/experiment/KOQZoAHDEeubmnesvrmjlA
export const isNewDomainDisabledForCourse = (courseId: string): boolean => {
  const newDomainDisabledCourseIds: Array<string> = epicClient.get('Workspaces', 'newDomainDisabledCourseIds') || [];
  return newDomainDisabledCourseIds.includes(courseId);
};

export const isNewDomainEnabled = (courseId: string): boolean => {
  if (isNewDomainDisabledForCourse(courseId)) {
    return false;
  } else {
    return isNewDomainEnabledForUser();
  }
};

export const isIframeLabsEnabled = async (
  courseId: string,
  launchWorkspaceFn: () => Promise<Pick<WorkspaceV1LaunchResponse, 'workspaceId' | 'launchUrl'>>
): Promise<boolean> => {
  if (
    isOnInternetExplorer() ||
    isIframeLabsDisabledForCourse(courseId) ||
    // If the new domain is enabled, third-party cookies are not necessary, so we don't even care to check for third-party cookies.
    (!isNewDomainEnabled(courseId) && !(await isThirdPartyCookiesEnabled(await launchWorkspaceFn())))
  ) {
    return false;
  } else if (isIframeLabsEnabledForCourse(courseId)) {
    return true;
  } else {
    return isIframeLabsEnabledForUser();
  }
};

// https://tools.coursera.org/epic/experiment/PAyd0DWzEeu43KtdAFJJ6w
export const isInstructorLabIframeEnabledForUser = (): boolean => {
  return epicClient.get('Workspaces', 'isInstructorLabIframeEnabled');
};

// https://tools.coursera.org/epic/experiment/PraIIDWzEeu43KtdAFJJ6w
export const isInstructorLabIframeEnabledForCourse = (courseId: string): boolean => {
  const instructorLabIframeEnabledCourseIds: Array<string> =
    epicClient.get('Workspaces', 'instructorLabIframeEnabledCourseIds') || [];
  return instructorLabIframeEnabledCourseIds.includes(courseId);
};

// https://tools.coursera.org/epic/experiment/QJkDwDWzEeuiQr1vIEB4YA
export const isInstructorLabIframeDisabledForCourse = (courseId: string): boolean => {
  const instructorLabIframeDisabledCourseIds: Array<string> =
    epicClient.get('Workspaces', 'instructorLabIframeDisabledCourseIds') || [];
  return instructorLabIframeDisabledCourseIds.includes(courseId);
};

export const isInstructorLabIframeEnabled = (courseId?: string): boolean => {
  if (courseId && isInstructorLabIframeDisabledForCourse(courseId)) {
    return false;
  } else if (courseId && isInstructorLabIframeEnabledForCourse(courseId)) {
    return true;
  } else {
    return isInstructorLabIframeEnabledForUser();
  }
};

// https://tools.coursera.org/epic/experiment/5RD1cFzXEeuE-Nf5DDv6jA
export const isIframeLabsHealthCheckEnabled = (courseId?: string): boolean => {
  // Labs versioning experiment depends on iFramedLabsHealthCheck, will remove the extra experiment check once iFrameLabsHealthCheck experiment is rolled out
  return (
    (courseId && isLabVersioningExperimentEnabled(courseId)) ||
    epicClient.get('Workspaces', 'isIframeLabsHealthCheckEnabled')
  );
};

// https://tools.coursera.org/epic/experiment/yVJEUI6TEeqo8E3pm-6Y2Q
export const isDevTargetHostEnabled = (): boolean => {
  return epicClient.get('Workspaces', 'isDevTargetHostEnabled');
};

// https://tools.coursera.org/epic/experiment/A1JZQCCQEeu3SOVsHRIZrg
export const isDownloadLabFilesEnabledForUser = (): boolean => {
  return epicClient.get('Workspaces', 'isDownloadLabFilesEnabled');
};

// https://tools.coursera.org/epic/experiment/V3VkMCCREeu3SOVsHRIZrg
export const isDownloadLabFilesEnabledForCourse = (courseId: string): boolean => {
  const iframeLabsEnabledCourseIds: Array<string> =
    epicClient.get('Workspaces', 'downloadLabFilesEnabledCourseIds') || [];
  return iframeLabsEnabledCourseIds.includes(courseId);
};

export const isDownloadLabFilesEnabled = (courseId?: string): boolean => {
  return isDownloadLabFilesEnabledForUser() || (courseId ? isDownloadLabFilesEnabledForCourse(courseId) : false);
};

export const isSkillTaggingForProgrammingAssigmentsEnabled = (): boolean => {
  return !!epicClient.get('Skills', 'SkillTaggingProgramming');
};

// https://tools.coursera.org/epic/experiment/Kvi_sIKiEeuVrxMze-F57g
export const isUrlNavigationBarDisabledForCourse = (courseId: string): boolean => {
  const courseIds: Record<string, boolean> = epicClient.get('Workspaces', 'urlNavigationBarEnabledCourseIds') || {};
  return courseIds[courseId] === false;
};

export const isUrlNavigationBarEnabledForCourse = (courseId: string): boolean => {
  const courseIds: Record<string, boolean> = epicClient.get('Workspaces', 'urlNavigationBarEnabledCourseIds') || {};
  const isCourseEnabled = courseIds[courseId] === true;
  const isRolledOut = courseIds['*'] === true;

  return isCourseEnabled || isRolledOut;
};

// https://tools.coursera.org/epic/experiment/sYOv0IW-EeuiopWlkftNvw
export const isUrlNavigationBarEnabledForUser = (): boolean => {
  return epicClient.get('Workspaces', 'isUrlNavigationBarEnabledForUser');
};

export const isUrlNavigationBarEnabled = (courseId?: string): boolean => {
  if (courseId && isUrlNavigationBarDisabledForCourse(courseId)) {
    return false;
  } else if (courseId && isUrlNavigationBarEnabledForCourse(courseId)) {
    return true;
  } else {
    return isUrlNavigationBarEnabledForUser();
  }
};
