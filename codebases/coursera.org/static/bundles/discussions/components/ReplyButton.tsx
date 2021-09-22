import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/discussions';
import { color } from '@coursera/coursera-ui';
import { isRightToLeft } from 'js/lib/language';
import { SvgComment } from '@coursera/coursera-ui/svg';
import 'css!./__styles__/ReplyButton';

type CreatorType = {
  fullName: string;
};

interface ReplyButtonProps {
  handleClick?: () => void;
  text: string;
  creator: CreatorType;
}

interface ReplyButtonState {
  hovered: boolean;
}

class ReplyButton extends React.Component<ReplyButtonProps, ReplyButtonState> {
  state = {
    hovered: false,
  };

  handleMouseLeave = () => {
    this.setState({ hovered: false });
  };

  handleMouseEnter = () => {
    this.setState({ hovered: true });
  };

  render() {
    // TODO Change colors to use values defined in coursera-ui once coursera-ui's colors are updated
    const { handleClick, text, creator } = this.props;
    const { hovered } = this.state;
    const ariaLabel = creator.fullName
      ? _t(`#{text} to #{userName}'s post`, { text, userName: creator.fullName })
      : text;

    return (
      <button
        className="rc-ReplyButton"
        type="button"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={handleClick}
        aria-label={ariaLabel}
      >
        <SvgComment
          size={14}
          hoverColor={color.primary}
          hovered={hovered}
          style={{
            position: 'relative',
            top: '2px',
            transform: isRightToLeft(_t.getLocale()) ? 'scale(-1, 1)' : 'scale(1, 1)',
          }}
          disableMouseEvent
        />
        <span className="label-wrapper" {...(hovered ? { style: { color: color.primary } } : {})}>
          {text}
        </span>
      </button>
    );
  }
}

export default ReplyButton;
