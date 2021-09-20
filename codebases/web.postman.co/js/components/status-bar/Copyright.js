import React from 'react';
import XPath from '../base/XPaths/XPath';
import { getStore } from '../../stores/get-store';
import { EULA_LINK, LICENSE_URL } from '../../constants/AppUrlConstants';
import { VISIBILITY } from '../../constants/WorkspaceVisibilityConstants';
import { openExternalLink } from '@postman-app-monolith/renderer/js/external-navigation/ExternalNavigationService';

const PRIVACY_POLICY = 'privacy-policy',
  TERMS = 'terms';

export default {
  name: 'Copyright',
  position: 'right',
  getComponent ({
    React,
    StatusBarComponents
  }) {
    return class Copyright extends React.Component {
      constructor (props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
      }

      handleClick = (name) => {
        switch (name) {
          case PRIVACY_POLICY:
            return openExternalLink(LICENSE_URL);
          case TERMS:
            return openExternalLink(EULA_LINK);
          default:
            break;
        }
      };

      render () {
        const { Item, Text } = StatusBarComponents,
          isLoggedIn = getStore('CurrentUserStore').isLoggedIn,
          isPublicWorkspace = getStore('ActiveWorkspaceStore').visibilityStatus === VISIBILITY.public;

        return (
          <XPath identifier='copyright'>
            {
              !isLoggedIn && isPublicWorkspace && (
                <Item>
                  <Text
                    className='copyright-container'
                    render={() => {
                      return (
                        <div className='copyright-text'>
                          <span>&copy; {new Date().getFullYear()} Postman, Inc.</span>
                          &nbsp;-&nbsp;
                          <span
                            className='copyright-link'
                            onClick={() => this.handleClick(PRIVACY_POLICY)}
                          >
                            Privacy Policy
                          </span>
                          &nbsp;-&nbsp;
                          <span
                            className='copyright-link'
                            onClick={() => this.handleClick(TERMS)}
                          >
                            Terms
                          </span>
                        </div>
                      );
                    }}
                  />
                </Item>
              )
            }
          </XPath>
        );
      }
    };
  }
};
