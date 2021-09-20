import React from 'react';

import { getScrollParent } from 'app/src/getScrollParent';

interface ScrolledPastWatcherProps {
  setScrolledPast: (isScrolledPast: boolean) => void;
}

export class ScrolledPastWatcher extends React.Component<ScrolledPastWatcherProps> {
  el?: HTMLElement;
  scrollContainer?: HTMLElement | Window;
  scrollContainerTop?: number;
  isScrolledPast?: boolean;
  intervalID?: number;
  requestID?: number;

  setRef = (el: HTMLElement | null) => {
    if (el) {
      this.el = el;
      this.scrollContainer = getScrollParent(this.el);
      this.scrollContainerTop =
        this.scrollContainer instanceof HTMLElement
          ? this.scrollContainer.getBoundingClientRect().top
          : 0;
      this.handleRequestAnimationFrame();
    } else if (this.scrollContainer) {
      delete this.el;
      delete this.scrollContainer;
      delete this.scrollContainerTop;
      this.props.setScrolledPast(false);
    }
  };

  constructor(props: ScrolledPastWatcherProps) {
    super(props);
    this.handleInterval = this.handleInterval.bind(this);
    this.handleRequestAnimationFrame = this.handleRequestAnimationFrame.bind(
      this,
    );
    const INTERVAL = 20;
    this.intervalID = window.setInterval(this.handleInterval, INTERVAL);
  }

  componentWillUnmount() {
    if (this.intervalID) {
      window.clearInterval(this.intervalID);
    }
    if (this.requestID) {
      cancelAnimationFrame(this.requestID);
    }
    delete this.requestID;
    delete this.intervalID;
  }

  handleInterval() {
    if (this.requestID) {
      cancelAnimationFrame(this.requestID);
    }
    this.requestID = requestAnimationFrame(this.handleRequestAnimationFrame);
  }

  handleRequestAnimationFrame() {
    if (
      this.el &&
      this.scrollContainer &&
      this.scrollContainerTop !== undefined
    ) {
      const rect = this.el.getBoundingClientRect();
      const isScrolledPast = rect.bottom < this.scrollContainerTop;

      if (isScrolledPast !== this.isScrolledPast) {
        this.isScrolledPast = isScrolledPast;
        this.props.setScrolledPast(isScrolledPast);
      }
    }
  }

  render() {
    return <div ref={this.setRef} children={this.props.children} />;
  }
}
