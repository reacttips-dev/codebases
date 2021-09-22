import Q from 'q';
import { Component } from 'react';
import type { ApiStatus } from '@coursera/coursera-ui/lib/constants/sharedConstants';
import {
  API_BEFORE_SEND,
  API_IN_PROGRESS,
  API_ERROR,
  API_SUCCESS,
} from '@coursera/coursera-ui/lib/constants/sharedConstants';

type RenderProps = {
  apiStatus: ApiStatus;
  onClick: () => Q.Promise<void>;
};

type Props = {
  getLaunchUrl: () => Q.Promise<string>;
  resetApiStatusDelay?: number;
  onLaunch?: (link: string) => void;
  onError?: () => void;
  onComplete?: () => void;
  render: (props: RenderProps) => React.ReactNode;
};

type State = {
  apiStatus: ApiStatus;
  onClick: () => Q.Promise<void>;
};

/**
 * This workspace launcher is designed to generate workspace URLs/tokens on demand and
 * then open that URL.
 *
 * The reason tokens are generated on demand, rather than ahead of time for quick opening, is
 * because generating tokens ahead of time (and again, when the button is clicked) causes a race
 * condition because:
 *
 *   1. Tokens are single-use, so after it is used a new one must be generated.
 *   2. Generating a new token invalidates the previous token.
 *
 * So what was happening was you would click the button to use the token that was generated on
 * mount, and at the same time kick off a request to get a new token for the next click, but
 * sometimes the new token would be generated before the old token was checked, making the
 * request to open your workspace fail.
 */
class WorkspaceLauncher extends Component<Props, State> {
  static defaultProps = {
    resetApiStatusDelay: 5000,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      apiStatus: API_BEFORE_SEND,
      onClick: this.handleApiButtonClick,
    };
  }

  handleApiButtonClick = (): Q.Promise<void> => {
    const { apiStatus } = this.state;

    if (apiStatus !== API_BEFORE_SEND) {
      return Q.resolve();
    }

    // Some browsers (like Safari) require `window.open` to be called directly in a button click
    // handler, so we create a new window here, get the new window link, then set the new window's
    // location to that link.
    // https://stackoverflow.com/questions/20696041/window-openurl-blank-not-working-on-imac-safari
    const newWindow = window.open('', '_blank');

    // TODO: Add the ability to surface an error message (e.g. from the API).
    const handleFailure = () => {
      newWindow?.close();
      this.resetApiStatusAfterDelay();
      this.handleApiError();
      return this.setApiStatus(API_ERROR);
    };

    return this.setApiStatus(API_IN_PROGRESS)
      .then(() => {
        const { getLaunchUrl } = this.props;
        return getLaunchUrl();
      })
      .then((link: string) => {
        const { onLaunch, onComplete } = this.props;

        if (link) {
          this.resetApiStatusAfterDelay();

          if (newWindow) {
            newWindow.location.href = link;
          } else {
            // This seems like a client error
          }

          onLaunch?.(link);
          onComplete?.();
          return this.setApiStatus(API_SUCCESS);
        } else {
          handleFailure();
        }
      }, handleFailure)
      .catch(handleFailure);
  };

  handleApiError = () => {
    const { onError, onComplete } = this.props;
    onError?.();
    onComplete?.();
  };

  setApiStatus = (apiStatus: ApiStatus): Q.Promise<void> => {
    return Q.Promise((resolve) => {
      this.setState({ apiStatus }, () => {
        resolve();
      });
    });
  };

  resetApiStatus = () => {
    clearTimeout(this.resetApiStatusTimeoutId);
    this.resetApiStatusTimeoutId = 0;
    this.setApiStatus(API_BEFORE_SEND);
  };

  resetApiStatusAfterDelay = () => {
    const { resetApiStatusDelay } = this.props;
    this.resetApiStatusTimeoutId = setTimeout(this.resetApiStatus, resetApiStatusDelay);
  };

  resetApiStatusTimeoutId = 0;

  render() {
    const { render } = this.props;
    return render(this.state);
  }
}

export default WorkspaceLauncher;
