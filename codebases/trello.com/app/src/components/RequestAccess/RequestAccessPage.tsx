import React from 'react';
import {
  useRouteId,
  useBoardShortLink,
  useCardShortLink,
} from '@trello/routes';
// eslint-disable-next-line no-restricted-imports
import { RequestAccessModelType } from '@trello/graphql/generated';

import { useRequestAccessPageQuery } from './RequestAccessPageQuery.generated';
import { useSendRequestAccessMutation } from './SendRequestAccessMutation.generated';
import {
  RequestAccessPageStateless,
  REQUEST_ACCESS_SCREEN,
} from './RequestAccessPageStateless';

export const RequestAccessPage = () => {
  const routeId = useRouteId();
  const boardShortLink = useBoardShortLink();
  const cardShortLink = useCardShortLink();
  const modelType = routeId as RequestAccessModelType;
  const modelId = boardShortLink || cardShortLink || '';

  const {
    data: queryData,
    error: queryError,
    loading: queryLoading,
  } = useRequestAccessPageQuery({
    variables: {
      memberId: 'me',
      modelType,
      modelId,
    },
  });

  const [
    sendRequest,
    { data: mutationData, error: mutationError, loading: mutationLoading },
  ] = useSendRequestAccessMutation({
    variables: {
      modelType,
      modelId,
    },
  });

  const member = {
    id: queryData?.member?.id || '',
    email: queryData?.member?.email || '',
    fullName: queryData?.member?.fullName || '',
  };

  let screen;
  if (queryError || mutationError) {
    throw queryError || mutationError;
  } else if (queryLoading) {
    screen = REQUEST_ACCESS_SCREEN.LOADING;
  } else if (
    queryData?.boardAccessRequest.requested ||
    mutationData?.sendBoardAccessRequest?.success
  ) {
    screen = REQUEST_ACCESS_SCREEN.REQUEST_ACCESS_SUBMITTED;
  } else {
    screen = REQUEST_ACCESS_SCREEN.REQUEST_ACCESS_ALLOWED;
  }

  return (
    <RequestAccessPageStateless
      screen={screen}
      member={member}
      onSubmit={sendRequest}
      disabled={mutationLoading}
    />
  );
};
