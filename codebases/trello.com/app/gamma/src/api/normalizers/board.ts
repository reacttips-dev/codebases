import { makeLocalUrl } from 'app/gamma/src/util/url';
import genericNormalizer, { normalizeDate } from './generic';
import { membershipsFromResponse } from './memberships';

import {
  BoardBackgroundModel,
  BoardCreationMethod,
  BoardModel,
  BoardPreferencesModel,
  BoardStarModel,
} from 'app/gamma/src/types/models';

import {
  BoardResponse,
  BoardResponsePrefs,
  MemberBoardStar,
} from 'app/gamma/src/types/responses';

import { normalizeImagePreviews } from './image-preview';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeBoardBackgroundPrefs = genericNormalizer<
  BoardResponsePrefs,
  BoardBackgroundModel
>(({ from, has }) => ({
  bottomColor: from('backgroundBottomColor'),
  brightness: from('backgroundBrightness'),
  color: from('backgroundTopColor'),
  tile: from('backgroundTile'),
  url: from('backgroundImage'),
  scaled: has('backgroundImageScaled', (scaled) =>
    scaled ? normalizeImagePreviews(scaled) : [],
  ),
}));

// eslint-disable-next-line @trello/no-module-logic
export const normalizeBoardPrefs = genericNormalizer<
  BoardResponsePrefs,
  BoardPreferencesModel
>(({ from }) => ({
  cardCovers: from('cardCovers'),
  permissionLevel: from('permissionLevel'),
  comments: from('comments'),
  isTemplate: from('isTemplate'),
}));

function maxDate(
  newDateString?: string,
  previousDate?: Date,
): Date | undefined {
  if (newDateString !== undefined) {
    const newDate = normalizeDate(newDateString);

    if (!previousDate || newDate > previousDate) {
      return newDate;
    }
  }

  return previousDate;
}

// eslint-disable-next-line @trello/no-module-logic
export const normalizeBoard = genericNormalizer<BoardResponse, BoardModel>(
  ({ from, has }) => ({
    background: has('prefs', (prefs) => normalizeBoardBackgroundPrefs(prefs)),
    closed: from('closed'),
    creationMethod: has(
      'creationMethod',
      (method) => method as BoardCreationMethod,
    ),
    dateLastActivity: ({ dateLastActivity }, previousDate) =>
      maxDate(dateLastActivity, previousDate),
    dateLastView: ({ dateLastView }, previousDate) =>
      maxDate(dateLastView, previousDate),
    id: from('id'),
    idTeam: from('idOrganization'),
    isStarred: from('starred'),
    enterpriseOwned: from('enterpriseOwned'),
    memberships: membershipsFromResponse,
    name: from('name'),
    prefs: has('prefs', (prefs) => normalizeBoardPrefs(prefs)),
    premiumFeatures: from('premiumFeatures'),
    shortLink: from('shortLink'),
    url: has('url', (url) => makeLocalUrl(url)),
  }),
);

// eslint-disable-next-line @trello/no-module-logic
export const normalizeBoardStar = genericNormalizer<
  MemberBoardStar,
  BoardStarModel
>(({ from, clientOnly }) => ({
  deleted: clientOnly(),
  id: from('id'),
  idBoard: from('idBoard'),
  pos: from('pos'),
}));
