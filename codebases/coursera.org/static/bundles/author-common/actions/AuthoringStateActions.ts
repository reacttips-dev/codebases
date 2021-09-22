import type { ActionContext } from 'js/lib/ActionContext';

import AuthoringStates from 'bundles/author-common/constants/AuthoringState';
import type { PublishError } from 'bundles/author-common/propTypes/types';
import { getErrorIsSlugifiableError } from 'bundles/author-common/utils/PublishErrorUtils';

export type ActionStateType = 'item' | 'course';
export type AuthoringStateAction = (actionContext: ActionContext) => void;

export default function getActionsForStateType(stateType: ActionStateType) {
  const actionName = stateType === 'course' ? 'SET_COURSE_STATE' : 'SET_ITEM_STATE';

  return {
    setLoading(actionContext: ActionContext) {
      actionContext.dispatch(actionName, { state: AuthoringStates.Loading });
    },

    setIdle(actionContext: ActionContext) {
      actionContext.dispatch(actionName, { state: AuthoringStates.Idle });
    },

    setInProgress(actionContext: ActionContext) {
      actionContext.dispatch(actionName, { state: AuthoringStates.InProgress });
    },

    setSuccess(actionContext: ActionContext) {
      actionContext.dispatch(actionName, { state: AuthoringStates.Success });
    },

    setSaveSuccess(actionContext: ActionContext) {
      actionContext.dispatch(actionName, { state: AuthoringStates.SaveSuccess });
    },

    // When error occurred and current ActionStateType is 'course':
    //   <CourseAuthoringStateBanner> will show up as a non-transient red notification by default and the page is frozen
    //   if continueEdit is true, notification will be transient and page will not be frozen
    setError(actionContext: ActionContext, payload?: { errorMessage?: string; continueEdit?: boolean }) {
      const state = Object.assign({}, AuthoringStates.Error);
      if (payload?.errorMessage) {
        state.message = payload?.errorMessage;
      }

      if (typeof (payload || {}).continueEdit !== 'undefined') {
        state.continueEdit = (payload || {}).continueEdit;
      }
      actionContext.dispatch(actionName, { state });
    },

    setConflict(actionContext: ActionContext, payload?: { conflictMessage?: string }) {
      const state = Object.assign({}, AuthoringStates.Conflict);

      if (payload?.conflictMessage) {
        state.message = payload?.conflictMessage;
      }

      actionContext.dispatch(actionName, { state });
    },

    setPublishInProgress(actionContext: ActionContext) {
      actionContext.dispatch(actionName, {
        state: AuthoringStates.PublishInProgress,
      });
    },

    setPublished(actionContext: ActionContext, payload?: { successMessage?: string | JSX.Element }) {
      const state = Object.assign({}, AuthoringStates.Published);

      if (payload?.successMessage) {
        state.message = payload?.successMessage;
      }

      actionContext.dispatch(actionName, { state });
    },

    setNoChanges(actionContext: ActionContext) {
      actionContext.dispatch(actionName, { state: AuthoringStates.NoChanges });
    },

    setRevertInProgress(actionContext: ActionContext) {
      actionContext.dispatch(actionName, {
        state: AuthoringStates.RevertInProgress,
      });
    },

    setReverted(actionContext: ActionContext) {
      actionContext.dispatch(actionName, { state: AuthoringStates.Reverted });
    },

    setPublishError(actionContext: ActionContext, payload?: { error: PublishError }) {
      const { error } = payload || {};

      let errorState = AuthoringStates.PublishError;
      if (error) {
        const slugError = error.responseJSON.details.find((detail) => getErrorIsSlugifiableError(detail.error));
        if (slugError) {
          errorState = AuthoringStates.PublishSlugError;
        }
      }
      actionContext.dispatch(actionName, {
        state: errorState,
      });
    },

    setRevertError(actionContext: ActionContext) {
      actionContext.dispatch(actionName, {
        state: AuthoringStates.RevertError,
      });
    },

    setLoadError(actionContext: ActionContext) {
      actionContext.dispatch(actionName, {
        state: AuthoringStates.LoadError,
      });
    },

    toggleBreakingChangesModal(actionContext: ActionContext, showModal: boolean) {
      actionContext.dispatch('TOGGLE_BREAKING_CHANGES_MODAL', { showModal });
    },
  };
}
