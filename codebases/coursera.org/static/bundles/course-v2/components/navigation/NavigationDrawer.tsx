import React from 'react';

type Props = {
  children: React.ReactNode;
};

class NavigationDrawer extends React.Component<Props> {
  render() {
    const { children } = this.props;

    return <div className="rc-NavigationDrawer">{children}</div>;
  }
}

export default NavigationDrawer;
