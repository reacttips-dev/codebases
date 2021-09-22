import Q from 'q';
import URI from 'jsuri';
import API from 'js/lib/api';
import user from 'js/lib/user';

import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import type {
  WorkspaceV1LaunchResponse,
  LearnerWorkspaceLaunchResponse,
  GetLabSandboxLaunchUrlResponse,
  WorkspaceLaunchUrlResponse,
  WorkspaceV2Launcher,
  WorkspaceV1Launcher,
  ExpiresAtResponse,
  WorkspaceHealthChecksResponse,
  WorkspaceMetadataResponse,
  WorkspaceLaunchDefinitionsResponse,
  WorkspaceTemplateResponse,
  GetWorkspaceResponse,
} from 'bundles/item-workspace/types/WorkspaceItem';
import type { WorkspaceVersionChangeSummaries } from 'bundles/labs-common/types/WorkspaceVersionChange';
import type { SubmittableAssignment, SubmissionResult } from 'bundles/labs-common/types/StandardSubmission';

const onDemandWorkspaceLaunchersV1Api = API('/api/onDemandWorkspaceLaunchers.v1', { type: 'rest' });
const onDemandWorkspaceLaunchersV2Api = API('/api/onDemandWorkspaceLaunchers.v2', { type: 'rest' });
const onDemandLearnerWorkspacesApi = API('/api/onDemandLearnerWorkspaces.v1', { type: 'rest' });
const onDemandWorkspacePublishApi = API('/api/onDemandWorkspacePublish.v1', { type: 'rest' });
const workspaceLaunchApi = API('/api/workspaceLaunch.v1', { type: 'rest' });
const workspaceUserSessionsApi = API('/api/workspaceUserSessions.v1', { type: 'rest' });
const workspaceLaunchDefinitionsApi = (workspaceId: string) =>
  API(`/api/workspaceLaunchDefinitions.v1/${workspaceId}`, {
    type: 'rest',
  });
const workspaceAdminHostDockerImagesApi = (devStackName: string) =>
  API(`https://hub.${devStackName}.labs-dev.coursera.org/api/workspaceAdminHostDockerImages.v1`, {
    type: 'rest',
  });
const workspaceAdminTokensApi = API('/api/workspaceAdminTokens.v1/devJwt', { type: 'rest' });
const workspaceMetadataApi = (workspaceId: string) => API(`/api/workspaceMetadata.v1/${workspaceId}`, { type: 'rest' });
const workspaceVersionUpdateSummariesApi = API('/api/workspaceVersionUpdateSummaries.v1', { type: 'rest' });
const workspaceTemplatesApi = API('/api/workspaceTemplates.v1', { type: 'rest' });
const learnerWorkspaceAssignmentsApi = API('/api/learnerWorkspaceAssignments.v1', { type: 'rest' });
const onDemandProgrammingWorkspaceSubmissionsApi = API('/api/onDemandProgrammingWorkspaceSubmissions.v2', {
  type: 'rest',
});

const WORKSPACE_FIELDS = [
  'description',
  'launchPath',
  'launcherLabel',
  'offlineInstructions',
  'workspaceId',
  'shareDetails',
  'templateId',
].join(',');

const WORKSPACE_V2_FIELDS = [
  'id',
  'userId',
  'courseId',
  'itemId',
  'templateId',
  'isStandardSubmission',
  'description',
  'offlineInstructions',
  'sharedWorkspaceUrl',
  'label',
  'shareConfig',
].join(',');

const GENERIC_WORKSPACE_FIELDS = ['workspaceId', 'expiresAt', 'isHealthy', 'url'].join(',');

const WORKSPACE_METADATA_FIELDS = ['accessScopes', 'publishDestinations', 'owners', 'templateId'].join(',');

const WORKSPACE_VERSION_CHANGE_SUMMARIES_FIELDS = 'summaries';

const SUBMITTABLE_ASSIGNMENT_FIELDS = ['id', 'itemId', 'name', 'submissionFiles', 'lockStatus', 'itemLock'].join(',');

