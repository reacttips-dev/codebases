import { CardTemplatesQuery } from './CardTemplatesQuery.generated';
import {
  BadgesModel,
  CoverPhotoModel,
  LabelModel,
  LabelColor,
  MemberModel,
  StickerModel,
  CoverColor,
} from 'app/gamma/src/types/models';

type Board = NonNullable<CardTemplatesQuery>['board'];
type Members = NonNullable<Board>['members'];
type Cards = NonNullable<Board>['cards'];
type Card = Cards[number];

export function normalizeCover(card: Card): CoverPhotoModel | null {
  const cover = card.cover;

  if (!cover) {
    return null;
  }

  if (cover.color) {
    return {
      url: '',
      color: cover.color as CoverColor,
      size: cover.size as 'normal' | 'full',
      brightness: cover.brightness as 'dark' | 'light',
    };
  }

  if (!cover.scaled || !cover.edgeColor) {
    return null;
  }

  return {
    url: '',
    edgeColor: cover.edgeColor,
    previews: cover.scaled.map((preview) => {
      const { scaled, height, url, width } = preview;

      return {
        scaled,
        height,
        url,
        width,
      };
    }),
    size: cover.size as 'normal' | 'full',
    brightness: cover.brightness as 'dark' | 'light',
  };
}

export function normalizeBadges(card: Card): BadgesModel {
  const {
    attachments,
    attachmentsByType,
    description,
    checkItems,
  } = card.badges;
  return {
    attachments,
    description,
    attachmentsByType: {
      trello: {
        board: attachmentsByType.trello.board,
        card: attachmentsByType.trello.card,
      },
    },
    checklistItems: checkItems,
    checklistItemsChecked: 0,
    comments: 0,
    due: null,
    start: null,
    subscribed: false,
    viewingMemberVoted: false,
    votes: 0,
    dueComplete: false,
    checkItemsEarliestDue: null,
  };
}

export function normalizeLabels(card: Card): LabelModel[] {
  const { labels } = card;

  return labels.map((label) => {
    const { id, name, color, idBoard } = label;
    return { id, name, idBoard, color: color ? (color as LabelColor) : null };
  });
}

export function normalizeMembers(card: Card, members: Members): MemberModel[] {
  const { idMembers } = card;

  const memberModels: MemberModel[] = [];

  idMembers.forEach((idMember) => {
    const member = members.find((m) => m.id === idMember);

    if (!member) {
      return;
    }

    memberModels.push({
      avatars: member.avatarUrl
        ? {
            30: `${member.avatarUrl}/30.png`,
          }
        : null,
      initials: member.initials || '',
      id: member.id,
      enterprises: [],
      idPremOrgsAdmin: [],
    });
  });

  return memberModels;
}

export function normalizeStickers(card: Card): StickerModel[] {
  return card.stickers.map((sticker) => {
    const { imageScaled } = sticker;

    const x2 = imageScaled.find((image) => image.url.includes('@2x'));

    return {
      id: sticker.id,
      image: sticker.image,
      imageUrl: sticker.imageUrl,
      left: sticker.left,
      top: sticker.top,
      rotate: sticker.rotate,
      zIndex: sticker.zIndex,
      imageUrl2x: x2 ? x2.url : null,
    };
  });
}

export function normalizeDataForCanonicalCard(
  card: Card,
  members: Members,
): {
  cover: CoverPhotoModel | null;
  badges: BadgesModel;
  labels: LabelModel[];
  members: MemberModel[];
  stickers: StickerModel[];
} {
  return {
    cover: normalizeCover(card),
    badges: normalizeBadges(card),
    labels: normalizeLabels(card),
    members: normalizeMembers(card, members),
    stickers: normalizeStickers(card),
  };
}
