/* eslint-disable import/no-default-export */
import React, { Component } from 'react';

interface State {
  hasError: boolean;
}

interface Props {
  children: React.ReactNode;
  onError?: () => void;
}

export default class FeedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error) {
    const { onError = () => {} } = this.props;

    onError();
    this.setState({ hasError: true });
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
