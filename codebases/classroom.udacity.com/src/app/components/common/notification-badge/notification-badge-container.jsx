import React, { PureComponent } from 'react';
import {
  selectKnowledgeUnreads,
  selectStudentHubHasUnreads,
  selectStudentHubMentionsCount,
} from 'helpers/state-helper/_services-state-helper';
import NotificationBadge from './index';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  knowledgeUnreads: selectKnowledgeUnreads(state),
  hubMentions: selectStudentHubMentionsCount(state),
  hasHubUnreads: selectStudentHubHasUnreads(state),
});

export class NotificationBadgeContainer extends PureComponent {
  static displayName = 'components/knowledge-link-container';
  static propTypes = {
    knowledgeUnreads: PropTypes.number,
    hubMentions: PropTypes.number,
    hasHubUnreads: PropTypes.bool,
  };

  render() {
    const { knowledgeUnreads, hasHubUnreads, hubMentions } = this.props;
    const totalUnreadCount = knowledgeUnreads + hubMentions;

    if (!knowledgeUnreads && !hasHubUnreads) {
      return null;
    }

    return <NotificationBadge unreadCount={totalUnreadCount} />;
  }
}

export default connect(mapStateToProps, null)(NotificationBadgeContainer);
