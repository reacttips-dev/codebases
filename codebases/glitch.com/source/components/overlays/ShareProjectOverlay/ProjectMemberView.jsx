import React, { useEffect, useState } from 'react';
import { Notification, useNotifications } from '@glitchdotcom/shared-components';
import styled from 'styled-components';
import useApplication from '../../../hooks/useApplication';
import useGlitchApi from '../../../hooks/useGlitchApi';
import useObservable from '../../../hooks/useObservable';
import useMediaQuery from '../../../hooks/useMediaQuery';
import UserAvatar from '../../icons/UserAvatar';
import { access } from '../../../const';

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
  display: grid;
`;

const StyledSelect = styled.select`
  width: 100%;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  position: relative;
  font-size: 12px;
  ${(props) => !props.readOnly && 'padding-right: 1em;'}
  height: 1.5rem;
  background: var(--colors-background);
  transition: all 0.2s ease 0s;
  border: none;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  @media (min-width: 592px) {
    font-size: 14px;
    text-align: end;
    direction: rtl;
  }
  &:disabled {
    opacity: 1;
  }
`;

const TextAnnotation = styled.span`
  width: max-content;
  white-space: nowrap;
  color: var(--colors-secondary);
  font-size: 14px;

  @media (min-width: 592px) {
    margin-left: 0.5rem;
  }
`;

const AnnotatedNameWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  span.hyphen {
    display: none;
  }
  @media (min-width: 592px) {
    grid-template-columns: 1fr max-content;
    span.hyphen {
      display: inline;
    }
  }
`;

const EllipsisText = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const PendingText = styled.span`
  color: var(--colors-placeholder);
`;

const StyledMember = styled.div`
  display: flex;
  font-size: 14px;
  align-items: center;
  flex-direction: row;
  & > * + * {
    margin-left: 1rem;
  }
`;

const StyledName = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
`;

const SelectIconWrapper = styled.div`
  position: absolute;
  display: inline-flex;
  height: 100%;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  right: 0;
  top: 50%;
  pointer-events: none;
  z-index: 2;
  transform: translateY(-50%);
  path {
    fill: var(--colors-primary);
  }
