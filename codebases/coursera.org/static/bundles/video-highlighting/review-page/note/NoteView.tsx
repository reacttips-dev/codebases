/* @jsx jsx */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { EditIcon, TrashIcon } from '@coursera/cds-icons';
import { Grid, Button, Typography, useTheme } from '@coursera/cds-core';

import _t from 'i18n!nls/video-highlighting';

import { NoteStates } from './NoteStates';

type Props = {
  setCurrentState: (newState: NoteStates) => void;
  text: string;
};

const NoteView = ({ text, setCurrentState }: Props) => {
  const theme = useTheme();
  return (
    <React.Fragment>
      {text && (
        <React.Fragment>
          <Typography
            component="p"
            css={css`
              margin: ${theme.spacing(16, 0, 8)};
            `}
            variant="h3semibold"
            data-e2e="video-note-label"
          >
            {_t('Your Notes')}
          </Typography>
          <Typography variant="body1" data-e2e="video-note-text">
            {text}
          </Typography>
        </React.Fragment>
      )}

      <Grid
        container
        alignItems="flex-end"
        css={{
          flexGrow: 1,
        }}
      >
        <Grid container justify="flex-start" css={{ margin: theme.spacing(16, 0, 0) }}>
          <Grid
            item
            css={css`
              /* Required to align the text in the button correctly with the rest of the notes */
              margin-left: -8px;
            `}
          >
            <Button
              icon={<EditIcon size="small" />}
              iconPosition="before"
              onClick={() => setCurrentState(NoteStates.EDIT)}
              size="small"
              variant="ghost"
            >
              {_t('Edit')}
            </Button>
          </Grid>
          <Grid
            css={css`
              margin: ${theme.spacing(0, 0, 0, 16)};
            `}
            item
          >
            <Button
              icon={<TrashIcon size="small" />}
              iconPosition="before"
              onClick={() => setCurrentState(NoteStates.DELETE)}
              size="small"
              variant="ghost"
            >
              {_t('Delete')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default NoteView;
