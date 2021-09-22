// Detect when window has finished loading everything and pass down as prop.
// Useful for lazy loading components that need to be ready before user interaction,
// but still grant a performance lift by not contributing to initial page load.
import React from 'react';

const DOCUMENT_COMPLETE_READY_STATE = 'complete';

type State = {
  hasPageLoaded: boolean;
};

export default <P extends Record<string, unknown>>(Component: React.ComponentType<P>) => {
  return class WithPageLoaded extends React.Component<P, State> {
    state = {
      hasPageLoaded: false,
    };

    componentDidMount() {
      window.addEventListener('load', this.pageHasLoaded);
      // Sometimes the page is already done loading by the time we get here so the listener never fires.
      // Check ready state to see if document is already done loading.
      if (document.readyState === DOCUMENT_COMPLETE_READY_STATE) {
        this.pageHasLoaded();
      }
    }

    componentWillUnmount() {
      window.removeEventListener('load', this.pageHasLoaded);
    }

    pageHasLoaded = () => {
      this.setState(() => ({
        hasPageLoaded: true,
      }));
    };

    render() {
      const { hasPageLoaded } = this.state;

      return <Component {...{ ...this.props, hasPageLoaded }} />;
    }
  };
};
