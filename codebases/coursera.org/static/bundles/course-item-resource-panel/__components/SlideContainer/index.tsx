import React from 'react';
import { SvgClose } from '@coursera/coursera-ui/svg';
import { TrackedSvgButton } from 'bundles/common/components/withSingleTracked';
import TrackedDiv from 'bundles/page/components/TrackedDiv';
import 'css!./__styles__/SlideContainer';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import { DrawerProps } from './__types__';

export default class SlideContainer extends React.Component<DrawerProps> {
  state = {
    open: true,
  };

  static contextTypes = {
    _eventData: PropTypes.object,
    _withTrackingData: PropTypes.func,
  };

  constructor(args: DrawerProps) {
    super(args);
    if (typeof this.props.open === 'boolean') {
      this.state.open = this.props.open;
    }
  }

  elRef: HTMLElement | null = null;

  toggleOpen = () => {
    if (this.elRef && 'style' in this.elRef) {
      if (this.elRef.classList.contains('close')) {
        this.open();
      } else {
        this.close();
      }
    } else {
      this.open();
    }
  };

  open = () => {
    if (this.elRef && 'style' in this.elRef) {
      this.elRef.classList.replace('close', 'open');
      // this.elRef.classList.remove('close');
    }
    // this.trackToggleAction(open);
    this.setState({ open: true });
    if (typeof this.props.onOpen === 'function') {
      this.props.onOpen();
    }
  };

  close = () => {
    if (this.elRef && 'style' in this.elRef) {
      this.elRef.classList.replace('open', 'close');
      // this.elRef.classList.add('close');
    }
    this.setState({ open: false });
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shouldComponentUpdate(
    nextProps: Readonly<DrawerProps>,
    nextState: Readonly<{ open: boolean }>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nextContext: any
  ): boolean {
    if (_.differenceWith(nextContext, this.context, _.isEqual) !== this.context) {
      return true;
    }

    if (this.state.open !== nextState?.open || this.props.open !== nextProps.open) {
      return false;
    }
    return false;
  }

  render() {
    return (
      <section
        className={classNames(this.state.open ? 'open' : 'close', 'rc-SlideContainer')}
        ref={(el) => {
          this.elRef = el;
        }}
      >
        <TrackedDiv
          className="rc-SlideContainer__Content"
          trackingName="resource_panel_tab_body"
          trackClicks={false}
          withVisibilityTracking
        >
          <span className="rc-SlideContainer__Content__toggleButtonStyle">
            <TrackedSvgButton
              size="zero"
              type="noStyle"
              onClick={this.toggleOpen}
              trackingName="resource_panel_close_button"
              svgElement={<SvgClose />}
            />
          </span>
          {typeof this.props.children === 'function' &&
            this.props.children({
              isOpen: this.state.open,
              open: this.open,
              close: this.close,
              toggle: this.toggleOpen,
            })}
          {typeof this.props.children !== 'function' && this.props.children}
        </TrackedDiv>
      </section>
    );
  }
}
