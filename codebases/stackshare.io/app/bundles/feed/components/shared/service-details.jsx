import ServiceDetailsPopover from '../../../../shared/library/popovers/service-details';
import React from 'react';
import FollowServiceButton from '../../../../shared/library/buttons/follow/follow-service-button';

export default class ConnectedServiceDetailsPopover extends ServiceDetailsPopover {
  renderFollowButton() {
    const {
      showFollow,
      onFollowToggle,
      service: {id, following}
    } = this.props;
    if (showFollow) {
      return <FollowServiceButton serviceId={id} onToggle={onFollowToggle} following={following} />;
    }
  }
}
