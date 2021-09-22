import type ApolloClient from 'apollo-client';
import type { StepState, GetStepStateQueryVariables } from './types';

import { stepStateFragment } from './queries';

const getId = ({ stepId, itemId, courseId, userId }: $TSFixMe) => `${stepId}-${itemId}-${courseId}-${userId}`;

const defaultState = {
  isSaving: false,
  isSubmitting: false,
  isAutoSaving: false,
  showSubmitSuccessModal: false,
  showValidation: false,
  isDeadlineExpired: false,
  errorCode: null,
  __typename: 'LocalStepStateValue',
};

const __typename = 'LocalStepState';

export const updateStepState = (
  { stepId, itemId, courseId, userId }: GetStepStateQueryVariables,
  updatedState: StepState,
  client: ApolloClient<any>
) => {
  // @ts-expect-error TSMIGRATION
  const id = client.cache.config.dataIdFromObject({ __typename, id: getId({ stepId, itemId, courseId, userId }) });
  const prevData = client.cache.readFragment<$TSFixMe>({ id, fragment: stepStateFragment });
  const data = {
    ...prevData,
    state: {
      ...(prevData || {}).state,
      ...updatedState,
    },
  };
  client.writeFragment({ id, fragment: stepStateFragment, data });
};

const getStepStateResolver = (
  _obj: any,
  { stepId, itemId, courseId, userId }: GetStepStateQueryVariables,
  { cache, getCacheKey }: any
) => {
  const id = getId({ stepId, itemId, courseId, userId });
  const cacheKey = getCacheKey({ __typename, id });
  const data = cache.readFragment({ id: cacheKey, fragment: stepStateFragment });

  return {
    id,
    state: (data || {}).state || defaultState,
    __typename,
  };
};

const resolvers = {
  Query: {
    StepState: (rootObj: $TSFixMe) => ({
      ...rootObj,
      __typename: 'LocalStepStateRoot',
    }),
  },
  LocalStepStateRoot: {
    get: getStepStateResolver,
  },
};

const addStepState = (client: any) => {
  if (!(((client || {}).localState || {}).resolvers || {}).LocalStepStateRoot) {
    client.addResolvers(resolvers);
  }
};

export default addStepState;
