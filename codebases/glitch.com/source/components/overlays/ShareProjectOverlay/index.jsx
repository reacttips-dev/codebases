import React, { useState, useEffect, useReducer } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import randomColor from 'randomcolor';
import { Notification, Icon, Loader, useNotifications, Button } from '@glitchdotcom/shared-components';
import ShareProjectUpgradeIcon from '../../icons/ShareProjectUpgradeIcon';
import CopyLinkIcon from '../../icons/CopyLinkIcon';
import useApplication from '../../../hooks/useApplication';
import useGlitchApi from '../../../hooks/useGlitchApi';
import useObservable from '../../../hooks/useObservable';
import { useCurrentUser } from '../../../machines/User';
import copyToClipboard from '../../../utils/copyToClipboard';
import filteredUsersForDuplicates from '../../../utils/arrays';
import { access } from '../../../const';
import User from '../../../models/user';

import { Copied } from '../../../reactlets/NotificationTemplates';
import ProjectMemberSearchBox from './ProjectMemberSearchBox';
import Row from '../../primitives/Row';
import Stack from '../../primitives/Stack';
import Select from '../../Select';
import ProjectMemberView from './ProjectMemberView';

const Container = styled.div`
  background: var(--colors-background);
  color: var(--colors-primary);
  margin: 6pt auto;
  border: 1px solid var(--colors-border);
  box-sizing: border-box;
  box-shadow: -8px 12px 24px #adbcff;
  border-radius: 3px;
  font-family: 'Benton Sans', Helvetica, Sans-serif;
  padding: 34px 34px;
  transition: all 0.2s ease 0s;
  width: 330px;
  @media (min-width: 499px) {
    min-height: 570px;
    max-height: 800px;
    width: 600px;
  }
`;

const TransferProjectContainer = styled.div`
  margin: 6em auto;
  max-width: 375px;
`;

const TransferProjectHeading = styled.div`
  font-size: 16px;
  font-weight: bold;
  line-height: 130%;
  margin-bottom: 12px;
`;

const TransferProjectButtonContainer = styled.div`
  float: right;
  margin-top: 20px;
`;

const TransferProjectButton = styled(Button)`
  margin-left: 10px;
`;

const H6 = styled.h6`
  margin: 0px;
  margin-bottom: 4px;
  padding: 0px;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 130%;
`;

const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px 16px;
  align-items: center;

  @media (min-width: 499px) {
    grid-template-columns: 1fr max-content;
  }
`;

const ProjectMemberHeader = styled.h6`
  margin: 0px;
  margin-bottom: 12px;
  padding: 0px;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 130%;
`;

const ProjectMemberSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px 16px;
  max-height: 195px;
  overflow: auto;
  .mobile {
    display: flex;
  }
  .desktop {
    display: none;
  }
  @media (min-width: 499px) {
    ${(props) => (props.editable ? 'grid-template-columns: 1fr max-content;' : 'grid-template-columns: 1fr 1fr;')}

    .mobile {
      display: none;
    }
    .desktop {
      display: flex;
    }
  }
`;

const LoaderNoOverflow = styled(Loader)`
  overflow: hidden;
`;

const OverlayWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: var(--space-2) var(--space-1);
  margin: 0;
  z-index: var(--z-overlay);
  background-color: ${(props) => (props.currentTheme === 'sugar' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(34, 34, 34, 0.8)')};
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (min-width: 499px) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4) var(--space-1);
  }
`;

const LinkContainer = styled.div`
  border: 1px solid var(--colors-notice-background);
  box-sizing: border-box;
  border-radius: 3px;
  display: flex;
  height: 32px;
  align-items: center;
  padding: 4px;
  margin: 12px 0px;
  justify-content: space-between;
`;

const NotificationLink = styled.a`
  color: var(--colors-notice-text);
`;

const LinkType = styled.div`
  font-size: 10px;
  color: ${(props) => (props.currentTheme === 'sugar' ? '#694dff' : '#FFF')};
  min-width: 48px;
  border-right: 1px solid var(--colors-notice-background);
  padding-left: 2px;
  /* or 19px */
  flex: 0;
`;

const LinkUrl = styled.div`
  font-family: Menlo;
  font-size: 13px;
  padding-left: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const CopyLinkButton = styled.button`
  padding: 0px 8px;
  flex: 0;
  color: var(--colors-primary);
  background-color: transparent;
  border: none;
  &:hover,
  &:active {
    color: #2800ff;
  }
`;

const UpgradeText = styled.p`
  font-size: 12px;
`;

const UpgradeTextLink = styled.a`
  margin-left: 5px;
  &:hover,
  &.active {
    text-decoration: none;
  }
`;

const Option = styled.option``;

const UpsellWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const UpsellText = styled.div`
  color: var(--colors-primary);
  position: absolute;
  margin-left: 40px;
  width: 160px;
  font-size: 12px;
  line-height: 16.8px;
`;

const UpsellTextLink = styled.span`
  font-weight: 600;
`;

const ParagraphText = styled.p`
  font-size: 14px;
  margin: 0px;
  line-height: 1.5;
`;

const FixedBodyStyle = createGlobalStyle`
  body {
    position: fixed;
    width: 100%;
    top: -${({ scrollY }) => scrollY}px;
  }
`;

const FixedBody = () => {
  const [scrollY, setScrollY] = React.useState(null);
  React.useEffect(() => {
    const prevScrollPosition = window.scrollY;
    setScrollY(prevScrollPosition);
    return () => {
      window.setTimeout(() => window.scrollTo(0, prevScrollPosition), 0);
    };
  }, []);
  return scrollY === null ? null : <FixedBodyStyle scrollY={scrollY} />;
};

// eslint-disable-next-line no-unused-vars
export const Overlay = ({ open, onClickBackground, currentTheme, children, variant, contentProps, ...props }) => {
  return (
    <OverlayWrap
      data-module="Overlay"
      aria-modal="true"
      tabIndex="-1"
      currentTheme={currentTheme}
      onClick={(e) => {
        e.stopPropagation();
        if (e.currentTarget === e.target) {
          onClickBackground();
        }
      }}
      {...props}
    >
      <FixedBody />
      <Container>{children()}</Container>
    </OverlayWrap>
  );
};

// Modal copy for project owner/admin
const privacyOptionsOwner = {
  public: {
    header: 'This project is public',
    permission: 'Everyone can see your project.',
    link: 'Anyone with these links can view your project.',
  },
  private_project: {
    header: 'This project is private',
    permission: 'Only you and people you invite can access your code and live site.',
    link: 'Only invited project members can access these links.',
  },
  private_code: {
    header: "This project's code is private",
    permission: 'Only you and people you invite can access the project code. Your live site is visible to everyone.',
    link: 'Only invited project members can access the code. Everyone can visit the site!',
  },
};

// Modal copy for project members and visitors
const privacyOptionsNonOwner = {
  public: {
    header: 'This project is public',
    permission: 'Everyone can see this project.',
    link: 'Anyone with these links can view the project.',
  },
  private_project: {
    header: 'This project is private',
    permission: 'Only people invited to this project can access the code and live site.',
    link: 'Only project members can access these links.',
  },
  private_code: {
    header: "This project's code is private",
    permission: 'Only people invited to this project can access the project code. The live site is visible to everyone.',
    link: 'Only project members can access the code. Everyone can visit the site!',
  },
};

const memberFromProjectUser = (user) => ({
  id: user.id,
  avatarUrl: user.avatarUrl,
  login: user.login,
  name: user.name,
  color: user.color,
  user: User(user),
  projectPermission: user.projectPermission,
});

function memberFromPendingInvite(pendingInvite) {
  return {
    id: pendingInvite.id,
    avatarUrl: pendingInvite.user?.avatarUrl,
    login: pendingInvite.user?.login,
    name: pendingInvite.user?.name,
    email: pendingInvite.email,
    color: pendingInvite.user?.color || randomColor({ luminosity: 'light', seed: name }),
    state: 'idle',
    user: User(pendingInvite.user),
    projectPermission: pendingInvite.projectPermission,
  };
}

function pendingInvitesReducer(state, action) {
  // never do anything if current user is not an admin
  if (state.state === 'not-admin') {
    return state;
  }

  // only handle loaded events when in loading state
  if (state.state === 'loading') {
    switch (action.type) {
      case 'LOADED_PENDING_INVITES':
        return { state: 'loaded', invites: action.invites };
      default:
        return state;
    }
  }

  // pending invites are loaded, we can manage them now
  switch (action.type) {
    // add invite to list
    case 'PENDING_SEND_INVITE':
    case 'FAILURE_CANCEL_INVITE':
      return { ...state, invites: [...state.invites, action.invite] };

    // update invite with information from API
    case 'SUCCESS_SEND_INVITE':
      return {
        ...state,
        invites: state.invites.map((pendingInvite) => (pendingInvite.id === action.id ? memberFromPendingInvite(action.invite) : pendingInvite)),
      };

    // remove invite from list
    case 'FAILURE_SEND_INVITE':
    case 'PENDING_CANCEL_INVITE':
      return {
        ...state,
        invites: state.invites.filter((pendingInvite) => pendingInvite.id !== action.id),
      };

    case 'RELOAD_PENDING_INVITES':
      return {
        ...state,
        state: 'loading',
      };
    default:
      return state;
  }
}

