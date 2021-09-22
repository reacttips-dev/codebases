import React from 'react';

import TrackedDiv from 'bundles/page/components/TrackedDiv';

import 'css!./__styles__/CopyItem';

import _t from 'i18n!nls/ui';

type Props = {
  item: string;
  trackingName?: string;
  e2eDataName?: string;
  onItemClick?: () => void;
};

type State = {
  showCopiedMessage: boolean;
};

export default class CopyItem extends React.Component<Props, State> {
  textInput: HTMLInputElement | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      showCopiedMessage: false,
    };
  }

  static defaultProps = {
    trackingName: 'copy_item',
  };

  handleClick = () => {
    const { onItemClick } = this.props;

    if (this.textInput) {
      this.textInput.select();
      document.execCommand('copy');
      this.toggleCopiedMessage(true);
      setTimeout(() => this.toggleCopiedMessage(false), 2500);
      // clear text input selection
      const selection = document.getSelection();
      if (selection) {
        selection.empty();
      }

      if (onItemClick) onItemClick();
    }
  };

  toggleCopiedMessage = (show: boolean) => {
    this.setState(() => ({
      showCopiedMessage: show,
    }));
  };

  render() {
    const { item, trackingName, e2eDataName } = this.props;
    const { showCopiedMessage } = this.state;

    return (
      <TrackedDiv className="rc-CopyItem" trackingName={`${trackingName}_container`}>
        <TrackedDiv className="rc-CopyItem__input_wrapper" trackingName={`${trackingName}_input`}>
          <input
            ref={(node) => {
              this.textInput = node;
            }}
            className="rc-CopyItem__input"
            type="text"
            value={item}
            {...(e2eDataName && { 'data-e2e': e2eDataName })}
            readOnly
            tabIndex={-1}
            aria-hidden={true}
            dir="ltr"
          />
        </TrackedDiv>
        <TrackedDiv
          className="rc-CopyItem__button"
          trackingName={`${trackingName}_button`}
          aria-label="copy share link"
          onClick={this.handleClick}
          aria-role="button"
          tabIndex={0}
        >
          {showCopiedMessage ? <span role="alert"> {_t('COPIED!')} </span> : <span> {_t('COPY')}</span>}
        </TrackedDiv>
      </TrackedDiv>
    );
  }
}
