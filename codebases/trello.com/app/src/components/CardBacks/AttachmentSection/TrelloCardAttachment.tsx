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
import {
  TrelloCardAttachmentComponent,
  TrelloCardAttachmentLoading,
  TrelloCardAttachmentUnauthorized,
  TrelloCardAttachmentSpecificError,
  TrelloCardAttachmentGenericError,
} from 'app/scripts/views/attachment/trello-card-attachment-components';
import { Label } from 'app/scripts/models/label';
import { ModelCache } from 'app/scripts/db/model-cache';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { ApiError } from 'app/scripts/network/api-error';

export const TrelloCardAttachment = ({ shortLink }: { shortLink: string }) => {
  const [dependencies, { loading, error }] = useBackboneCardAttachment(
    shortLink,
  );

  if (loading) {
    return <TrelloCardAttachmentLoading />;
  }

  if (error === 'unauthorized') {
    return <TrelloCardAttachmentUnauthorized canEdit={false} />;
  } else if (
    error === 'server' ||
    error === 'bad request' ||
    error === 'not found'
  ) {
    return <TrelloCardAttachmentSpecificError canEdit={false} error={error} />;
  } else if (error) {
    return (
      <TrelloCardAttachmentGenericError
        canEdit={false}
        errorText={localizeServerError(error)}
      />
    );
  }

  const {
    card,
    board,
    list,
    members,
    labels,
    numNotifications,
    isTemplate,
  } = dependencies;

  return (
    <TrelloCardAttachmentComponent
      card={card}
      board={board}
      canLink={false}
      canRemove={false}
      canUnarchive={false}
      isLinked={false}
      isTemplate={isTemplate}
      labels={labels}
      list={list}
      members={members}
      numNotifications={numNotifications}
    />
  );
};

const useBackboneCardAttachment = (
  shortLink: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): [any, { loading: boolean; error: null | string }] => {
  const card = ModelCache.get('Card', shortLink);
  const board = card?.getBoard();
  const list = card?.getList();
  const members = card?.memberList.models;
  const labels = card?.getLabels()?.sort(Label.compare);
  const isTemplate = card?.get('isTemplate');

  const numNotifications = ModelCache.find(
    'Notification',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (notification: any) => {
      return (
        notification.get('unread') &&
        notification.get('data')?.card?.id === card?.id
      );
    },
  ).length;

  const cardAttachmentDependencies = {
    card,
    board,
    list,
    members,
    labels,
    isTemplate,
    numNotifications,
  };

  const isLoaded = card && board && list && labels && card.get('attachments');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isLoaded);

  if (!isLoaded) {
    ModelLoader.loadCardAttachment(shortLink)
      .then(() => setError(null))
      .catch(ApiError.Unauthorized, () => setError('unauthorized'))
      .catch(ApiError.NotFound, () => setError('not found'))
      .catch(ApiError.Server, () => setError('server'))
      .catch(ApiError.BadRequest, () => setError('bad request'))
      .catch((e: { message: string }) => setError(e.message))
      .finally(() => setLoading(false));
  }

  return [cardAttachmentDependencies, { loading, error }];
};
