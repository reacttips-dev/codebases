import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Router, Route, browserHistory} from 'react-router';
import * as C from './constants';
import GlobalStore from './stores/match-global';
import {observer} from 'mobx-react';
import Match from './match.jsx';

let globalStore;

export default
@observer
class MatchRouter extends Component {
  constructor(props) {
    super(props);

    globalStore = new GlobalStore({routerProps: this.props});
  }

  getChildContext() {
    return {
      globalStore,
      routerProps: this.props
    };
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path={C.BASE_PATH} component={Match} />
        <Route path={`${C.BASE_PATH}/:toolSlug`} component={Match} />
      </Router>
    );
  }
}

MatchRouter.childContextTypes = {
  globalStore: PropTypes.object,
  routerProps: PropTypes.object
};
