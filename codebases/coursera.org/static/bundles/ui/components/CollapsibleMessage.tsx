import React, { createRef } from 'react';
import classnames from 'classnames';
import { color } from '@coursera/coursera-ui';
import { SvgChevronDown, SvgChevronUp } from '@coursera/coursera-ui/svg';

import generateUUID from 'bundles/common/utils/uuid';

import _t from 'i18n!nls/ui';

import 'css!./__styles__/CollapsibleMessage';

type Props = {
  className?: string;
  showToggle: boolean;
  onToggleClick: () => void;
  isInitiallyCollapsed: boolean;
  cardSpacing: 'luxury' | 'comfy' | 'roomy' | 'cozy' | 'compact';
  gradientColor: 'white' | 'grey' | 'none';
  moreLabel: React.ReactNode;
  lessLabel: React.ReactNode;
  moreAriaLabel: string;
  lessAriaLabel: string;
  toggleRowChildren?: React.ReactNode;
  toggleIconColor?: string;
  toggleIconHoverColor?: string;
  hideTruncated?: boolean;
};

type State = {
  isCollapsed: boolean;
};

class CollapsibleMessage extends React.Component<Props, State> {
  static defaultProps = {
    showToggle: true,
    onToggleClick: () => undefined,
    isInitiallyCollapsed: false,
    cardSpacing: 'comfy',
    gradientColor: 'white',
    get moreLabel() {
      return _t('More');
    },
    get lessLabel() {
      return _t('Less');
    },
    get moreAriaLabel() {
      return _t('Show more');
    },
    get lessAriaLabel() {
      return _t('Show less');
    },
    toggleIconColor: color.secondaryText,
    toggleIconHoverColor: color.black,
  };

  contentRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.state = { isCollapsed: props.isInitiallyCollapsed };
    this.contentRef = createRef<HTMLDivElement>();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.isInitiallyCollapsed !== this.props.isInitiallyCollapsed) {
      this.setState({ isCollapsed: nextProps.isInitiallyCollapsed });
    }
  }

  onToggleClick = () => {
    const { onToggleClick } = this.props;

    this.setState(
      ({ isCollapsed }) => ({ isCollapsed: !isCollapsed }),
      () => {
        const { isCollapsed } = this.state;
        if (!isCollapsed && this.contentRef.current) {
          this.contentRef.current.focus();
        }
      }
    );
    onToggleClick();
  };

  render() {
    const {
      showToggle,
      className,
      cardSpacing,
      gradientColor,
      moreLabel,
      lessLabel,
      moreAriaLabel,
      lessAriaLabel,
      toggleRowChildren,
      children,
      toggleIconColor,
      toggleIconHoverColor,
      hideTruncated,
    } = this.props;
    const { isCollapsed } = this.state;

    const mainClasses = classnames('rc-CollapsibleMessage', 'primary', cardSpacing, className, {
      'card-rich-interaction': showToggle,
      'card-no-action': !showToggle,
    });

    const messageClasses = classnames('message-content', {
      truncated: showToggle && isCollapsed && !hideTruncated,
    });

    const truncateClasses = classnames('truncate-gradient', gradientColor);
    const showToggleRow = showToggle || !!toggleRowChildren;

    const contentId = generateUUID();

    return (
      <div className={mainClasses}>
        <div
          className={messageClasses}
          ref={this.contentRef}
          aria-hidden={isCollapsed}
          tabIndex={isCollapsed ? -1 : 0}
          {...(showToggle && { id: contentId })}
        >
          {children}
          {showToggle && isCollapsed && <div className={truncateClasses} />}
        </div>

        {showToggleRow && (
          <div className="horizontal-box message-toggle-row">
            {showToggle && (
              <button
                type="button"
                className="nostyle message-toggle horizontal-box align-items-vertical-center"
                onClick={this.onToggleClick}
                aria-controls={contentId}
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? moreAriaLabel : lessAriaLabel}
              >
                {isCollapsed ? (
                  <SvgChevronDown size={24} color={toggleIconColor} hoverColor={toggleIconHoverColor} />
                ) : (
                  <SvgChevronUp size={24} color={toggleIconColor} hoverColor={toggleIconHoverColor} />
                )}
                <span className="color-secondary-text">{isCollapsed ? moreLabel : lessLabel}</span>
              </button>
            )}
            {toggleRowChildren}
          </div>
        )}
      </div>
    );
  }
}

export default CollapsibleMessage;
