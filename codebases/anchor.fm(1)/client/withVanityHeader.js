import React, { Component } from 'react';
import { connect } from 'react-redux';
import withRouter from 'react-router-dom/withRouter';
import { ProfilePageOverrideNav } from './components/PublicWebsiteNav/components/ProfilePageOverrideNav';
import { isIOS, isAndroidChrome } from '../helpers/serverRenderingUtils';

export function withVanityHeader(BaseComponent) {
  const mapStateToProps = ({
    user: { user, hostName },
    global: {
      podcast: {
        podcast: { profileColor },
      },
    },
  }) => ({
    user,
    hostName,
    profileColor,
  });

  class WithVanityHeader extends Component {
    // Static SSR data function
    static fetchData(props) {
      // delegate to wrapped static SSR function if it exists
      return BaseComponent.fetchData && BaseComponent.fetchData(props);
    }

    constructor(props, context) {
      super(props, context);
      this.state = {
        didMount: false,
      };
    }

    componentDidMount() {
      this.setState(() => ({
        didMount: true,
      }));
    }

    render() {
      const { didMount } = this.state;
      const { user, profileColor, ...props } = this.props;
      return (
        <>
          {!user && (
            <ProfilePageOverrideNav
              key="vanityNav"
              isIOS={isIOS()}
              isAndroidChrome={isAndroidChrome()}
              didMount={didMount}
              profileColor={profileColor}
            />
          )}
          <BaseComponent key="vanityComponent" {...props} />
        </>
      );
    }
  }
  return withRouter(connect(mapStateToProps)(WithVanityHeader));
}
