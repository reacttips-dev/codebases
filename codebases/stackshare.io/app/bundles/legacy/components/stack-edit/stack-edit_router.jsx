import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Router, Route, browserHistory, Redirect} from 'react-router';

import GlobalStore from './stores/stack-edit-global';
import * as C from './stack-edit_constants';

import StackEdit from './stack-edit.jsx';
import StackInfo from './stack-edit_info.jsx';
import StackToolSelection from './stack-edit_tool_selection.jsx';
import StackToolDetails from './stack-edit_tool_details.jsx';
import NewCompany from '../shared/company/new.jsx';

let globalStore;

export default class StackEditRouter extends Component {
  constructor(props) {
    super(props);

    globalStore = new GlobalStore({routerProps: this.props});
  }

  getChildContext() {
    return {
      globalStore: globalStore,
      routerProps: this.props
    };
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Redirect
          from={`${C.BASE_PATH}/:ownerSlug/:stackSlug`}
          to={`${C.BASE_PATH}/:ownerSlug/:stackSlug/info`}
        />
        <Route path={`${C.BASE_PATH}/:ownerSlug/:stackSlug`} component={StackEdit}>
          <Route path="info" component={StackInfo} />
          <Route path="tool-selection" component={StackToolSelection} />
          <Route path="tool-details" component={StackToolDetails} />
          <Route path="new-company" component={NewCompany} />
        </Route>
      </Router>
    );
  }
}

StackEditRouter.childContextTypes = {
  globalStore: PropTypes.object,
  routerProps: PropTypes.object
};
