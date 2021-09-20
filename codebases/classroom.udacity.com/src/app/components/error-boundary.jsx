import { GENERAL_ERROR_SCREEN } from '../errors/app-error';
import GeneralError from 'components/common/error/app-error';
import InternalError from 'components/common/internal-error';
import { isAppError } from 'errors/app-error';
import { reportError } from '../initializers/sentry';

export default class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  // eslint-disable-next-line no-unused-vars
  componentDidCatch(error, stackTrace) {
    reportError(error);
  }

  render() {
    if (this.state.hasError) {
      const errorMsg = isAppError(this.state.error)
        ? this.state.error.message
        : "Sorry, we can't seem to find the page you are looking for.";

      if (this.props.type === GENERAL_ERROR_SCREEN) {
        return <GeneralError />;
      }
      return <InternalError message={errorMsg} />;
    } else {
      return this.props.children;
    }
  }
}
