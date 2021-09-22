/** @jsx jsx */
import { Link } from 'react-router';
import { EmailIcon } from '@coursera/cds-icons';
import { useTheme, Grid, Typography } from '@coursera/cds-core';
import { css, jsx, Global } from '@emotion/react';
import Modal from 'bundles/ui/components/Modal';
import type { MemberProfile } from 'bundles/compound-assessments/lib/withTeamActivitySets';
import ProfileImageCA from 'bundles/compound-assessments/components/shared/ProfileImageCA';

import _t from 'i18n!nls/course-teamwork';

type Props = {
  teamName: string;
  teamMembers: Array<MemberProfile | null>;
  onCloseModal: () => void;
  showMembersModal: boolean;
};

const TeamMembersModal = ({ teamName, teamMembers = [], onCloseModal, showMembersModal }: Props) => {
  const theme = useTheme();

  return (
    <Modal
      isOpen={showMembersModal}
      onRequestClose={onCloseModal}
      className="rc-TeamMembersModal"
      allowClose
      size="default"
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

        <Grid container md={12}>
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
                  <Grid>
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
                    <Link href={`mailto:${profile.email}`} data-test="email-link">
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

export default TeamMembersModal;
