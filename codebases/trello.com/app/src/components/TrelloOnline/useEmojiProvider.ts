import { useEffect } from 'react';
import { emojiProvider } from 'app/src/components/Emoji/EmojiProvider';
import { useFeatureFlag } from '@trello/feature-flag-client';

export const useEmojiProvider = () => {
  const emojiMartRender = useFeatureFlag('fep.emoji-mart-completer', false);

  useEffect(() => {
    if (!emojiMartRender) return;

    const data = emojiProvider.getDataSync();
    if (!data) {
      emojiProvider.getData();
    }
  }, [emojiMartRender]);
};
