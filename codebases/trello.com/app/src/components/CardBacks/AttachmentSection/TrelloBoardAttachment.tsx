/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react';
import { localizeServerError } from '@trello/i18n';

/**
 * NOTE:
 *
 * The following dependencies are being used in order to save time.
 * At some point in the future, the Trello Attachments code should be
 * modernized to no longer rely on Backbone components. In the mean time,
 * however, we are including this code to prevent a full rewrite which
 * would be very out of scope.
 */
import { ModelCache } from 'app/scripts/db/model-cache';
import {
  TrelloBoardAttachmentComponent,
  TrelloBoardAttachmentGenericError,
  TrelloBoardAttachmentLoading,
  TrelloBoardAttachmentSpecificError,
  TrelloBoardAttachmentUnauthorized,
} from 'app/scripts/views/attachment/trello-board-attachment-components';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { ApiError } from 'app/scripts/network/api-error';

export const TrelloBoardAttachment = ({ shortLink }: { shortLink: string }) => {
  const [board, { loading, error }] = useBackboneBoardAttachment(shortLink);

  if (loading) {
    return <TrelloBoardAttachmentLoading />;
  }

  if (error === 'unauthorized') {
    return <TrelloBoardAttachmentUnauthorized canEdit={false} />;
  } else if (
    error === 'server' ||
    error === 'bad request' ||
    error === 'not found'
  ) {
    return <TrelloBoardAttachmentSpecificError canEdit={false} error={error} />;
  } else if (error) {
    return (
      <TrelloBoardAttachmentGenericError
        canEdit={false}
        errorText={localizeServerError(error)}
      />
    );
  }

  return <TrelloBoardAttachmentComponent board={board} canRemove={false} />;
};

const useBackboneBoardAttachment = (
  shortLink: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): [any, { loading: boolean; error: null | string }] => {
  const board = ModelCache.get('Board', shortLink);

  const isLoaded = board?.get('structure');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isLoaded);

  if (!isLoaded) {
    ModelLoader.loadBoardAttachment(shortLink)
      .then(() => setError(null))
      .catch(ApiError.Unauthorized, () => setError('unauthorized'))
      .catch(ApiError.NotFound, () => setError('not found'))
      .catch(ApiError.Server, () => setError('server'))
      .catch(ApiError.BadRequest, () => setError('bad request'))
      .catch((e: { message: string }) => setError(e.message))
      .finally(() => setLoading(false));
  }

  return [board, { loading, error }];
};
