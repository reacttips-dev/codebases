import { parseNetworkError } from '@trello/graphql-error-handling';
import {
  MutationCreateCardTemplateArgs,
  MutationCopyCardArgs,
  MutationDeleteCardArgs,
  MutationUploadCardCoverArgs,
  MutationUpdateCardCoverArgs,
  MutationUpdateCardDueCompleteArgs,
  MutationUpdateCardListArgs,
  MutationChangeCardDueDateArgs,
  MutationUpdateCardDatesArgs,
  Card,
  MutationUpdateCardRoleArgs,
  MutationUpdateCardNameArgs,
  MutationCreateCardArgs,
  MutationArchiveCardArgs,
  MutationUnarchiveCardArgs,
} from '../generated';
import {
  QueryInfo,
  prepareDataForApolloCache,
} from '../prepareDataForApolloCache';
import { JSONObject, ResolverContext } from '../types';
import { token } from '@trello/session-cookie';
import { trelloFetch, fetch } from '@trello/fetch';
import { getNetworkClient } from '../getNetworkClient';
import { Analytics } from '@trello/atlassian-analytics';

export async function uploadCardCover(
  obj: object,
  { cardId, file, traceId }: MutationUploadCardCoverArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const formData = new FormData();
  formData.set('file', file);
  formData.set('setCover', 'true');
  formData.set('token', context.token || token || '');

  const networkClient = getNetworkClient();

  // We need to use XHR in order to track upload progress
  const request = new Promise<JSONObject>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('POST', networkClient.getUrl(`/1/cards/${cardId}/attachments`));
    xhr.setRequestHeader('X-Trello-TraceId', traceId);
    xhr.onload = () => {
      const trelloServerVersion = xhr.getResponseHeader('X-Trello-Version');
      Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.response);
        resolve(response);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = () => {
      const trelloServerVersion = xhr.getResponseHeader('X-Trello-Version');
      Analytics.setTrelloServerVersion(traceId, trelloServerVersion);
      reject({ status: xhr.status, statusText: xhr.statusText });
    };

    xhr.send(formData);
  });

  try {
    const attachment = await request;
    return prepareDataForApolloCache(attachment, info);
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function updateCardCover(
  obj: object,
  { cardId, cover, traceId }: MutationUpdateCardCoverArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const networkClient = getNetworkClient();
  const response = await fetch(networkClient.getUrl(`/1/cards/${cardId}`), {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      'X-Trello-TraceId': traceId,
    },
    body: JSON.stringify({
      cover: cover || '',
      token: context.token || token,
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  if (response.status >= 200 && response.status < 300) {
    const card = await response.json();

    return prepareDataForApolloCache(card, info);
  } else {
    throw await parseNetworkError(response);
  }
}

export async function createCardTemplate(
  obj: object,
  { listId, name, closed, traceId }: MutationCreateCardTemplateArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const networkClient = getNetworkClient();
  const response = await fetch(networkClient.getUrl('/1/cards'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      'X-Trello-TraceId': traceId,
    },
    body: JSON.stringify({
      idList: listId,
      name,
      closed: !!closed,
      isTemplate: true,
      token: context.token || token,
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const card = await response.json();

  return prepareDataForApolloCache(card, info);
}

export async function createCard(
  obj: object,
  args: MutationCreateCardArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const networkClient = getNetworkClient();
  const response = await fetch(networkClient.getUrl('/1/cards'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      'X-Trello-TraceId': args.traceId,
    },
    body: JSON.stringify({
      idList: args.idList,
      name: args.name,
      idLabels: args.idLabels,
      idMembers: args.idMembers,
      due: args.due,
      start: args.start,
      closed: !!closed,
      isTemplate: false,
      token: context.token || token,
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const card = await response.json();

  return prepareDataForApolloCache(card, info);
}

export async function copyCard(
  obj: object,
  { idCardSource, idList, name, keepFromSource, traceId }: MutationCopyCardArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const networkClient = getNetworkClient();
  const response = await fetch(networkClient.getUrl('/1/cards'), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      'X-Trello-TraceId': traceId,
    },
    body: JSON.stringify({
      idCardSource,
      idList,
      name,
      keepFromSource: keepFromSource ? keepFromSource.join(',') : '',
      token: context.token || token,
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

  if (!response.ok) {
    throw await parseNetworkError(response);
  }

  const card = await response.json();

  return prepareDataForApolloCache(card, info);
}

export const deleteCard = async (
  obj: object,
  { idCard }: MutationDeleteCardArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const response = await fetch(networkClient.getUrl(`/1/cards/${idCard}`), {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      token: context.token || token,
    }),
  });

  await response.json();

  return prepareDataForApolloCache({ success: true }, info);
};

interface UpdateCardOptions {
  traceId?: string;
}

async function updateCard(
  context: ResolverContext,
  cardId: string,
  attrs: Partial<Card>,
  options?: UpdateCardOptions,
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Trello-Client-Version': context.clientAwareness.version,
  };
  if (options?.traceId) {
    headers['X-Trello-TraceId'] = options.traceId;
  }
  const networkClient = getNetworkClient();
  // eslint-disable-next-line @trello/fetch-includes-client-version
  const response = await fetch(networkClient.getUrl(`/1/cards/${cardId}`), {
    method: 'PUT',
    credentials: 'include',
    headers,
    body: JSON.stringify({
      ...attrs,
      token: context.token || token,
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(options?.traceId, trelloServerVersion);

  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    throw new Error(response.statusText);
  }
}

export async function updateCardName(
  obj: object,
  { idCard, name, traceId }: MutationUpdateCardNameArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  try {
    const card = await updateCard(
      context,
      idCard,
      { name },
      { traceId: traceId || '' },
    );
    return prepareDataForApolloCache(card, info);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateCardList(
  obj: object,
  { idCard, idList, traceId }: MutationUpdateCardListArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  try {
    const card = await updateCard(
      context,
      idCard,
      { idList },
      { traceId: traceId || '' },
    );
    return prepareDataForApolloCache(card, info);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateCardDueComplete(
  obj: object,
  { cardId, dueComplete, traceId }: MutationUpdateCardDueCompleteArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  try {
    return prepareDataForApolloCache(
      await updateCard(
        context,
        cardId,
        { dueComplete },
        { traceId: traceId || '' },
      ),
      info,
    );
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function changeCardDueDate(
  obj: object,
  { idCard, due, dueReminder, traceId }: MutationChangeCardDueDateArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  try {
    const card = await updateCard(
      context,
      idCard,
      {
        due: due || '',
        dueReminder,
      },
      { traceId: traceId || '' },
    );
    return prepareDataForApolloCache(card, info);
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateCardDates(
  obj: object,
  { idCard, due, start, dueReminder, traceId }: MutationUpdateCardDatesArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  try {
    const card = await updateCard(
      context,
      idCard,
      {
        due: due || '',
        start: start || '',
        dueReminder,
      },
      { traceId: traceId || '' },
    );
    return prepareDataForApolloCache(card, info);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Sending a null value via JSON does not work for the `cardRole`
// field, so we need to duplicate the `updateCard` logic in order
// to pass an empty string for null values (because this is
// incompatible with the Card['cardRole'] type)
export async function updateCardRole(
  obj: object,
  { idCard, cardRole }: MutationUpdateCardRoleArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Trello-Client-Version': context.clientAwareness.version,
  };

  const networkClient = getNetworkClient();
  // eslint-disable-next-line @trello/fetch-includes-client-version
  const response = await fetch(networkClient.getUrl(`/1/cards/${idCard}`), {
    method: 'PUT',
    credentials: 'include',
    headers,
    body: JSON.stringify({
      cardRole: cardRole || '',
      token: context.token || token,
    }),
  });

  if (response.status >= 200 && response.status < 300) {
    return prepareDataForApolloCache(await response.json(), info);
  } else {
    throw new Error(response.statusText);
  }
}

export const archiveCard = async (
  obj: object,
  { idCard }: MutationArchiveCardArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  try {
    const card = await updateCard(context, idCard, { closed: true });
    return prepareDataForApolloCache(card, info);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const unarchiveCard = async (
  obj: object,
  { idCard }: MutationUnarchiveCardArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  try {
    const card = await updateCard(context, idCard, { closed: false });
    return prepareDataForApolloCache(card, info);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const possibleCardRoleResolver = async (
  card: {
    id: string;
  },
  args: object,
  context: ResolverContext,
  info: QueryInfo,
) => {
  let model = null;

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(`/1/cards/${card.id}/possibleCardRole`);

  try {
    const response = await trelloFetch(apiUrl, undefined, {
      clientVersion: context.clientAwareness.version,
      networkRequestEventAttributes: {
        source: 'graphql',
        resolver: 'Card.possibleCardRole',
        operationName: context.operationName,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    model = await response.json();

    return model ? prepareDataForApolloCache(model._value, info, 'Card') : null;
  } catch (err) {
    console.error(err);
    return model;
  }
};
