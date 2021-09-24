import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {NotFound} from './stack-edit_constants';

import StackEditHeader from './stack-edit_header.jsx';
import NotFoundView from '../shared/error/NotFoundView.jsx';
import ErrorBar from '../shared/bars/error.jsx';
import NotificationBar from '../shared/bars/notification.jsx';

export default
@observer
class StackEdit extends Component {
  componentDidMount() {
    this.context.globalStore.setSlugs(
      this.props.routeParams.ownerSlug,
      this.props.routeParams.stackSlug
    );
  }

  getChildContext() {
    return {
      globalStore: this.context.globalStore,
      slugs: {
        ownerSlug: this.props.routeParams.ownerSlug,
        stackSlug: this.props.routeParams.stackSlug
      }
    };
  }

  render() {
    if (this.context.globalStore.stackInfo.id === NotFound) return <NotFoundView />;
    const {
      location: {pathname}
    } = this.props;
    return (
      <div className="stack-edit">
        <StackEditHeader location={pathname} />
        <ErrorBar />
        <NotificationBar />
        <div className="fluid-container">{this.props.children}</div>
      </div>
    );
  }
}

StackEdit.contextTypes = {
  globalStore: PropTypes.object
};
StackEdit.childContextTypes = {
  globalStore: PropTypes.object,
  slugs: PropTypes.object
};
