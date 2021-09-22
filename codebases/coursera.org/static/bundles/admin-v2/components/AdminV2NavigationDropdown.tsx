import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';

import _t from 'i18n!nls/page';
import cookie from 'js/lib/cookie';
import connectToRouter from 'js/lib/connectToRouter';

import { getActionUrl } from 'bundles/user-account/common/lib';

import MyCourseraButton from 'bundles/admin-v2/components/MyCourseraButton';
import NavigationHeader from 'bundles/admin-v2/components/NavigationHeader';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ListWithKeyboardControls from 'bundles/phoenix/components/a11y/ListWithKeyboardControls';

import type { PartnersQuery_PartnersV1Resource_multiGet_elements as Partner } from 'bundles/enterprise-admin-home/components/__generated__/PartnersQuery';

import 'css!./__styles__/AdminV2NavigationDropdown';

type PartnersV1 = {
  name: string;
  partnerId: number;
  shortName: string;
  rectangularLogo: string;
  logo: string;
};

interface MyAdminsByPartnerShortNameQuery {
  MyAdminsV1Resource:
    | {
        elements: Array<{ partners: Array<PartnersV1> }> | undefined;
      }
    | undefined;
}

type PropsFromGraphQL = {
  adminPartners: Array<PartnersV1> | undefined;
};

type PropsFromCaller = {
  shortName?: string;
};

type PropsFromPartnersGraphql = {
  myPartners: Partner[];
};

type Props = PropsFromCaller & PropsFromGraphQL & PropsFromPartnersGraphql;

type State = {
  showNavMenu: boolean;
};

class AdminV2NavigationDropdown extends React.PureComponent<Props, State> {
  node: HTMLDivElement | null | undefined;

  static contextTypes = {
    router: PropTypes.object,
    enableSkillsPlanningForOrg: PropTypes.bool,
  };

  state = {
    showNavMenu: false,
  };

  componentDidUpdate(prevProps: Props, { showNavMenu: prevShowNavMenu }: State) {
    const { showNavMenu } = this.state;
    if (showNavMenu !== prevShowNavMenu) {
      if (showNavMenu) {
        // attach / remove event listener to monitor click and close/open menu accordingly.
        // When user click anywhere  after menu is opened, toggleMenu() will close when
        // user clicked outside of the DropDown
        document.addEventListener('click', this.handleClick, false);
      } else {
        document.removeEventListener('click', this.handleClick, false);
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  handleClick = (e: MouseEvent) => {
    if (this.node && this.node.contains(e.target as Node)) {
      return;
    }
    this.toggleMenu();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleBlur = (e: any) => {
    const { showNavMenu } = this.state;
    if (this.node && this.node.contains(e.relatedTarget)) {
      return;
    }
    if (showNavMenu) {
      this.toggleMenu();
    }
  };

  toggleMenu = () => {
    this.setState((prevState) => ({
      showNavMenu: !prevState.showNavMenu,
    }));
  };

  renderHelpLink = () => {
    const text = _t('Educator Resource Center');
    const href = 'https://partner.coursera.help/hc';

    return (
      <li key={text} className="list-item">
        <a className="menu-item" href={href} target="_blank" rel="noopener noreferrer" data-e2e={`Help_Link~${text}`}>
          {text}
        </a>
      </li>
    );
  };

  renderLogOutLink = () => {
    const csrfToken = cookie.get('CSRF3-Token') || '';

    return (
      <li className="list-item" key="logout">
        <form action={getActionUrl('logout', csrfToken)} method="post">
          <button className="menu-item" type="submit" data-e2e="Log_Out_Link">
            {_t('Log Out')}
          </button>
        </form>
      </li>
    );
  };

  render() {
    const { adminPartners } = this.props;
    const partner = adminPartners?.[0];
    const { showNavMenu } = this.state;

    return (
      <div
        id="adminV2NavigationMenu"
        className="rc-AdminV2NavigationDropdown"
        ref={(ref) => {
          this.node = ref;
        }}
      >
        <NavigationHeader
          header={_t('Educator Admin')}
          label={partner?.name as string}
          isActive={showNavMenu}
          onClick={this.toggleMenu}
        />

        {showNavMenu && (
          <ListWithKeyboardControls
            className="list"
            role="menu"
            aria-label={_t('Admin Navigation Menu')}
            aria-labelledby="adminNavigationMenu"
            onEsc={this.toggleMenu}
            activateClick
          >
            <MyCourseraButton />
            {this.renderHelpLink()}
            {this.renderLogOutLink()}
          </ListWithKeyboardControls>
        )}
      </div>
    );
  }
}

export default compose<Props, PropsFromCaller>(
  connectToRouter((router) => {
    return { shortName: router.params.shortName };
  }),
  graphql<Props & { userPreferencesSelectedPartnerId?: number }, MyAdminsByPartnerShortNameQuery, {}, PropsFromGraphQL>(
    /* eslint-disable graphql/template-strings */
    gql`
      query MyAdminsByPartnerShortNameQuery {
        MyAdminsV1Resource(shortName: $shortName)
          @rest(
            type: "MyAdminsV1Resource"
            path: "myAdmins.v1?q=byPartnerShortName&shortName={args.shortName}&fields=partners"
            method: "GET"
          ) {
          elements @type(name: "MyAdmins") {
            id
            partners
          }
        }
      }
    `,
    {
      options: ({ shortName }) => ({
        variables: { shortName },
        errorPolicy: 'all',
      }),

      props: ({ data, ownProps }) => {
        const myAdminPartners = data?.MyAdminsV1Resource?.elements?.[0]?.partners;

        return {
          ...ownProps,
          adminPartners: myAdminPartners,
        };
      },
    }
  )
)(AdminV2NavigationDropdown);
