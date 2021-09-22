import API from 'js/lib/api';
import URI from 'jsuri';

const gitRepositoryLaunchApi = API('/api/gitRepositoryLaunch.v1', {
  type: 'rest',
});

export const GitRepositoryLaunchRoles = {
  GRADER: 'grader',
  LEARNER: 'learner',
} as const;

export type GitRepositoryLaunchRole = typeof GitRepositoryLaunchRoles[keyof typeof GitRepositoryLaunchRoles];

export const LaunchGitRepositoryResponseTypes = {
  LAUNCH_SUCCESS: 'launchSuccess',
  LAUNCH_FAILURE: 'launchFailure',
} as const;

export type LaunchGitRepositoryResponseType<TypeName, Definition> = {
  id: string;
  courseId: string;
  userId: number;
  itemId: string;
  typeName: TypeName;
  definition: Definition;
};

export type LaunchGitRepositorySuccessResponse = LaunchGitRepositoryResponseType<
  typeof LaunchGitRepositoryResponseTypes.LAUNCH_SUCCESS,
  {
    url: string;
  }
>;

export type LaunchGitRepositoryFailureResponseType<Reason, Definition = {}> = LaunchGitRepositoryResponseType<
  typeof LaunchGitRepositoryResponseTypes.LAUNCH_FAILURE,
  Definition & {
    reason: Reason;
  }
>;

export const LaunchGitRepositoryFailureReasons = {
  NEED_AUTHENTICATION: 'NEED_AUTHENTICATION',
  HAVE_PENDING_INVITATION: 'HAVE_PENDING_INVITATION',
  ACCESS_DENIED: 'ACCESS_DENIED',
} as const;

export type LaunchGitRepositoryFailureNeedsAuthenticationResponse = LaunchGitRepositoryFailureResponseType<
  typeof LaunchGitRepositoryFailureReasons.NEED_AUTHENTICATION,
  {
    alternateURL: string;
  }
>;

export type LaunchGitRepositoryFailureHasPendingInvitationResponse = LaunchGitRepositoryFailureResponseType<
  typeof LaunchGitRepositoryFailureReasons.HAVE_PENDING_INVITATION,
  {
    alternateURL: string;
  }
>;

export type LaunchGitRepositoryFailureAccessDeniedResponse = LaunchGitRepositoryFailureResponseType<
  typeof LaunchGitRepositoryFailureReasons.ACCESS_DENIED
>;

export type LaunchGitRepositoryFailureResponse =
  | LaunchGitRepositoryFailureNeedsAuthenticationResponse
  | LaunchGitRepositoryFailureHasPendingInvitationResponse
  | LaunchGitRepositoryFailureAccessDeniedResponse;

// These type guards are verbose, but they let TypeScript properly narrow types.
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates
export const launchGitRepositoryFailureResponseGuards = {
  isNeedsAuthentication: (
    response: LaunchGitRepositoryFailureResponse
  ): response is LaunchGitRepositoryFailureNeedsAuthenticationResponse => {
    return response.definition.reason === LaunchGitRepositoryFailureReasons.NEED_AUTHENTICATION;
  },

  isHasPendingInvitation: (
    response: LaunchGitRepositoryFailureResponse
  ): response is LaunchGitRepositoryFailureHasPendingInvitationResponse => {
    return response.definition.reason === LaunchGitRepositoryFailureReasons.HAVE_PENDING_INVITATION;
  },

  isAccessDenied: (
    response: LaunchGitRepositoryFailureResponse
  ): response is LaunchGitRepositoryFailureAccessDeniedResponse => {
    return response.definition.reason === LaunchGitRepositoryFailureReasons.ACCESS_DENIED;
  },
} as const;

export type LaunchGitRepositoryResponse = LaunchGitRepositorySuccessResponse | LaunchGitRepositoryFailureResponse;

export const launchGitRepositoryResponseGuards = {
  isSuccess: (response: LaunchGitRepositoryResponse): response is LaunchGitRepositorySuccessResponse => {
    return response.typeName === LaunchGitRepositoryResponseTypes.LAUNCH_SUCCESS;
  },

  isFailure: (response: LaunchGitRepositoryResponse): response is LaunchGitRepositoryFailureResponse => {
    return response.typeName === LaunchGitRepositoryResponseTypes.LAUNCH_FAILURE;
  },
};

const GIT_REPOSITORY_LAUNCH_FIELDS = ['id', 'courseId', 'userId', 'itemId', 'typeName', 'definition'].join(',');

export const launchGitRepository = async (
  launchRole: GitRepositoryLaunchRole,
  courseId: string,
  itemId: string,
  repositoryId: string,
  learnerUserId: number
): Promise<LaunchGitRepositoryResponse> => {
  // TODO: This API may require this empty body object. Verify that this is true.
  const data = {};
  const uri = new URI()
    .addQueryParam('q', launchRole)
    .addQueryParam('courseId', courseId)
    .addQueryParam('userId', learnerUserId)
    .addQueryParam('itemId', itemId)
    .addQueryParam('repositoryId', repositoryId)
    .addQueryParam('fields', GIT_REPOSITORY_LAUNCH_FIELDS);

  return Promise.resolve(gitRepositoryLaunchApi.get(uri.toString(), { data })).then(
    ({ elements: [response] }: { elements: [LaunchGitRepositoryResponse] }) => response
  );
};

export const launchGitRepositoryAsGrader = async (
  courseId: string,
  itemId: string,
  repositoryId: string,
  learnerUserId: number
): Promise<LaunchGitRepositoryResponse> => {
  return launchGitRepository(GitRepositoryLaunchRoles.GRADER, courseId, itemId, repositoryId, learnerUserId);
};

export const launchGitRepositoryAsLearner = async (
  courseId: string,
  itemId: string,
  repositoryId: string,
  learnerUserId: number
): Promise<LaunchGitRepositoryResponse> => {
  return launchGitRepository(GitRepositoryLaunchRoles.LEARNER, courseId, itemId, repositoryId, learnerUserId);
};
