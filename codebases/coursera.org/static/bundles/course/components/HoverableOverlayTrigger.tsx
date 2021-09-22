import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';

type Props = {
  overlay: React.ReactNode;
  tooltipId: string;
  children: React.ReactNode;
  placement?: string;
  delayHide?: number;
  delayShow?: number;
};

interface OverlayTriggerInstance extends OverlayTrigger {
  hide: () => void;
  show: () => void;
}

class HoverableOverlayTrigger extends React.Component<Props> {
  tooltipTrigger: OverlayTriggerInstance | null | undefined;

  tooltipWrapper: HTMLElement | null | undefined;

  timeOutRef: number | undefined;

  componentDidMount() {
    document.addEventListener('keydown', this.handleEscKeyPress, false);
  }

  componentWillUnmount() {
    if (this.timeOutRef) {
      clearTimeout(this.timeOutRef);
      this.timeOutRef = undefined;
    }
    document.removeEventListener('keydown', this.handleEscKeyPress, false);
  }

  handleEscKeyPress = (event: KeyboardEvent & { code: string }) => {
    if (event.keyCode === 27 || event.code === 'Escape') {
      this.tooltipTrigger?.hide();
    }
  };

  showTooltip = () => {
    const { delayShow } = this.props;

    if (this.timeOutRef) {
      clearTimeout(this.timeOutRef);
      this.timeOutRef = undefined;
    }
    if (!delayShow) {
      this.tooltipTrigger?.show();
      return;
    }

    this.timeOutRef = window.setTimeout(() => {
      this.timeOutRef = undefined;
      this.tooltipTrigger?.show();
    }, delayShow);
  };

  hideTooltip = (event: React.SyntheticEvent<HTMLElement>) => {
    const { delayHide = 100 } = this.props;
    if (this.timeOutRef) {
      clearTimeout(this.timeOutRef);
      this.timeOutRef = undefined;
    }

    if (this.tooltipWrapper?.contains(event.target as Element)) {
      this.timeOutRef = window.setTimeout(() => {
        this.timeOutRef = undefined;
        this.tooltipTrigger?.hide();
      }, delayHide);

      return;
    }

    this.tooltipTrigger?.hide();
  };

  renderTooltip = () => {
    const { overlay, tooltipId } = this.props;

    return (
      <Tooltip id={tooltipId}>
        <div
          onMouseEnter={this.showTooltip}
          onFocus={this.showTooltip}
          onMouseLeave={this.hideTooltip}
          onBlur={this.hideTooltip}
          id="tooltip-content"
        >
          {overlay}
        </div>
      </Tooltip>
    );
  };

  _setWrapperRef = (ref: HTMLElement | null) => {
    this.tooltipWrapper = ref;
  };

  _setTriggerRef = (ref: OverlayTrigger | null) => {
    this.tooltipTrigger = ref as OverlayTriggerInstance;
  };

  render() {
    const { children, placement = 'top' } = this.props;

    return (
      <div
        onMouseEnter={this.showTooltip}
        onFocus={this.showTooltip}
        onMouseLeave={this.hideTooltip}
        onBlur={this.hideTooltip}
        ref={this._setWrapperRef}
      >
        <OverlayTrigger placement={placement} overlay={this.renderTooltip()} trigger="manual" ref={this._setTriggerRef}>
          {children}
        </OverlayTrigger>
      </div>
    );
  }
}

export default HoverableOverlayTrigger;
