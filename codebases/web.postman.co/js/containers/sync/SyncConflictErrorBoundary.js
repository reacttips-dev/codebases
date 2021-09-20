import React from 'react';

import SyncConflictModalContainerOld from './SyncConflictModalContainerOld';

export default class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch (error, info) {
    this.setState({ hasError: true });
    pm.logger.error('Error in conflict resolution modal while rendering', error, info);
  }

  render () {
    if (this.state.hasError) {

      return <SyncConflictModalContainerOld handleModalClose={this.props.handleClose} />;
    }

    return this.props.children;
  }
}
