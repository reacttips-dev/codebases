import React from 'react';

type Props = {
  waitInMs: number;
};

type State = {
  isVisible: boolean;
};

class DelayMount extends React.Component<Props, State> {
  state = {
    isVisible: false,
  };

  timeout?: NodeJS.Timer;

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.timeout = undefined;
      this.setState({ isVisible: true });
    }, this.props.waitInMs);
  }

  render() {
    return this.state.isVisible && this.props.children;
  }
}

export default DelayMount;
