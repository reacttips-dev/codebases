import {
  AttachmentModel,
  AttachmentPreviewModel,
  CardModel,
  StickerModel,
} from 'app/gamma/src/types/models';
import {
  AttachmentResponse,
  CardResponse,
  PreviewFromServer,
  StickerResponse,
} from 'app/gamma/src/types/responses';
import { makeLocalUrl } from 'app/gamma/src/util/url';
import { normalizeBadges } from './badges';
import genericNormalizer, { normalizeDate } from './generic';
import { normalizeCoverPhoto } from './image-preview';
import { normalizeList } from './list';

// eslint-disable-next-line @trello/no-module-logic
export const normalizePreview = genericNormalizer<
  PreviewFromServer,
  AttachmentPreviewModel
>(({ from }) => ({
  id: from('_id'),
  bytes: from('bytes'),
  height: from('height'),
  width: from('width'),
  scaled: from('scaled'),
  url: from('url'),
}));

// eslint-disable-next-line @trello/no-module-logic
export const normalizeAttachment = genericNormalizer<
  AttachmentResponse,
  AttachmentModel
>(({ from, has, map }) => ({
  date: has('date', normalizeDate),
  id: from('id'),
  isUpload: from('isUpload'),
  mimeType: from('mimeType'),
  name: from('name'),
  previews: map('previews', normalizePreview),
  url: from('url'),
}));

// eslint-disable-next-line @trello/no-module-logic
export const normalizeStickers = genericNormalizer<
  StickerResponse,
  StickerModel
>(({ from, has }) => ({
  id: from('id'),
  image: from('image'),
  imageUrl: from('imageUrl'),
  left: from('left'),
  top: from('top'),
  rotate: from('rotate'),
  zIndex: from('zIndex'),
  imageUrl2x: has('imageScaled', (scaled) => {
    const x2 = scaled.find((image) => image.url.includes('@2x'));

    return x2 ? x2.url : null;
  }),
}));

// eslint-disable-next-line @trello/no-module-logic
export const normalizeCard = genericNormalizer<CardResponse, CardModel>(
  ({ from, map, has, DEPRECATED_combine: combine }) => ({
    attachments: map('attachments', normalizeAttachment),
    badges: has('badges', normalizeBadges),
    closed: from('closed'),
    cover: combine(
      ['idAttachmentCover', 'attachments', 'cover'],
      ({ cover }) => {
        if (
          cover &&
          ((cover.scaled && cover.scaled.length > 0) || cover.color)
        ) {
          return normalizeCoverPhoto(cover);
        }

        return null;
      },
    ),
    desc: from('desc'),
    due: has('due', normalizeDate),
    dueComplete: from('dueComplete'),
    id: from('id'),
    idBoard: from('idBoard'),
    idChecklists: from('idChecklists'),
    idLabels: from('idLabels'),
    idList: from('idList'),
    idMembers: from('idMembers'),
    idShort: from('idShort'),
    isTemplate: from('isTemplate'),
    list: has('list', normalizeList),
    name: from('name'),
    pos: from('pos'),
    start: has('start', normalizeDate),
    stickers: map('stickers', normalizeStickers),
    shortLink: from('shortLink'),
    url: ({ id, url }) => (url !== undefined ? makeLocalUrl(url) : `/c/${id}`),
    cardRole: from('cardRole'),
  }),
);
