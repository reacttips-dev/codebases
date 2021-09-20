import { Data } from 'emoji-mart/dist-es/utils/data';
import { BackgroundImageFn } from 'emoji-mart/dist-es/utils/shared-props';
import React from 'react';
import { emojiProvider } from './EmojiProvider';
import { Spinner } from '@trello/nachos/spinner';

interface EmojiProviderProps {
  children: (
    data: Data,
    backgroundImageFn?: BackgroundImageFn,
  ) => React.ReactNode;
  isSmallSpinner: boolean;
}

interface EmojiProviderState {
  data: Data;
}

export class EmojiProviderComponent extends React.Component<
  EmojiProviderProps,
  EmojiProviderState
> {
  static defaultProps = {
    isSmallSpinner: false,
  };

  mounted: boolean;

  constructor(props: EmojiProviderProps) {
    super(props);

    this.state = {
      data: emojiProvider.getDataSync(),
    };
  }

  componentDidMount() {
    this.mounted = true;
    if (!this.state.data) {
      emojiProvider.getData().then((data) => {
        if (this.mounted && data) {
          return this.setState({ data });
        }
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getBackgroundImageFn() {
    const spriteSheets = emojiProvider.getSpritesheetsSync();
    if (spriteSheets) {
      return emojiProvider.getSpritesheetsUrl;
    }

    return undefined;
  }

  render() {
    const { children, isSmallSpinner } = this.props;
    const { data } = this.state;

    if (data) {
      return children(data, this.getBackgroundImageFn());
    } else {
      return (
        <div>
          <Spinner small={isSmallSpinner} centered={!isSmallSpinner} />
        </div>
      );
    }
  }
}
