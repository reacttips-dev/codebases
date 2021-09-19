import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import debounce from 'lodash.debounce';

import { MartyContext } from 'utils/context';
import { getScreenSize } from 'helpers/HtmlHelpers';
import { track } from 'apis/amethyst';

import styles from 'styles/components/common/tooltip.scss';
class Tooltip extends Component {
  state = {
    visible: false,
    isMobileScreen: false
  };

  componentDidUpdate() {
    const { direction } = this.props;
    const isMobileScreen = getScreenSize() === 'mobile';
    if (isMobileScreen !== this.state.isMobileScreen && direction !== 'bottom') {
      this.setState({ isMobileScreen });
    }
  }

  setVisibility = (visible = false) => {
    this.setState({ visible });
  };

  hide = () => {
    this.trackOpenCloseEvents(false);
    this.state.isMobileScreen ?
      setTimeout(this.setVisibility, 0) /* If the tooltip has a link, we must wait
                                             for the next batch of events.
                                             Otherwise the tooltip will be hidden
                                             before the link click is registered.
                                             At the time of implementing this,
                                             attempting to use requestAnimationFrame()
                                             broke dismissing the tooltip via tapping the overlay */
      : this.setVisibility(false);
  };

  trackOpenCloseEvents = debounce(opened => {
    const { eventData } = this.props;

    if (!eventData) {
      return;
    }

    track(() => ([eventData.event, { opened, closed: !opened, ...eventData.data }]));
  }, 250);

  makeDirectionClassName = direction => {
    switch (direction) {
      case 'left':
        return styles.left;
      case 'right':
        return styles.right;
      case 'bottom':
        return styles.bottom;
      default:
        return '';
    }
  };

  show = () => {
    this.setVisibility(true);
    this.trackOpenCloseEvents(true);
  };

  onMouseEnter = () => {
    const { onMouseEnter: handleMouseEnter } = this.props;
    handleMouseEnter && handleMouseEnter();
    this.show();
  };

  onMouseLeave = () => {
    const { onMouseLeave: handleMouseLeave } = this.props;
    handleMouseLeave && handleMouseLeave();
    this.hide();
  };

  makeTooltipContent = ({ contentTarget = 'default' } = {}) => {
    const {
      props: { tooltipClassName, contentClassName, content, simple, direction, sponsored, clickOpen },
      state: { isMobileScreen, visible },
      context: { testId }
    } = this;
    const isContentForMobile = contentTarget === 'mobile';
    const shouldRenderContents = isContentForMobile ? isMobileScreen : !isMobileScreen;

    return (clickOpen || visible) && shouldRenderContents && (
      <div
        data-test-id={testId('tooltipContent')}
        className={cn(styles.tooltip,
          {
            [styles.simpleTooltip]: simple,
            [styles.sponsored]: sponsored,
            [styles.forMobile]: isContentForMobile
          },
          this.makeDirectionClassName(direction),
          tooltipClassName)}>
        <div className={cn(contentClassName, styles.content)}>{content}</div>
      </div>
    );
  };

  handleKeyDown = e => {
    const { key } = e;

    const {
      state: { visible }
    } = this;

    switch (key) {
      case 'Escape': {
        if (visible) {
          this.onMouseLeave();
        }
        break;
      }
    }
  };

  makeInteractive = () => {
    const { wrapperClassName, children, clickOpen, isTabbable, useOverlay = true } = this.props;
    const { visible } = this.state;
    let content = null;

    if (clickOpen) {
      content =
      <>
        {useOverlay && <div className={cn(styles.overlay, { [styles.activateOverlay]: clickOpen || visible })} onMouseEnter={this.onMouseLeave}></div>}
        <div
          className={cn(styles.wrapper, wrapperClassName)}
          role="dialog"
          aria-labelledby="feedBackTitle"
          aria-describedby="feedBackTitle">
          {children}
          {this.makeTooltipContent()}
        </div>
      </>;
    } else {
      content =
      <>
        {useOverlay && <div className={cn(styles.overlay, { [styles.activateOverlay]: visible })} onMouseEnter={this.onMouseLeave}></div>}
        <div
          className={cn(styles.wrapper, wrapperClassName)}
          onMouseOut={!isTabbable ? this.onMouseLeave : null}
          onBlur={!isTabbable ? this.onMouseLeave : null}
          onMouseOver={!isTabbable ? this.onMouseEnter : null}
          onFocus={!isTabbable ? this.onMouseEnter : null}>
          {children}
          {this.makeTooltipContent()}
        </div>
      </>;
    }

    if (isTabbable) {
      return <button
        type="button"
        className={styles.tooltipButton}
        onKeyDown={this.handleKeyDown}
        onFocus={this.onMouseEnter}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onBlur={this.onMouseLeave}>
        {content}
      </button>;
    }

    return content;
  };

  render() {
    const { mobileWrapper, mobileClass } = this.props;
    return (
      <MartyContext.Consumer>
        { context => {
          this.context = context;

          return (
            <>
              {this.makeInteractive()}
              <div className={cn(styles.mobileContainer, mobileWrapper)}>
                <div className={cn(styles.mobileEncompass, mobileClass)}>
                  {this.makeTooltipContent({ contentTarget: 'mobile' })}
                </div>
              </div>
            </>
          );
        }}
      </MartyContext.Consumer>
    );
  }
}

Tooltip.propTypes = {
  children: PropTypes.any,
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  wrapperClassName: PropTypes.string,
  tooltipClassName: PropTypes.string,
  tooltipContent: PropTypes.string,
  contentClassName: PropTypes.string,
  simple: PropTypes.bool
};

export default Tooltip;
