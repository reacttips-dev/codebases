import { Component, ErrorInfo, ReactNode } from 'react';
import {
  sendCrashEvent,
  sendErrorEvent,
  sendChunkLoadErrorEvent,
} from '@trello/error-reporting';
import Alert from 'app/scripts/views/lib/alerts';

import { forTemplate } from '@trello/i18n';

const format = forTemplate('error');

interface ChunkLoadErrorBoundaryProps {
  fallback: ReactNode;
  retryAfter?: number;
}

interface ChunkLoadErrorBoundaryState {
  hasChunkLoadError: boolean;
  numberOfRetries: number;
}

export class ChunkLoadErrorBoundary extends Component<
  ChunkLoadErrorBoundaryProps,
  ChunkLoadErrorBoundaryState
> {
  state = {
    hasChunkLoadError: false,
    numberOfRetries: 0,
  };

  timeoutID?: number;

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    if (error.name === 'ChunkLoadError') {
      return { hasChunkLoadError: true };
    } else {
      throw error;
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.state.numberOfRetries === 3) {
      sendCrashEvent(error, {
        extraData: { ...errorInfo },
      });
      Alert.showLiteralText(
        `${format('global-unhandled')} - ${format('reload-call-to-action')}`,
        'error',
        'alert',
        10000,
      );
    } else if (this.state.hasChunkLoadError) {
      sendChunkLoadErrorEvent(error);
    } else {
      sendErrorEvent(error, {
        extraData: { ...errorInfo },
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
  }

  componentDidUpdate() {
    if (
      this.state.hasChunkLoadError === true &&
      this.props.retryAfter &&
      !this.timeoutID &&
      this.state.numberOfRetries < 3
    ) {
      this.timeoutID = window.setTimeout(() => {
        const updatedNumberOfRetries = this.state.numberOfRetries + 1;
        this.setState({
          hasChunkLoadError: false,
          numberOfRetries: updatedNumberOfRetries,
        });
        this.timeoutID = undefined;
      }, this.props.retryAfter);
    }
  }

  render() {
    if (this.state.hasChunkLoadError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
