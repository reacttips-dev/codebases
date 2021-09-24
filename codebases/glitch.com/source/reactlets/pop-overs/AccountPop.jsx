import React, { useCallback } from 'react';
import cn from 'classnames';
import { Icon, Loader } from '@glitchdotcom/shared-components';
import * as Markdown from '../../utils/markdown';
import TeamButton from '../TeamButton';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import useUserPref from '../../hooks/useUserPref';

function AccountPop({ currentUser }) {
  const application = useApplication();
  const profileUrl = useObservable(currentUser.profileUrl);
  const avatarUrl = useObservable(useCallback(() => currentUser.userAvatarUrl('large'), [currentUser]));
  const color = useObservable(currentUser.color);
  const secondaryColor = useObservable(currentUser.secondaryColor);
  const name = useObservable(currentUser.name);
  const login = useObservable(currentUser.login);
  const description = useObservable(currentUser.description);
  const thanksCount = useObservable(currentUser.thanksCount);
  const [showTipForUserAvatar, setShowTipForUserAvatar] = useUserPref('showTipForUserAvatar', true, { application });

  const teams = useObservable(useCallback(() => currentUser.teams().map((team) => ({ team, id: team.id() })), [currentUser]));

  if (showTipForUserAvatar && avatarUrl) {
    setShowTipForUserAvatar(false);
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      className="pop-over account-pop"
      onClick={() => {
        if (application.teamPopCurrentTeam() !== null) {
          application.teamPopCurrentTeam(null);
        }
      }}
    >
      <a href={profileUrl}>
        <section className={cn('profile-summary', { 'no-bottom-border': description })}>
          <div className="profile-wrap">
            <div
              className={cn('avatar icon', { 'anon-avatar': !avatarUrl })}
              style={avatarUrl ? { backgroundImage: `url("${avatarUrl}")` } : { backgroundColor: color, borderColor: secondaryColor }}
            />
            <div className="user-info">
              <h1>{name}</h1>
              <p className="login">@{login}</p>
            </div>
          </div>
        </section>
      </a>

      {/* i live for danger */}
      {/* eslint-disable-next-line react/no-danger */}
      {description && <section dangerouslySetInnerHTML={{ __html: Markdown.render(description) }} />}

      {thanksCount > 0 && (
        <section>
          <p>
            You've been thanked {thanksCount} time{thanksCount > 1 && 's'} <Icon icon="sparklingHeart" />
          </p>
        </section>
      )}

      {showTipForUserAvatar && (
        <section className="actions">
          <div className="onboarding-tip">
            <div>
              <strong>Add a profile picture</strong> so your friends can recognize you.
            </div>
            <div className="button-wrap">
              <a className="button button-small button-secondary" href={profileUrl}>
                Add a Picture
              </a>
              <button
                className="button button-small button-secondary"
                onClick={() => {
                  setShowTipForUserAvatar(false);
                }}
              >
                Hide
              </button>
            </div>
          </div>
        </section>
      )}

      {teams.length > 0 && (
        <>
          <section className="info">
            <h1>Your Teams</h1>
          </section>

          <section className="actions">
            {teams.map(({ id, team }) => (
              <div className="button-wrap" key={id}>
                <TeamButton team={team} />
              </div>
            ))}
          </section>
        </>
      )}

      <section className="actions">
        <div className="button-wrap">
          {/* TODO: Change this to a link once we integrate shared components */}
          <button
            id="sign-out"
            className="button button-small button-secondary"
            onClick={() => {
              application.analytics.track('Signed Out');
              window.location = '/edit/#!/sign-out';
            }}
          >
            Sign Out <Icon icon="balloon" />
          </button>
        </div>
      </section>
    </dialog>
  );
}

export default function AccountPopLoader() {
  const application = useApplication();
  const visible = useObservable(application.accountPopVisible);
  const currentUser = useObservable(application.currentUser);

  if (!visible) {
    return null;
  }

  if (!currentUser) {
    return (
      <dialog className="pop-over account-pop">
        <div className="pop-loader">
          <Loader />
        </div>
      </dialog>
    );
  }

  return <AccountPop currentUser={currentUser} />;
}
