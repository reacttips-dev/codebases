/* eslint-disable @trello/disallow-filenames */
import {
  BaseEmoji,
  EmojiSkin,
} from 'emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index';
import { normalizeMember } from '../../api/normalizers/member';
import { ReactionModel } from 'app/gamma/src/types/models';
import { getLastMemberId } from '../last-session';

export const convertSkinToServerFormat = (emojiMartSkin: EmojiSkin | null) => {
  const skinMap = {
    1: null,
    2: '1F3FB',
    3: '1F3FC',
    4: '1F3FD',
    5: '1F3FE',
    6: '1F3FF',
  };

  return skinMap[emojiMartSkin || 1];
};

export const convertSkinToEmojiMartFormat = (serverSkin: string) => {
  const skinMap: { [key: string]: EmojiSkin } = {
    '': 1,
    '1F3FB': 2,
    '1F3FC': 3,
    '1F3FD': 4,
    '1F3FE': 5,
    '1F3FF': 6,
  };

  return skinMap[serverSkin];
};

// Convert the emoji model from EmojiMart into a reaction model
export const createReaction = (
  emoji: BaseEmoji,
  idAction: string,
  memberId?: string,
): ReactionModel => {
  const idMe = getLastMemberId();

  return {
    id: '',
    idEmoji: emoji.unified,
    idMember: memberId || idMe,
    idModel: idAction,
    member: normalizeMember({
      id: memberId || idMe,
      enterprises: [],
    }),
    emoji,
  };
};
