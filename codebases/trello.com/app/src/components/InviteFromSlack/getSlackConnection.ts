import { clientVersion, slackTrelloDomain } from '@trello/config';
import { getVisitorId } from './getVisitorId';

export const getSlackConnection = async (boardId: string, cookie: string) => {
  const visitor = await getVisitorId();
  const queryParams = new URLSearchParams({
    fp: visitor,
    boardId: boardId,
  });
  try {
    const res = await fetch(
      slackTrelloDomain + `/trello/me/associations?` + queryParams,
      {
        headers: {
          Authorization: cookie,
          'Content-Type': 'application/json',
          'X-Trello-Client-Version': clientVersion,
        },
      },
    );
    const response = await res.json();
    return response.associations;
  } catch {
    return false;
  }
};
