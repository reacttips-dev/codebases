import ClassroomNavContainer from './_nav-container';
import { Helmet } from 'react-helmet';
import { Layout } from '@udacity/ureact-app-layout';
import { Loading } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import React from 'react';
import ServiceLinks from 'components/common/service-links';
import ServiceLinksContainer from 'components/common/service-links-container';
import { __ } from 'services/localization-service';
import classnames from 'classnames';
import styles from './_layout.scss';

export default class AppLayout extends React.Component {
  static displayName = 'components/app-layout';
  static propTypes = {
    busy: PropTypes.bool,
    children: PropTypes.node,
    documentTitle: PropTypes.string,
    navVariant: PropTypes.oneOf(['small', 'large', 'dashboard', 'none']),
  };

  static defaultProps = {
    busy: false,
    navVariant: 'small',
  };

  state = { isHelpSidebarOpen: false };

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const openHelp = urlParams.get('help');
    openHelp === 'true' && this.handleOpenHelpSidebar();
  }

  ref = React.createRef();

  handleOpenHelpSidebar = () =>
    !this.state.isHelpSidebarOpen && this.setState({ isHelpSidebarOpen: true });

  handleCloseHelpSidebar = () =>
    this.state.isHelpSidebarOpen && this.setState({ isHelpSidebarOpen: false });

  handleToggleHelpSidebar = () =>
    this.state.isHelpSidebarOpen
      ? this.handleCloseHelpSidebar()
      : this.handleOpenHelpSidebar();

  render() {
    const {
      busy,
      children,
      navVariant,
      documentTitle,
      sidebar,
      ...rest
    } = this.props;
    const { isHelpSidebarOpen } = this.state;
    const variant =
      isHelpSidebarOpen || navVariant === 'dashboard' ? 'small' : navVariant;
    const isSmallNav = variant === 'small';
    return (
      <div
        ref={this.ref}
        className={classnames({
          [styles['nav']]: isSmallNav,
          [styles['large-nav']]: !isSmallNav,
          [styles['sidebar']]: isHelpSidebarOpen,
          [styles['overlay']]: isHelpSidebarOpen,
        })}
      >
        <Layout
          {...rest}
          backgroundColor="#FAFBFC"
          nav={
            navVariant === 'none' ? null : (
              <ClassroomNavContainer
                variant={variant}
                isHelpSidebarOpen={isHelpSidebarOpen}
                onToggleHelpSidebar={this.handleToggleHelpSidebar}
              />
            )
          }
          sidebar={
            isHelpSidebarOpen ? (
              <ServiceLinksContainer
                onCloseHelpSidebar={this.handleCloseHelpSidebar}
                DisplayComponent={ServiceLinks}
              />
            ) : (
              sidebar
            )
          }
        >
          <Helmet>
            <title>
              {__('<%= documentTitle %> - Udacity', {
                documentTitle: busy ? __('Loading') : documentTitle,
              })}
            </title>
          </Helmet>
          {busy ? (
            <div className={styles['loading-wrapper']}>
              <Loading size="lg" busy />
            </div>
          ) : (
            children
          )}
        </Layout>
      </div>
    );
  }
}
