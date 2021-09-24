import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';

import * as C from './constants';

import {SigninDesktopModal} from '../../../../shared/library/modals/signin';
import MatchHero from './match_hero.jsx';
import MatchResults from './match_results.jsx';
import MatchLoadMore from './match_load_more.jsx';

export default
@observer
class Match extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signIn: false
    };

    this.closeSignInModal = this.closeSignInModal.bind(this);

    this.bindEvents();
  }

  bindEvents() {
    $(document).on('match.sign-in', () => {
      this.setState({signIn: true});
    });
  }

  getChildContext() {
    return {
      globalStore: this.context.globalStore,
      routerProps: this.context.routerProps,
      toolSlug: this.props.routeParams.toolSlug
    };
  }

  closeSignInModal() {
    this.setState({signIn: false});
  }

  render() {
    return (
      <div className="match">
        <MatchHero />
        <MatchResults />
        <MatchLoadMore />
        {this.state.signIn && (
          <SigninDesktopModal onDismiss={this.closeSignInModal} redirect={C.BASE_PATH} />
        )}
      </div>
    );
  }
}

Match.contextTypes = {
  globalStore: PropTypes.object,
  routerProps: PropTypes.object
};
Match.childContextTypes = {
  globalStore: PropTypes.object,
  routerProps: PropTypes.object,
  toolSlug: PropTypes.string
};