export default function ShareProjectOverlay({ currentProject }) {
  const application = useApplication();
  const currentTheme = useObservable(application.currentTheme);
  const glitchApi = useGlitchApi();
  const { createNotification, removeNotification } = useNotifications();
  const appUrl = useObservable(application.publishedUrl);
  const editorUrl = useObservable(application.editorUrl);
  const privacy = useObservable(currentProject.privacy);
  const currentUserIsOwner = useObservable(application.projectIsAdminForCurrentUser);
  const currentUser = useCurrentUser();
  const isProUser = currentUser?.isProUser;
  const isFreeUser = !currentUser?.isProUser;
  const visible = useObservable(application.shareProjectOverlayVisible);
  const [showOwnerTransferOverlayForUser, setShowOwnerTransferOverlayForUser] = useState(null);

  const [{ state: pendingInviteState, invites: pendingInvites }, pendingInviteDispatch] = useReducer(pendingInvitesReducer, {
    state: currentUserIsOwner ? 'loading' : 'not-admin',
    items: null,
  });

  useEffect(() => {
    if (pendingInviteState === 'loading') {
      const abortController = new AbortController();
      glitchApi.getPendingInvites(currentProject.id(), { signal: abortController.signal }).then(
        (response) => {
          pendingInviteDispatch({
            type: 'LOADED_PENDING_INVITES',
            invites: response.invites.map((pendingInvite) => memberFromPendingInvite(pendingInvite)),
          });
        },
        (e) => {
          // If the request was aborted, ignore. Otherwise throw for Sentry to log.
          if (e.name === 'AbortError') {
            return;
          }
          throw e;
        },
      );
      return () => {
        abortController.abort();
      };
    }
    return undefined;
  }, [glitchApi, currentProject, pendingInviteState]);

  useEffect(() => {
    pendingInviteDispatch({
      type: 'RELOAD_PENDING_INVITES',
    });
  }, [visible]);

  const [notificationId, setNotificationId] = useState(null);

  function createLegacyPrivateCodeNotification() {
    const message =
      'Private projects are now only available to paid Glitch members. If you make this project public, you will need to upgrade your account to make it private again. ';
    const { id } = createNotification(() => (
      <Notification message={message} onClose={() => removeNotification(id)} persistent>
        {message} <NotificationLink href="https://glitch.happyfox.com/kb/article/57">Learn more</NotificationLink>
      </Notification>
    ));
    removeNotification(notificationId);
    setNotificationId(id);
  }

  const TransferProjectMessage = () => {
    return (
      <div>
        <TransferProjectContainer>
          <TransferProjectHeading>
            Are you sure you want to transfer ownership of this project
            {showOwnerTransferOverlayForUser.login() && ` to ${showOwnerTransferOverlayForUser.login()}`}?
          </TransferProjectHeading>
          <ParagraphText>
            Each project has one owner. If you transfer ownership, you will lose the ability to manage project permissions and settings.
          </ParagraphText>
          <TransferProjectButtonContainer>
            <TransferProjectButton
              onClick={() => {
                application.transferProjectOwner(showOwnerTransferOverlayForUser);
                setShowOwnerTransferOverlayForUser(null);
              }}
            >
              Yes, Transfer
            </TransferProjectButton>
            <TransferProjectButton onClick={() => setShowOwnerTransferOverlayForUser(null)}>Cancel</TransferProjectButton>
          </TransferProjectButtonContainer>
        </TransferProjectContainer>
      </div>
    );
  };

  const allProjectUsers = useObservable(application.currentProject().users);

  const allProjectMembers = filteredUsersForDuplicates(allProjectUsers.map(memberFromProjectUser));
  // there should only be one owner, but there can be multiple, so we make it an array
  const projectOwners = allProjectMembers.filter((member) => member.projectPermission.accessLevel === access.ADMIN);
  const projectNonOwners = allProjectMembers.filter((member) => member.projectPermission.accessLevel !== access.ADMIN);

  const projectOwnerDescription = privacyOptionsOwner[privacy];
  const projectNonOwnerDescription = privacyOptionsNonOwner[privacy];

  return (
    <>
      <Stack spacing={3}>
        {showOwnerTransferOverlayForUser ? (
          <TransferProjectMessage />
        ) : (
          <>
            {currentUserIsOwner && (
              <>
                <HeaderGrid>
                  <div>
                    <H6>Project permissions</H6>
                    <ParagraphText>{projectOwnerDescription.permission}</ParagraphText>
                    <div>
                      {privacy === 'private_code' && isFreeUser && (
                        <UpgradeText>
                          <Icon icon="boosted" />
                          <UpgradeTextLink href="https://glitch.com/pricing">Upgrade</UpgradeTextLink> to make your entire project private.
                        </UpgradeText>
                      )}
                    </div>
                  </div>
                  <div>
                    {/* Only show the privacy drop down if you have a paid account or legacy private_code project */}
                    {(isProUser || privacy === 'private_code') && (
                      <Select
                        name="project-member-permission-select"
                        id="project-member-permission-select"
                        value={privacy}
                        onFocus={() => {
                          if (isFreeUser) {
                            createLegacyPrivateCodeNotification();
                          }
                        }}
                        onChange={async (value) => {
                          await application.changeProjectPrivacy(value);
                        }}
                      >
                        <Option value="public">Public</Option>
                        {isProUser && <Option value="private_project">Private</Option>}
                        <Option value="private_code">Private code</Option>
                      </Select>
                    )}
                    {/* Display upsell graphic for anonymous and free users */}
                    {!isProUser && privacy === 'public' && (
                      <UpsellWrapper>
                        <UpsellText>
                          <UpsellTextLink>
                            <a href="/pricing">Upgrade</a>
                          </UpsellTextLink>{' '}
                          to make your project private.
                        </UpsellText>
                        <ShareProjectUpgradeIcon currentTheme={currentTheme} />
                      </UpsellWrapper>
                    )}
                  </div>
                </HeaderGrid>
                <ProjectMemberSearchBox
                  currentProjectPrivacy={privacy}
                  pendingInviteState={pendingInviteState}
                  pendingInvites={pendingInvites}
                  pendingInviteDispatch={pendingInviteDispatch}
                />
              </>
            )}
            {!currentUserIsOwner && (
              <div>
                <Row>
                  <div>
                    <ProjectMemberHeader>{projectNonOwnerDescription.header}</ProjectMemberHeader>
                    <ParagraphText>{projectNonOwnerDescription.permission}</ParagraphText>
                  </div>
                </Row>
              </div>
            )}
            <div>
              <Row>
                <div>
                  <ProjectMemberHeader>Project members</ProjectMemberHeader>
                </div>
              </Row>
              <ProjectMemberSection editable={currentUserIsOwner}>
                {projectOwners.map((owner) => (
                  <ProjectMemberView
                    key={owner.id}
                    currentProject={currentProject}
                    currentUser={currentUser}
                    editable={currentUserIsOwner}
                    member={owner}
                  />
                ))}
                {projectNonOwners.map((member) => (
                  <ProjectMemberView
                    key={member.id}
                    editable={currentUserIsOwner}
                    currentProject={currentProject}
                    member={member}
                    currentUser={currentUser}
                    setShowOwnerTransferOverlayForUser={setShowOwnerTransferOverlayForUser}
                  />
                ))}{' '}
                {/* pending invites */}
                {pendingInviteState === 'loading' && <LoaderNoOverflow />}
                {pendingInviteState === 'loaded' &&
                  pendingInvites.map((pendingInvite) => (
                    <ProjectMemberView
                      key={pendingInvite.id}
                      currentProject={currentProject}
                      currentUser={currentUser}
                      editable={currentUserIsOwner}
                      member={pendingInvite}
                      pending
                      pendingInviteDispatch={pendingInviteDispatch}
                    />
                  ))}
              </ProjectMemberSection>
            </div>
            <div>
              {currentUserIsOwner && (
                <ParagraphText>
                  <strong>Project links:</strong> {projectOwnerDescription.link}
                </ParagraphText>
              )}
              {!currentUserIsOwner && (
                <ParagraphText>
                  <strong>Project links:</strong> {projectNonOwnerDescription.link}
                </ParagraphText>
              )}
              <LinkContainer>
                <LinkType currentTheme={currentTheme}>Live site</LinkType>
                <LinkUrl>{appUrl}</LinkUrl>
                <CopyLinkButton
                  alt="Copy live site URL to clipboard"
                  onClick={() => {
                    application.analytics.track('Glitch Link Copied', { linkType: 'live app' });
                    copyToClipboard(appUrl);
                    createNotification(Copied);
                  }}
                >
                  <CopyLinkIcon />
                </CopyLinkButton>
              </LinkContainer>
              <LinkContainer>
                <LinkType currentTheme={currentTheme}>Code</LinkType>
                <LinkUrl>{editorUrl}</LinkUrl>
                <CopyLinkButton
                  alt="Copy code URL to clipboard"
                  onClick={() => {
                    application.analytics.track('Glitch Link Copied', { linkType: 'code' });
                    copyToClipboard(editorUrl);
                    createNotification(Copied);
                  }}
                >
                  <CopyLinkIcon />
                </CopyLinkButton>
              </LinkContainer>
            </div>
          </>
        )}
      </Stack>
    </>
  );
}