`;

const SelectIcon = () => (
  <SelectIconWrapper>
    <svg width="9" height="6" viewBox="0 0 9 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 3.22763L7.64801 0L9 1.38618L4.5 6L0 1.38618L1.35199 0L4.5 3.22763Z" />
    </svg>
  </SelectIconWrapper>
);

const requiresProCheckForOwner = (projectPrivacy) => projectPrivacy === 'private_project' || projectPrivacy === 'private_code';

const SelectContents = ({ accessLevel, handleProjectMemberPermission, isProUser, layout, pending, readOnly, user, projectPrivacy }) => {
  return (
    <>
      <StyledSelect disabled={readOnly} onChange={(e) => handleProjectMemberPermission(e.target.value, user)} value={accessLevel} readOnly={readOnly}>
        {/* We don't want to allow non-pro users to become owners of private projects, or to allow a pending member to become an owner */}
        <option disabled={pending || (requiresProCheckForOwner(projectPrivacy) && isProUser === false)} value={access.ADMIN}>
          Owner
        </option>
        <option value={access.MEMBER}>Can edit code{pending && layout === 'mobile' ? ' - Pending' : ''}</option>
        {pending && <option value="resend">Resend invite</option>}
        <option value="remove">Remove</option>
      </StyledSelect>
      {!readOnly && <SelectIcon />}
    </>
  );
};

/* A member might be a user in our system, or an email that has a pending invite
 * avatarUrl: string;
 * color: string;
 * id: number; // if pending, it’s the pendingInvite id, otherwise the userId
 * login?: string;
 * name?: string;
 * pending?: boolean;
 * user?: UserModel; // optional if pending, not optional otherwise
 * email?: string; // only present if pending and no user
 * projectPermission: PermissionModel; // (which is { accessLevel: number; })
 */

export default function ProjectMemberView({
  currentProject,
  currentUser,
  editable,
  member,
  pendingInviteDispatch,
  pending,
  setShowOwnerTransferOverlayForUser,
}) {
  const { avatarUrl, color, email, id, login, name, user } = member;
  // TODO: we may need to do some cleanup around this so we don't associate information the user didn't provide us with until the pending member has accepted
  const displayName = email || name || login || 'Anonymous';
  const readOnly = currentUser.id === member.id;
  const userAvatar = <UserAvatar avatarUrl={avatarUrl} color={color} />;
  const glitchApi = useGlitchApi();
  const application = useApplication();
  const { createNotification } = useNotifications();
  const projectPrivacy = useObservable(currentProject.privacy);
  const isMobile = useMediaQuery('(max-width: 592px)');
  const [isProUser, setIsProUser] = useState(null); // null === unfetched, otherwise boolean

  useEffect(() => {
    // We only need to fetch this info if the project is private or if it is unfetched
    if (!requiresProCheckForOwner(projectPrivacy) || isProUser !== null) {
      return undefined;
    }

    // We know anonymous users cannot be pro users
    if (!user?.login()) {
      setIsProUser(false);
      return undefined;
    }

    const controller = new AbortController();
    glitchApi.getUserGlitchPro(user.id(), { signal: controller.signal }).then(({ isActive }) => setIsProUser(isActive), () => {});

    return () => {
      controller.abort();
    };
  }, [glitchApi, user, projectPrivacy, isProUser]);

  const handleProjectMemberPermission = async (nextAccess, targetUser) => {
    if (nextAccess === 'remove' && pending) {
      pendingInviteDispatch({
        type: 'PENDING_CANCEL_INVITE',
        id: member.id,
      });

      glitchApi.cancelInvite(currentProject.id(), member.id).then(
        () => {
          createNotification((props) => <Notification message={`Cancelled invite to ${displayName}.`} {...props} />);
        },
        () => {
          pendingInviteDispatch({
            type: 'FAILURE_CANCEL_INVITE',
            invite: member,
          });
          createNotification((props) => (
            <Notification message={`Failed to remove the invite for ${displayName}. Try again later?`} variant="error" {...props} />
          ));
        },
      );

      return;
    }
    if (nextAccess === 'remove') {
      await application.leaveCurrentProject(targetUser);
    }

    if (nextAccess === 'resend') {
      if (email) {
        application.inviteEmailToProject(email);
      } else {
        application.inviteUserToProject(user.id());
      }
      createNotification((props) => <Notification message="Resent invite" {...props} />);
    }

    if (Number.parseInt(nextAccess, 10) === access.ADMIN) {
      setShowOwnerTransferOverlayForUser(targetUser);
    }
  };

  return (
    <>
      {editable && (
        <>
          {/* mobile layout */}
          {isMobile && (
            <StyledMember className="mobile">
              {userAvatar}
              <SelectWrapper>
                <EllipsisText>{displayName}</EllipsisText>
                <SelectContents
                  layout="mobile"
                  accessLevel={member.projectPermission.accessLevel}
                  handleProjectMemberPermission={handleProjectMemberPermission}
                  isProUser={isProUser}
                  pending={pending}
                  readOnly={readOnly}
                  user={user}
                  projectPrivacy={projectPrivacy}
                  setShowOwnerTransferOverlayForUser={setShowOwnerTransferOverlayForUser}
                />
              </SelectWrapper>
            </StyledMember>
          )}
          {/* desktop layout */}
          {!isMobile && (
            <>
              <div className="desktop">
                <StyledMember>
                  {userAvatar}
                  <StyledName>
                    <EllipsisText>{displayName}</EllipsisText>
                    {pending && <PendingText>&nbsp;- Pending&nbsp;</PendingText>}
                  </StyledName>
                </StyledMember>
              </div>
              <div className="desktop">
                <SelectWrapper>
                  <SelectContents
                    layout="desktop"
                    accessLevel={member.projectPermission.accessLevel}
                    handleProjectMemberPermission={handleProjectMemberPermission}
                    isProUser={isProUser}
                    pending={pending}
                    readOnly={readOnly}
                    user={user}
                    projectPrivacy={projectPrivacy}
                  />
                </SelectWrapper>
              </div>
            </>
          )}
        </>
      )}
      {!editable && (
        <StyledMember key={id}>
          {userAvatar}
          <AnnotatedNameWrapper>
            <EllipsisText>{displayName}</EllipsisText>
            {member.projectPermission.accessLevel === access.ADMIN && (
              <TextAnnotation>
                <span className="hyphen">&nbsp;-&nbsp;</span>
                <span>Owner</span>
              </TextAnnotation>
            )}
          </AnnotatedNameWrapper>
        </StyledMember>
      )}
    </>
  );
}
