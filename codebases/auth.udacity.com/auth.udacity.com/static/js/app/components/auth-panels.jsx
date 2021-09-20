import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { __ } from '../../services/localization-service';
import TabbedPane from '../components/tabbed-pane';

class AuthPanels extends Component {
  static propTypes = {
    selectedTabIndex: PropTypes.number
  };

  _removeErrorQuery(searchString) {
    const errorRegex = /errorCode=[^&]+[&]*/;
    return searchString.replace(errorRegex, '');
  }

  _getTabs() {
    const { history, location } = this.props;

    return [
      {
        label: __('Sign Up'),
        onClick: () => {
          history.push({
            pathname: '/sign-up',
            search: this._removeErrorQuery(location.search)
          });
        }
      },
      {
        label: __('Sign In'),
        onClick: () => {
          history.push({
            pathname: '/sign-in',
            search: this._removeErrorQuery(location.search)
          });
        }
      }
    ];
  }

  render() {
    const { selectedTabIndex, children } = this.props;

    return (
      <TabbedPane tabs={this._getTabs()} selectedTabIndex={selectedTabIndex}>
        {children}
      </TabbedPane>
    );
  }
}

export default withRouter(AuthPanels);
