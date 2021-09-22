// If you want an important deferred off screen component to load before user interaction,
// but not affect TTI. Trigger loading when the user has scrolled (and most likely after TTI).
import React from 'react';

type State = {
  hasPageScrolled: boolean;
};

export const withHasPageScrolled = <P extends Record<string, unknown>>(Component: React.ComponentType<P>) => {
  return class WithPageScrolled extends React.Component<P, State> {
    state = {
      hasPageScrolled: false,
    };

    componentDidMount() {
      window.addEventListener(
        'scroll',
        () => {
          this.pageHasScrolled();
        },
        { once: true }
      );
    }

    pageHasScrolled = () => {
      this.setState(() => ({
        hasPageScrolled: true,
      }));
    };

    render() {
      const { hasPageScrolled } = this.state;

      return <Component {...{ ...this.props, hasPageScrolled }} />;
    }
  };
};

export default withHasPageScrolled;
