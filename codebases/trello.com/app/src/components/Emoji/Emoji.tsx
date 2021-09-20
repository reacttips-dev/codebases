import { EmojiProviderComponent } from './EmojiProviderComponent';
import NimbleEmoji from 'emoji-mart/dist-es/components/emoji/nimble-emoji';
import { EmojiProps as EmojiMartEmojiProps } from 'emoji-mart/dist-es/utils/shared-props';
import React from 'react';

interface EmojiProps extends EmojiMartEmojiProps {}

export class Emoji extends React.Component<EmojiProps> {
  static defaultProps = {
    set: 'twitter',
    size: 16,
  };

  render() {
    return (
      <EmojiProviderComponent isSmallSpinner>
        {(data, backgroundImageFn) => (
          <NimbleEmoji
            {...this.props}
            data={data}
            backgroundImageFn={backgroundImageFn}
          />
        )}
      </EmojiProviderComponent>
    );
  }
}
