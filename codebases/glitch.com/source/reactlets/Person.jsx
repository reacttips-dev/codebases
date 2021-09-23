import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import AcceptingInvitePop from './pop-overs/AcceptingInvitePop';
import EnsureProjectLoaded from './EnsureProjectLoaded';
import PersonAvatar from './PersonAvatar';
import PersonPop from './pop-overs/PersonPop';
import WaitingForInvitePop from './pop-overs/WaitingForInvitePop';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';

const ACCEPTING_INVITE = 'ACCEPTING_INVITE';
const WAITING_FOR_INVITE = 'WAITING_FOR_INVITE';
const PERSON = 'PERSON';

function getPopType(awaitingInvite, userRole, isCurrentUser) {
  if (awaitingInvite && userRole === 'Admin') {
    return ACCEPTING_INVITE;
  }
  if (awaitingInvite && isCurrentUser) {
    return WAITING_FOR_INVITE;
  }
  return PERSON;
}

function useNotificationMessage(user) {
  const application = useApplication();
  const currentUserRole = useObservable(application.currentUserRole);
  const awaitingInvite = useObservable(user.awaitingInvite);
  const notificationMessage = currentUserRole === 'Admin' ? `Can I join?` : `Asked to join...`;

  if (!awaitingInvite) {
    return undefined;
  }

  return notificationMessage;
}

function PersonContent({ user, showPopOnClick = true, showTooltipOnTop, hideOnlineStatus = false }) {
  const application = useApplication();

  const currentUser = useObservable(application.currentUser);

  const login = useObservable(user.login) || 'Anonymous';
  const awaitingInvite = useObservable(user.awaitingInvite);
  const isCurrentUser = user === currentUser;
  const currentUserRole = useObservable(application.currentUserRole);

  const [pop, setPop] = useState(null);
  const [top, setTop] = useState(null);
  const [left, setLeft] = useState(null);
  const [hideNotification, setHideNotification] = useState(false);

  if (hideNotification && !awaitingInvite) {
    setHideNotification(false);
  }

  const notificationMessage = useNotificationMessage(user);

  useEffect(() => {
    if (showPopOnClick) {
      const off = application.onCloseAllPopOvers(() => {
        setPop(null);
      });
      return off;
    }
    return undefined;
  }, [application, showPopOnClick]);

  const onClick = (e) => {
    application.closeAllPopOvers();
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    user.updateThanks(application);
    const popType = getPopType(awaitingInvite, currentUserRole, isCurrentUser);
    setPop(popType);
    setTop(rect.bottom);
    setLeft(rect.left);
    setHideNotification(popType === ACCEPTING_INVITE);
  };

  const popStyle = {
    top: `${top}px`,
    left: `${left}px`,
  };

  const showNotification = !hideNotification && showPopOnClick;

  return (
    <>
      {/* Existing a11y issue ported to React */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <span
        className={cn('person', { 'person-current-user': user === currentUser })}
        onClick={showPopOnClick ? onClick : undefined}
        // `data-tooltip` must be null and not false when we don't want to show a notification, otherwise
        // we'll see a tooltip that says "false"
        data-tooltip={showNotification ? notificationMessage : null}
        data-tooltip-persistent
        data-tooltip-left
        data-tooltip-notification
        data-tooltip-clickable
      >
        <div data-tooltip={login} data-tooltip-left data-tooltip-top={showTooltipOnTop || undefined} data-testid="person-avatar">
          <PersonAvatar user={user} hideOnlineStatus={hideOnlineStatus} />
        </div>
      </span>
      {pop === ACCEPTING_INVITE && <AcceptingInvitePop user={user} style={popStyle} />}
      {pop === WAITING_FOR_INVITE && <WaitingForInvitePop user={user} style={popStyle} />}
      {pop === PERSON && <PersonPop user={user} style={popStyle} />}
    </>
  );
}

export default function Person(props) {
  return (
    <EnsureProjectLoaded>
      <PersonContent {...props} />
    </EnsureProjectLoaded>
  );
}