const SUBMIT_ASSIGNMENT_FIELDS = ['error'].join(',');

export const getWorkspaceV1Launcher = (courseId: string, itemId: string): Q.Promise<WorkspaceV1Launcher> => {
  const id = tupleToStringKey([user.get().id, courseId, itemId]);
  const uri = new URI(id).addQueryParam('fields', WORKSPACE_FIELDS);

  return Q(onDemandWorkspaceLaunchersV1Api.get(uri.toString())).then(
    (response: { elements: Array<WorkspaceV1Launcher> }) => response.elements[0]
  );
};

export const getWorkspaceV2Launcher = (courseId: string, itemId: string): Q.Promise<WorkspaceV2Launcher> => {
  const id = tupleToStringKey([user.get().id, courseId, itemId]);
  const uri = new URI(id).addQueryParam('fields', WORKSPACE_V2_FIELDS);
  return Q(onDemandWorkspaceLaunchersV2Api.get(uri.toString())).then(
    (response: { elements: Array<WorkspaceV2Launcher> }) => response.elements[0]
  );
};

export const getExpiresAt = (courseId: string, itemId: string): Q.Promise<ExpiresAtResponse> => {
  const id = tupleToStringKey([user.get().id, courseId, itemId]);
  const uri = new URI(id).addQueryParam('fields', 'expiresAt');
  return Q(onDemandLearnerWorkspacesApi.get(uri.toString()));
};

export const extendSession = (courseId: string, itemId: string): Q.Promise<number> => {
  const id = tupleToStringKey([user.get().id, courseId, itemId]);
  const uri = new URI().addQueryParam('action', 'extend').addQueryParam('id', id);
  return Q(onDemandLearnerWorkspacesApi.post(uri.toString()));
};

export const launchV1Workspace = (courseId: string, itemId: string): Q.Promise<WorkspaceV1LaunchResponse> => {
  const id = tupleToStringKey([user.get().id, courseId, itemId]);
  const uri = new URI().addQueryParam('action', 'launch').addQueryParam('id', id);

  return Q(onDemandWorkspaceLaunchersV1Api.post(uri.toString()));
};

export const launchLearnerWorkspace = (courseId: string, itemId: string): Q.Promise<LearnerWorkspaceLaunchResponse> => {
  const id = tupleToStringKey([user.get().id, courseId, itemId]);
  const uri = new URI().addQueryParam('action', 'launch').addQueryParam('id', id);

  return Q(onDemandLearnerWorkspacesApi.post(uri.toString()));
};

