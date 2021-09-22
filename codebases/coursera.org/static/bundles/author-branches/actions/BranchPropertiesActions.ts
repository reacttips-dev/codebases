import isEmpty from 'lodash/isEmpty';
import type { ActionContext } from 'js/lib/ActionContext';
import BranchPropertiesApiUtils from 'bundles/author-branches/utils/BranchPropertiesApiUtils';
import authoringStateActionsFactory from 'bundles/author-common/actions/AuthoringStateActions';
import type AuthoringCourseBranch from 'bundles/author-common/models/AuthoringCourseBranch';
import type { ConflictMetadata } from 'bundles/author-branches/types/BranchProperties';
import type { ReceivedBranchForCoursePayload } from 'bundles/author-branches/stores/BranchPropertiesStore';
import { conflictMessage } from 'bundles/author-course/constants/CourseMaterialChangeMessages';

const AuthoringStateActions = authoringStateActionsFactory('course');
const CONFLICT_ERROR_STATUS = 409;

const updateBranchPropertiesAndMetadata = (
  actionContext: ActionContext,
  branchId: string,
  properties: AuthoringCourseBranch,
  conflictMetadata: ConflictMetadata
) => {
  actionContext.dispatch('RECEIVED_BRANCH_PROPERTIES', {
    branchId,
    properties,
  });
  actionContext.dispatch('SAVE_CONFLICT_METADATA_FOR_BRANCH', {
    branchId,
    conflictMetadata,
  });
};

export const loadAllBranchPropertiesForCourse = (actionContext: ActionContext, courseId: string) => {
  return BranchPropertiesApiUtils.getBranchPropertiesByCourse(courseId)
    .then((response: { elements: Array<ReceivedBranchForCoursePayload> }) => {
      const { elements } = response;
      if (!isEmpty(elements)) {
        actionContext.dispatch('RECEIVED_BRANCHES_FOR_COURSE', elements);
      }
    })
    .catch(() => {
      actionContext.executeAction(AuthoringStateActions.setError);
    });
};

export const updateBranchProperties = (
  actionContext: ActionContext,
  {
    branchId,
    branchProperties,
    conflictMetadata,
    callback,
  }: {
    branchId: string;
    branchProperties: AuthoringCourseBranch;
    conflictMetadata: ConflictMetadata;
    callback: () => void;
  }
) => {
  actionContext.executeAction(AuthoringStateActions.setInProgress);

  BranchPropertiesApiUtils.updateBranchProperties(branchId, branchProperties, conflictMetadata)
    .then((response) => {
      const { elements } = response;

      if (!isEmpty(elements)) {
        const { properties } = elements[0];
        updateBranchPropertiesAndMetadata(actionContext, branchId, properties, elements[0].conflictMetadata);
      }
      actionContext.executeAction(AuthoringStateActions.setPublished);
      if (callback) {
        callback();
      }
    })
    .catch((error) => {
      if (error.status === CONFLICT_ERROR_STATUS) {
        actionContext.executeAction(AuthoringStateActions.setConflict, { conflictMessage: conflictMessage() });
      } else {
        actionContext.executeAction(AuthoringStateActions.setPublishError);
      }
    });
};
