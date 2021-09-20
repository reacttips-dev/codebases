import React, { Component, ErrorInfo, FunctionComponent } from 'react';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('error');

import { ErrorDetails } from './ErrorDetails';
import {
  sendCrashEvent,
  sendErrorEvent,
  SentryErrorMetadata,
} from '@trello/error-reporting';

export interface CaughtError {
  error: Error;
  info: ErrorInfo;
}

export interface ErrorHandlerProps {
  caughtError: CaughtError;
}

export const DefaultErrorHandler: FunctionComponent<ErrorHandlerProps> = ({
  caughtError,
}) => (
  <div style={{ padding: 20 }}>
    <h3>
      <span style={{ color: '#DE350B', marginRight: 10 }}>
        {format('global-unhandled')}
      </span>
    </h3>
    <ErrorDetails caughtError={caughtError} />
  </div>
);

interface ErrorBoundaryProps {
  tags?: SentryErrorMetadata['tags'];
  errorHandlerComponent?: FunctionComponent<ErrorHandlerProps>;
  sendCrashEvent?: boolean;
  extraData?: SentryErrorMetadata['extraData'];
}

interface ErrorBoundaryState {
  caughtError: CaughtError | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state = {
    caughtError: null,
  } as ErrorBoundaryState;

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (this.props.sendCrashEvent) {
      sendCrashEvent(error, {
        tags: this.props.tags,
        extraData: this.props.extraData,
      });
    } else {
      sendErrorEvent(error, {
        tags: this.props.tags,
        extraData: this.props.extraData,
      });
    }

    this.setState({ caughtError: { error, info } });
  }

  render() {
    const { caughtError } = this.state;

    if (caughtError) {
      const ErrorHandlerComponent =
        this.props.errorHandlerComponent || DefaultErrorHandler;

      return <ErrorHandlerComponent caughtError={caughtError} />;
    }

    return this.props.children;
  }
}