export const downloadLearnerWorkspace = (workspaceId: string): Promise<{ downloadUrl: string }> => {
  return fetch('/api/onDemandLearnerWorkspaces.v1?action=download&workspaceId=' + workspaceId, {
    method: 'POST',
    body: '{}',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
};

export const getLabSandboxLaunchUrl = (
  courseId: string,
  instructorWorkspaceId: string,
  launchPath?: string | undefined
): Q.Promise<GetLabSandboxLaunchUrlResponse> => {
  const uri = new URI()
    .addQueryParam('action', 'launchInSandbox')
    .addQueryParam('courseId', courseId)
    .addQueryParam('instructorWorkspaceId', instructorWorkspaceId)
    .addQueryParam('isIframe', 'true');

  if (launchPath) {
    uri.addQueryParam('path', launchPath);
  }

  return Q(onDemandLearnerWorkspacesApi.post(uri.toString()));
};

export const refreshAccessToken = (workspaceId: string, userId?: number): Q.Promise<string> => {
  const id = tupleToStringKey([userId || user.get().id, workspaceId]);
  const uri = new URI().addQueryParam('action', 'refreshAccessToken').addQueryParam('id', id);

  return Q(workspaceUserSessionsApi.post(uri.toString()));
};

export const getWorkspace = (workspaceId: string, maybeUserId?: number): Q.Promise<GetWorkspaceResponse> => {
  const userId = maybeUserId || user.get().id;
  const userWorkspaceId = tupleToStringKey([userId, workspaceId]);
  const uri = new URI(userWorkspaceId).addQueryParam('fields', GENERIC_WORKSPACE_FIELDS);

  return Q(workspaceUserSessionsApi.get(uri.toString())).then((response) => {
    return response.elements[0];
  });
};

// Explicitly requesting and extracting `expiresAt` because `expiresAt` is not exposed by default.
export const getWorkspaceExpiration = (workspaceId: string, maybeUserId?: number): Q.Promise<number | undefined> => {
  const userId = maybeUserId || user.get().id;
  const userWorkspaceId = tupleToStringKey([userId, workspaceId]);
  const uri = new URI(userWorkspaceId).addQueryParam('fields', 'expiresAt');

  return Q(workspaceUserSessionsApi.get(uri.toString())).then((response) => {
    return response.elements[0]?.expiresAt;
  });
};

export const extendWorkspaceSession = (workspaceId: string, maybeUserId?: number): Q.Promise<number> => {
  const userId = maybeUserId || user.get().id;
  const userWorkspaceId = tupleToStringKey([userId, workspaceId]);
  const uri = new URI().addQueryParam('action', 'extend').addQueryParam('id', userWorkspaceId);

  return Q(workspaceUserSessionsApi.post(uri.toString()));
};

export const publishWorkspace = (courseId: string, itemId: string, async = false): Q.Promise<{ id: string }> => {
  const id = tupleToStringKey([user.get().id, courseId, itemId]);
  const uri = new URI()
    .addQueryParam('action', !async ? 'publish' : 'asyncPublish')
    .addQueryParam('id', id)
    .addQueryParam('fields', 'id');

  const options = {
    data: {
      shareSettings: {
        accessScopes: [
          {
            typeName: 'loggedInScope',
            definition: {},
          },
        ],
      },
    },
  };

  return Q(onDemandWorkspacePublishApi.post(uri.toString(), options));
};

export const getWorkspaceLaunchUrl = (
  workspaceId: string,
  path?: string,
  forceRefresh?: boolean,
  isIframe?: boolean
): Q.Promise<WorkspaceLaunchUrlResponse> => {
  const id = tupleToStringKey([user.get().id, workspaceId]);
  const uri = new URI().addQueryParam('action', 'launch').addQueryParam('userWorkspaceId', id);

  if (typeof path === 'string') {
    uri.addQueryParam('urlPath', path); // TODO(riwong): Remove this when backend WorkspaceLaunchResource migrates to `path`
    uri.addQueryParam('path', path);
  }

  if (typeof forceRefresh === 'boolean') {
    uri.addQueryParam('forceRefresh', forceRefresh.toString());
  }

  if (typeof isIframe === 'boolean') {
    uri.addQueryParam('isIframe', isIframe.toString());
  }

  return Q(workspaceLaunchApi.post(uri.toString()));
};

export const getWorkspaceImageTag = (workspaceId: string, jwtToken: string): Q.Promise<string> => {
  const uri = new URI().addQueryParam('fields', 'imageTag');
  return Q(
    workspaceLaunchDefinitionsApi(workspaceId).get(uri.toString(), {
      headers: { 'X-Coursera-JWT-Auth': jwtToken },
    })
  ).then((response: { elements: Array<{ imageTag: string }> }) => {
    return response.elements[0].imageTag;
  });
};

export const pullWorkspaceAdminHostDockerImages = (
  devStackName: string,
  imageTag: string,
  jwtToken: string
): Q.Promise<void> => {
  const uri = new URI().addQueryParam('action', 'pull');

  return Q(
    workspaceAdminHostDockerImagesApi(devStackName).post(uri.toString(), {
      headers: {
        'X-Coursera-JWT-Auth': jwtToken,
      },
      data: {
        repositoryNames: [imageTag],
      },
    })
  );
};

export const getWorkspaceHealthCheck = (
  workspaceId: string,
  hostname: string
): Promise<WorkspaceHealthChecksResponse | undefined> => {
  return fetch(`https://${hostname}/api/workspaceHealthChecks.v1/${workspaceId}?fields=isHealthy,url`, {
    // Need workspaceId-wkspc-sid cookie to be sent with this cross-origin request
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((response) => response.elements?.[0]);
};

export const getWorkspaceAdminToken = (): Q.Promise<{ devJwt: string }> =>
  Q(workspaceAdminTokensApi.get(new URI().toString())).then((response) => response.elements[0]);

export const getWorkspaceMetadata = (workspaceId: string): Q.Promise<WorkspaceMetadataResponse> => {
  const uri = new URI().addQueryParam('fields', WORKSPACE_METADATA_FIELDS);

  return Q(workspaceMetadataApi(workspaceId).get(uri.toString())).then((response) => response.elements[0]);
};

export const getWorkspaceLaunchDefinitions = (
  workspaceId: string,
  jwt: string
): Q.Promise<WorkspaceLaunchDefinitionsResponse> => {
  return Q(
    workspaceLaunchDefinitionsApi(workspaceId).get(new URI().toString(), {
      headers: {
        'X-Coursera-JWT-Auth': jwt,
        'X-Coursera-Naptime-Fields': 'all',
      },
    })
  ).then((response) => response.elements[0]);
};

export const getWorkspaceTemplates = (templateId: string): Q.Promise<WorkspaceTemplateResponse> => {
  const uri = new URI(templateId);
  return Q(
    workspaceTemplatesApi.get(uri.toString(), {
      headers: { 'X-Coursera-Naptime-Fields': 'all' },
    })
  ).then((response) => response.elements[0]);
};

export const markAsViewedWorkspaceVersionChangeSummaries = (workspaceId: string): Q.Promise<void> => {
  const uri = new URI().addQueryParam('action', 'markAsViewed').addQueryParam('id', workspaceId);
  return Q(workspaceVersionUpdateSummariesApi.post(uri.toString()));
};

export const getUnviewedWorkspaceVersionChangeSummaries = (
  workspaceId: string
): Q.Promise<WorkspaceVersionChangeSummaries> => {
  const uri = new URI()
    .addQueryParam('q', 'getNotViewed')
    .addQueryParam('id', workspaceId)
    .addQueryParam('fields', WORKSPACE_VERSION_CHANGE_SUMMARIES_FIELDS);
  return Q(workspaceVersionUpdateSummariesApi.get(uri.toString()).then((response) => response.elements[0]));
};

export const getAllWorkspaceVersionChangeSummaries = (
  workspaceId: string
): Q.Promise<WorkspaceVersionChangeSummaries> => {
  const uri = new URI(workspaceId).addQueryParam('fields', WORKSPACE_VERSION_CHANGE_SUMMARIES_FIELDS);
  return Q(workspaceVersionUpdateSummariesApi.get(uri.toString()).then((response) => response.elements[0]));
};

export const getSubmittableAssignmentsByItemId = (
  courseId: string,
  itemId: string,
  userId?: string
): Promise<Array<SubmittableAssignment>> => {
  const id = tupleToStringKey([userId || user.get().id, courseId, itemId]);
  const uri = new URI()
    .addQueryParam('q', 'byCourse')
    .addQueryParam('id', id)
    .addQueryParam('fields', SUBMITTABLE_ASSIGNMENT_FIELDS);

  return Promise.resolve(learnerWorkspaceAssignmentsApi.get(uri.toString())).then(
    (response: { elements: Array<SubmittableAssignment> }) => {
      return response.elements;
    }
  );
};

export const submitAssignment = (courseId: string, itemId: string, workspaceId: string): Promise<SubmissionResult> => {
  const uri = new URI().addQueryParam('fields', SUBMIT_ASSIGNMENT_FIELDS);
  const options = {
    data: {
      courseId,
      itemId,
      workspaceId,
    },
  };

  return Promise.resolve(onDemandProgrammingWorkspaceSubmissionsApi.post(uri.toString(), options)).then(
    (response: { elements: Array<SubmissionResult> }) => {
      return response.elements[0];
    }
  );
};
