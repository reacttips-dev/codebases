import React, { MouseEvent, ReactElement } from 'react';
import { connect } from 'react-redux';
import { showProfilePaywallsModal } from '../../../../money';
import { events, OpenModalLocation } from '../../events';

export const ProfilePaywallsModalTriggerView = ({
  children,
  showProfilePaywallsModal,
  locationForAnalytics,
}: {
  children: ReactElement;
  showProfilePaywallsModal: () => void;
  locationForAnalytics: OpenModalLocation;
}) => {
  return (
    <>
      {React.cloneElement(children, {
        onClick: (event: MouseEvent<HTMLElement>) => {
          if (children.props && children.props.onClick) {
            children.props.onClick(event);
          }
          showProfilePaywallsModal();
          if (locationForAnalytics) {
            events.openModal(locationForAnalytics);
          }
        },
      })}
    </>
  );
};

export const ProfilePaywallsModalTrigger = connect(null, dispatch => ({
  showProfilePaywallsModal: () => dispatch(showProfilePaywallsModal()),
}))(ProfilePaywallsModalTriggerView);
