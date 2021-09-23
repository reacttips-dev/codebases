import React, { useCallback } from 'react';
import { Icon } from '@glitchdotcom/shared-components';
import PopPortal from '../../components/PopPortal';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';

export default function AcceptingInvitePop({ user, style }) {
  const application = useApplication();
  const profileUrl = useObservable(user.profileUrl);
  const avatarUrl = useObservable(useCallback(() => user.userAvatarUrl('large'), [user]));
  const anonAvatarStyle = useObservable(
    useCallback(
      () => ({
        backgroundColor: user.color(),
        borderColor: user.secondaryColor(),
      }),
      [user],
    ),
  );
  const userAvatarStyle = {
    backgroundImage: `url(${avatarUrl})`,
  };
  const name = useObservable(useCallback(() => user.name() || user.login() || 'Anonymous', [user]));
  const login = useObservable(useCallback(() => (name !== user.login() ? user.login() : null), [name, user]));

  const acceptJoinRequest = () => {
    application.acceptInviteRequest(user);
    application.closeAllPopOvers();
  };

  return (
    <PopPortal>
      {/* ESLINT-CLEAN-UP */}
      {/* eslint-disable-next-line */}
      <dialog className="pop-over accepting-invite-pop" style={style}>
        <a href={profileUrl}>
          <section className="info profile-summary">
            <div className="profile-wrap">
              {avatarUrl ? (
                <div className="avatar icon" style={userAvatarStyle} />
              ) : (
                <div className="avatar icon anon-avatar" style={anonAvatarStyle} />
              )}
              <div className="user-info">
                <h1>{name}</h1>
                {login && <p className="login">{login}</p>}
              </div>
            </div>
          </section>
        </a>
        <section className="actions">
          <button className="button" onClick={acceptJoinRequest}>
            Invite to Edit <Icon icon="thumbsUp" />
          </button>
        </section>
      </dialog>
    </PopPortal>
  );
}
