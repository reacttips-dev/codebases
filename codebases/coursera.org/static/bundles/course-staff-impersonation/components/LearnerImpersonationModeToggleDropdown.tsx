/** @jsx jsx */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import { compose } from 'recompose';

import localStorage from 'js/lib/coursera.store';
import connectToRouter from 'js/lib/connectToRouter';

import { SelectOption, Typography, Grid, SilentSelectField } from '@coursera/cds-core';
import { LockOneIcon, ProfileIcon } from '@coursera/cds-icons';
import type { Theme } from '@coursera/cds-core';

import _t from 'i18n!nls/course-staff-impersonation';

import type { PartnerLearnerImpersonationSession } from 'bundles/course-staff-impersonation/utils/types';
import withDisableEditModeMutation from './withDisableEditModeMutation';
import withEnableEditModeMutation from './withEnableEditModeMutation';
import ActAsLearnerConfirmationModal from './ActAsLearnerConfirmationModal';

const VIEW_ONLY = 'view-only';
const EDIT_MODE = 'edit-mode';

type OuterProps = {
  actAsLearnerSession: PartnerLearnerImpersonationSession;
};

type Props = OuterProps & {
  courseSlug: string;
  disableEditMode: (config: {}) => Promise<void>;
  enableEditMode: (config: { variables: {} }) => Promise<void>;
};

const styles = {
  select: (theme: Theme) => css`
    width: 220px;
    height: 32px;
    padding: ${theme.spacing(0)};
    margin-left: ${theme.spacing(8)};
  `,
};

export const LearnerImpersonationModeToggleDropdown: React.FunctionComponent<Props> = ({
  courseSlug,
  enableEditMode,
  disableEditMode,
  actAsLearnerSession,
}) => {
  const [value, setValue] = useState<string | undefined>(actAsLearnerSession?.editMode ? EDIT_MODE : VIEW_ONLY);
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newValue = event.target.value;

    if (newValue === VIEW_ONLY) {
      disableEditMode({
        variables: {
          input: {},
        },
      })
        .then(() => {
          setValue(newValue as string);
        })
        .catch((err: Error) => {
          return err;
        });
    } else {
      const shouldHideConfirmation = localStorage.get('aal_hide_confirmation');
      if (!shouldHideConfirmation) {
        setShowModal(true);
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalConfirm = () => {
    enableEditMode({
      variables: {
        courseId: courseSlug,
        input: {},
      },
    })
      .then(() => {
        setShowModal(false);
        setValue(EDIT_MODE);
      })
      .catch((err: Error) => {
        return err;
      });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <span>
      <SilentSelectField
        label="Mode Select"
        open={open}
        value={value}
        onChange={handleChange}
        onClose={handleClose}
        onOpen={handleOpen}
        css={styles.select}
        labelPlacement="none"
      >
        <SelectOption value={VIEW_ONLY}>
          <Grid container={true} direction="row" alignItems="center" alignContent="center" css={{ height: '24px' }}>
            <LockOneIcon css={(theme: Theme) => ({ marginRight: theme.spacing(8) })} />
            <Typography variant="h4bold">{_t('View Only')}</Typography>
          </Grid>
        </SelectOption>

        <SelectOption value={EDIT_MODE}>
          <Grid container={true} direction="row" alignItems="center" alignContent="center" css={{ height: '24px' }}>
            <ProfileIcon css={(theme: Theme) => ({ marginRight: theme.spacing(8) })} />
            <Typography variant="h4bold">{_t('Take Action as Learner')}</Typography>
          </Grid>
        </SelectOption>
      </SilentSelectField>

      {showModal && <ActAsLearnerConfirmationModal onConfirm={handleModalConfirm} onClose={handleModalClose} />}
    </span>
  );
};

export default compose<Props, OuterProps>(
  withEnableEditModeMutation,
  withDisableEditModeMutation,
  connectToRouter(({ params }) => {
    return {
      courseSlug: params.courseSlug,
    };
  })
)(LearnerImpersonationModeToggleDropdown);
