import React from 'react';
import 'css!./__styles__/FeedbackComplete';

type Props = {
  hideDelay?: number;
  onTimeout: Function;
  children: React.ReactNode;
};

class FeedbackComplete extends React.Component<Props> {
  static defaultProps = {
    hideDelay: 5000,
  };

  componentDidMount() {
    const { onTimeout, hideDelay } = this.props;

    this._hideCompleteTimer = window.setTimeout(() => {
      onTimeout();
    }, hideDelay);
  }

  componentWillUnmount() {
    if (this._hideCompleteTimer) {
      clearTimeout(this._hideCompleteTimer);
    }
  }

  _hideCompleteTimer: number | null = null;

  render() {
    const { children } = this.props;
    return <div className="rc-FeedbackComplete">{children}</div>;
  }
}

export default FeedbackComplete;
