// StickyBox tries to find the element's scroll container before the element
// is mounted in the DOM. This causes it to fallback to "window"
// Creating this wrapper component, with a slight delay at componentDidMount
// allows StickyBox to find the div
// https://github.com/codecks-io/react-sticky-box/issues/7

import React, { ReactNode } from 'react';
import StickyBox from 'react-sticky-box';

interface StickyBoxWaitForMountProps {
  className?: string;
  children: ReactNode;
}

export class StickyBoxWaitForMount extends React.Component<
  StickyBoxWaitForMountProps,
  {
    isMounted: boolean;
  }
> {
  constructor(props: StickyBoxWaitForMountProps) {
    super(props);
    this.state = { isMounted: false };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ isMounted: true }));
  }

  render() {
    const { isMounted } = this.state;

    return isMounted ? <StickyBox {...this.props} /> : <div />;
  }
}
