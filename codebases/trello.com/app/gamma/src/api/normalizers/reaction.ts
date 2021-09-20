import { BaseEmoji } from 'emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index';
import { ReactionModel } from 'app/gamma/src/types/models';
import { convertSkinToEmojiMartFormat } from 'app/gamma/src/util/model-helpers/reactions';

import { EmojiResponse, ReactionResponse } from 'app/gamma/src/types/responses';

import { normalizeMember } from './member';

import genericNormalizer from './generic';

// eslint-disable-next-line @trello/no-module-logic
export const normalizeEmoji = genericNormalizer<EmojiResponse, BaseEmoji>(
  ({ from, has, DEPRECATED_combine: combine, fallback }) => {
    return {
      id: has('shortName', (shortName) => shortName.toUpperCase()),
      name: from('name'),
      colons: combine(
        ['shortName', 'skinVariation'],
        ({ shortName, skinVariation }) =>
          `:${shortName}${
            skinVariation
              ? `::skin-tone-${convertSkinToEmojiMartFormat(skinVariation)}`
              : ''
          }:`,
      ),
      emoticons: fallback(from('emoticons'), []),
      unified: from('unified'),
      skin: has('skinVariation', (skinVariation) =>
        skinVariation ? convertSkinToEmojiMartFormat(skinVariation) : null,
      ),
      native: from('native'),
    };
  },
);

// eslint-disable-next-line @trello/no-module-logic
export const normalizeReaction = genericNormalizer<
  ReactionResponse,
  ReactionModel
>(({ from, has }) => ({
  id: from('id'),
  idEmoji: has('idEmoji', (idEmoji) => idEmoji.toUpperCase()),
  idMember: from('idMember'),
  idModel: from('idModel'),
  member: has('member', normalizeMember),
  emoji: has('emoji', normalizeEmoji),
}));
