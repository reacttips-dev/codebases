/** @jsx jsx */
import type { MemberProfile } from 'bundles/compound-assessments/lib/withTeamActivitySets';

import { EmailIcon } from '@coursera/cds-icons';
import { Link } from 'react-router';
import { useTheme, Grid, Typography, Button } from '@coursera/cds-core';
import { css, jsx, Global } from '@emotion/react';
import ProfileImageCA from 'bundles/compound-assessments/components/shared/ProfileImageCA';
import Modal from 'bundles/ui/components/Modal';
import SlackTeamMessageButton from 'bundles/slack-account-link/components/SlackTeamMessageButton';
import user from 'js/lib/user';

import _t from 'i18n!nls/course-teamwork';

type Props = {
  teamName: string;
  teamMembers: Array<MemberProfile | null>;
  slackTeamDomain?: string | null;
  slackGroupId?: string | null;
  onCloseModal: () => void;
  showMembersModal: boolean;
};

const TeamMembersModalV2 = ({
  teamName,
  teamMembers,
  onCloseModal,
  slackTeamDomain = '',
  slackGroupId = '',
  showMembersModal,
}: Props) => {
  const theme = useTheme();
  const emailsAvailable = teamMembers ? teamMembers.filter(Boolean).filter((member) => member?.email) : [];
  const otherMembersEmails = teamMembers
    .filter(Boolean)
    .filter((member) => member?.userId !== user.get().id)
    .map((member) => member?.email);

  const emailLink = 'mailto:' + otherMembersEmails.join(',');

  return (
    <Modal
      isOpen={showMembersModal}
      onRequestClose={onCloseModal}
      className="rc-TeamMembersModal"
      allowClose
      size="large"
      role="dialog"
      modalName={_t('Team Members Modal')}
      trackingName="teamMembersModal"
    >
      <Grid
        container
        css={css`
          padding: ${theme.spacing(24, 0)};
        `}
      >
        <Typography variant="h1semibold">{teamName}</Typography>

        <Grid
          container
          item
          css={css`
            margin: ${theme.spacing(32, 0)};
          `}
        >
          {slackTeamDomain && slackGroupId && (
            <Grid
              item
              css={css`
                margin: ${theme.spacing(0, 16, 0, 0)};
              `}
            >
              <SlackTeamMessageButton
                slackLink={`https://${slackTeamDomain}.slack.com/messages/${slackGroupId}`}
                slackTeamDomain={slackTeamDomain}
                email={user.get().email_address}
                className="link-button secondary team-member-modal-action-button slack-team-message-button"
                cdsEnabled={true}
              />
            </Grid>
          )}

          {emailsAvailable.length > 0 && (
            <Grid item>
              <Button
                size="small"
                variant="secondary"
                icon={<EmailIcon size="small" />}
                iconPosition="before"
                component={Link}
                href={emailLink}
              >
                {_t('Email')}
              </Button>
            </Grid>
          )}
        </Grid>

        <Grid container item md={12}>
          {teamMembers.map((profile, index) => {
            return profile ? (
              <Grid
                container
                item
                md={12}
                sm={12}
                xs={12}
                css={css`
                  padding: ${theme.spacing(16, 0)};
                  border: none;
                  border-bottom: ${index === teamMembers.length - 1 ? '0px' : '1px'} solid ${theme.palette.gray[300]};
                `}
              >
                <Global
                  styles={css`
                    .team-card-profile-wrapper .rc-ProfileImage .c-profile-initials {
                      background-color: ${theme.palette.blue[100]};
                      color: ${theme.palette.black[500]};
                    }
                  `}
                />
                <Grid container md={8} sm={8} xs={9} alignItems="center" className="team-card-profile-wrapper">
                  <Grid item>
                    <ProfileImageCA profile={profile} />
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body1"
                      css={{
                        margin: theme.spacing(0, 16),
                        [theme.breakpoints.down('xs')]: {
                          margin: theme.spacing(0, 8),
                        },
                      }}
                    >
                      {profile.fullName}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container md={4} sm={4} xs={3} justify="flex-end" alignItems="center">
                  {!!profile.slackProfile && !!slackTeamDomain && (
                    <Grid item justify="flex-end" alignItems="center">
                      <SlackTeamMessageButton
                        slackLink={`https://${slackTeamDomain}.slack.com/messages/${slackGroupId}`}
                        slackTeamDomain={slackTeamDomain}
                        email={user.get().email_address}
                        className="link-button secondary team-member-modal-action-button slack-team-message-button"
                      />
                    </Grid>
                  )}

                  <Grid
                    item
                    alignItems="center"
                    css={{
                      margin: theme.spacing(0, 0, 0, 32),
                      [theme.breakpoints.down('xs')]: {
                        margin: theme.spacing(0, 0, 0, 8),
                      },
                    }}
                  >
                    <Link href={`mailto:${profile.email}`}>
                      <EmailIcon />
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            ) : null;
          })}
        </Grid>
      </Grid>
    </Modal>
  );
};

export default TeamMembersModalV2;
