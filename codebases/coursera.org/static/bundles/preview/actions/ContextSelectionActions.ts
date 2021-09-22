import type { ActionContext } from 'js/lib/ActionContext';

export const selectContext = (actionContext: ActionContext, { contextId }: { contextId: string }) => {
  actionContext.dispatch('RECEIVE_CONTEXT_SELECTION', contextId);
};
