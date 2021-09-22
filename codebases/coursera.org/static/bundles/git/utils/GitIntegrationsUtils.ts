import { loadSessionCookie } from 'bundles/course-integrations-callback/utils/IntegrationsUtils';
import type { GitRepositoryLaunchRole } from 'bundles/git/utils/GitIntegrationsApiUtils';
import { GitRepositoryLaunchRoles } from 'bundles/git/utils/GitIntegrationsApiUtils';
import type { AssignmentRole } from 'bundles/compound-assessments/types/Roles';
import { AssignmentRoles } from 'bundles/compound-assessments/types/Roles';
import type {
  LaunchGitRepoAuthorizationFlows,
  LaunchGitRepoStateValueContext,
  IntegrationsStateValue,
} from 'bundles/course-integrations-callback/types';
import { AuthorizationFlows } from 'bundles/course-integrations-callback/constants';

export const launchRoleToAuthFlow = (launchRole: GitRepositoryLaunchRole): LaunchGitRepoAuthorizationFlows => {
  return launchRole === GitRepositoryLaunchRoles.GRADER
    ? AuthorizationFlows.Git.LaunchRepoAsGrader
    : AuthorizationFlows.Git.LaunchRepoAsLearner;
};

export const createGitRepositoryLaunchStateValue = async (
  courseId: string,
  launchRole: GitRepositoryLaunchRole,
  repositoryId: string
): Promise<IntegrationsStateValue> => {
  const session = await loadSessionCookie();
  const authFlow = launchRoleToAuthFlow(launchRole);
  const context: LaunchGitRepoStateValueContext = {
    typeName: authFlow,
    definition: {
      repositoryId,
    },
  };
  return {
    courseId,
    session,
    context,
  };
};

export const assignmentRoleToLaunchRole = (assignmentRole: AssignmentRole | undefined): GitRepositoryLaunchRole => {
  if (assignmentRole === AssignmentRoles.GRADER) {
    return GitRepositoryLaunchRoles.GRADER;
  } else {
    return GitRepositoryLaunchRoles.LEARNER;
  }
};

/**
 * Builds a URL to a specific commit if the commitHash is supplied, otherwise returns
 * baseUrl which points to master.
 *
 * `baseUrl` will be something like:
 *
 *     https://github.com/account-name/repo-name
 *
 * If `commitHash` is supplied, the result will be something like:
 *
 *     https://github.com/account-name/repo-name/commit/commit-hash
 */
export const buildGitCommitUrl = (baseUrl: string, commitHash?: string): string => {
  if (commitHash) {
    return `${baseUrl}/tree/${commitHash}`;
  } else {
    return baseUrl;
  }
};
