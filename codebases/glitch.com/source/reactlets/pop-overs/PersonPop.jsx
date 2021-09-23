import React, { useMemo, useCallback } from 'react';
import { Icon } from '@glitchdotcom/shared-components';
import cn from 'classnames';
import * as Markdown from '../../utils/markdown';
import PopPortal from '../../components/PopPortal';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import { access } from '../../const';

export default function PersonPop({ user, style }) {
  const application = useApplication();
  const currentProject = useObservable(application.currentProject);
  const currentUser = useObservable(application.currentUser);
  const profileUrl = useObservable(user.profileUrl);
  const avatarUrl = useObservable(useCallback(() => user.userAvatarUrl('large'), [user]));
  const color = useObservable(user.color);
  const secondaryColor = useObservable(user.secondaryColor);
  const avatarStyle = avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : { backgroundColor: color, borderColor: secondaryColor };
  const name = useObservable(user.name);
  const login = useObservable(user.login);
  const isOnline = useObservable(user.isOnline);
  const isCurrentUser = user === currentUser;
  const personAccessLevel = useObservable(useCallback(() => currentProject && currentProject.accessLevel(user), [currentProject, user]));
  const currentUserAccessLevel = useObservable(
    useCallback(() => currentProject && currentProject.accessLevel(currentUser), [currentProject, currentUser]),
  );
  const thanksCount = useObservable(user.thanksCount);
  const isThankedByCurrentUser = useObservable(user.isThankedByCurrentUser);
  const thanksCountTimes = thanksCount === 1 ? 'time' : 'times';
  const canBroadcast = useObservable(application.canBroadcast);
  const hasMultipleMembers = useObservable(useCallback(() => currentProject && currentProject.users().length > 1, [currentProject]));
  const promptUserSignUp = useObservable(useCallback(() => isCurrentUser && !application.currentUserIsLoggedIn(), [application, isCurrentUser]));
  const description = useObservable(user.description);
  const projectName = useObservable(useCallback(() => currentProject && currentProject.name(), [currentProject]));
  const currentUserOnAnyCurrentProjectTeam = useObservable(application.currentUserOnAnyCurrentProjectTeam);

  const currentFileLocation = useObservable(
    useCallback(() => {
      const cursor = user.lastCursor();
      if (cursor && cursor.cursor) {
        const uuid = cursor.documentId;
        const file = application.fileByUuid(uuid);
        if (!file) {
          return undefined;
        }
        if (cursor.cursor) {
          const line = cursor.cursor.line || 0;
          return `${file.name()}, line ${line + 1}`;
        }
        return file.name();
      }
      return undefined;
    }, [application, user]),
  );

  const toggleUserThanks = () => {
    if (user.isThankedByCurrentUser()) {
      user.removeThanks(application);
    } else {
      application.analytics.track('Thanks Given', {
        recipientId: user.id(),
        recipientHandle: user.login(),
      });
      user.addThanks(application);
    }
  };

  const inviteToEdit = () => {
    application.acceptInviteRequest(user);
    application.closeAllPopOvers();
  };

  const requestToJoin = () => {
    application.askToJoinProject();
  };

  const goToCursor = () => {
    const lastCursor = user.lastCursor();
    if (lastCursor) {
      const { cursor, documentId } = lastCursor;
      const { line } = cursor;
      application.selectFileByUuid(documentId).then(() => {
        application.goToLine(line);
        application.closeAllPopOvers();
      });
    }
  };

  const removeFromProject = () => {
    application.leaveCurrentProject(user);
    application.closeAllPopOvers();
  };

  const leaveProject = () => {
    if (!hasMultipleMembers) {
      window.alert(`You can't leave ${projectName} because you are the only member.`);
    } else if (window.confirm(`Leave ${projectName}?`)) {
      application.closeAllPopOvers();
      application.rewindPanelVisible(false);
      application.leaveCurrentProject();
      application.analytics.track('Project Left', {
        projectMemberWhoLeft: user.login(),
        numberProjectMembers: application.currentProject()?.users().length - 1,
      });
    }
  };

  const htmlDescription = useMemo(() => (description ? Markdown.render(description) : null), [description]);

  const getAccessLevelString = () => {
    switch (personAccessLevel) {
      case access.NONE:
        return 'Project Visitor';
      case access.MEMBER:
        return 'Project Member';
      case access.ADMIN:
        return 'Project Owner';
      default:
        return '';
    }
  };

  return (
    <PopPortal>
      {/* Existing accessibility issue ported to React. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog className="pop-over person-pop" style={style}>
        <section className="info">
          <h1 data-testid="access-level-label">{getAccessLevelString()}</h1>
          {isOnline && !isCurrentUser && <div className="online-active-user">Online</div>}
          {isCurrentUser && (
            <div>
              <span>This is You!</span>
            </div>
          )}
        </section>

        <a href={profileUrl}>
          <section className={cn('profile-summary', { 'no-bottom-border': description || promptUserSignUp })}>
            <div className="profile-wrap">
              <div className={cn('avatar', 'icon', { 'anon-avatar': !avatarUrl })} style={avatarStyle} />
              <div className="user-info">
                <h1>{name || login || 'Anonymous'}</h1>
                {login && <p className="login">@{login}</p>}
              </div>
            </div>
          </section>
        </a>

        {htmlDescription && (
          // danger is my middle name
          // eslint-disable-next-line react/no-danger
          <section className={!promptUserSignUp ? '' : 'no-bottom-border'} dangerouslySetInnerHTML={{ __html: htmlDescription }} />
        )}

        {promptUserSignUp && (
          <section className="actions">
            {/* Existing accessibility issue ported to React. */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <a className="onboarding-tip-link" href="//glitch.com/signin" onClick={application.setDestinationAfterAuth}>
              <div className="onboarding-tip onboarding-tip-wholly-clickable">
                <div>
                  <strong>Create an account </strong>
                  <span>
                    {currentUserAccessLevel > access.NONE ? 'to keep this project and edit it from anywhere.' : 'to save your favorite apps.'}
                  </span>
                </div>
                <div className="button-wrap">
                  <button className="button button-cta button-small">Create an Account</button>
                </div>
              </div>
            </a>
          </section>
        )}

        {isCurrentUser && thanksCount > 0 && (
          <section>
            <p>
              You've been thanked {thanksCount} {thanksCountTimes} <Icon icon="sparklingHeart" />
            </p>
          </section>
        )}
        {!isCurrentUser && (
          <section className="actions">
            <button className="button" onClick={toggleUserThanks}>
              {isThankedByCurrentUser ? (
                <>
                  Thanked <Icon icon="sparklingHeart" />
                </>
              ) : (
                <>
                  Thank <div className={cn('avatar', 'icon', { 'anon-avatar': !avatarUrl })} style={avatarStyle} />
                </>
              )}
            </button>
            {thanksCount > 0 && (
              <div className="thanks-count">
                <p>
                  Thanked {thanksCount} {thanksCountTimes} <Icon icon="sparklingHeart" />
                </p>
              </div>
            )}
          </section>
        )}

        {!isCurrentUser && isOnline && currentFileLocation && (
          <section className="actions">
            <p>{currentFileLocation}</p>
            <div className="button-wrap">
              <button className="button" onClick={goToCursor}>
                Jump to <div className={cn('avatar', { 'anon-avatar': !avatarUrl })} style={avatarStyle} />
              </button>
            </div>
          </section>
        )}

        {/* if the current user and the user for the pop are both project members AND the current user's access level
            is greater or equal to the user for the pop's access level. */}
        {!isCurrentUser &&
          personAccessLevel >= access.MEMBER &&
          currentUserAccessLevel >= access.MEMBER &&
          currentUserAccessLevel >= personAccessLevel && (
            <section className="danger-zone">
              <div className="button-wrap">
                <button id="leave-project" className="button" onClick={removeFromProject}>
                  Remove from Project <Icon icon="wave" />
                </button>
              </div>
            </section>
          )}

        {personAccessLevel < access.MEMBER && !isCurrentUser && currentUserAccessLevel >= access.MEMBER && (
          <section className="actions">
            <div className="button-wrap">
              <button id="join-project" className="button" onClick={inviteToEdit}>
                Invite to Edit <Icon icon="thumbsUp" />
              </button>
            </div>
          </section>
        )}

        {currentUserAccessLevel < access.MEMBER && isCurrentUser && canBroadcast && (
          <section className="actions">
            <div className="button-wrap">
              <button id="join-project" className="button button-small button-secondary" onClick={requestToJoin}>
                {currentUserOnAnyCurrentProjectTeam ? 'Join This Team Project' : 'Request to Join Project'}
              </button>
            </div>
          </section>
        )}

        {isCurrentUser && currentUserAccessLevel >= access.MEMBER && hasMultipleMembers && (
          <section className="danger-zone">
            <div className="button-wrap">
              <button id="leave-project" className="button" onClick={leaveProject}>
                Leave this Project <Icon icon="wave" />
              </button>
            </div>
          </section>
        )}
      </dialog>
    </PopPortal>
  );
}
