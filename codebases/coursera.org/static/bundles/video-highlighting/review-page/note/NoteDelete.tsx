/* @jsx jsx */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { Grid, Button, useTheme, Typography } from '@coursera/cds-core';
import _t from 'i18n!nls/video-highlighting';
import { NoteStates } from './NoteStates';

type Props = {
  setCurrentState: (newState: NoteStates) => void;
  onDelete: () => void;
  text: string;
};

const NoteDelete = ({ setCurrentState, onDelete, text }: Props) => {
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
          >
            {_t('Your Notes')}
          </Typography>
          <Typography variant="body1">{text}</Typography>
        </React.Fragment>
      )}

      <Grid
        container
        alignItems="flex-end"
        css={{
          flexGrow: 1,
        }}
      >
        <Grid item container justify="flex-start" alignItems="center">
          <Grid
            item
            css={{
              margin: theme.spacing(16, 32, 0, 0),
            }}
          >
            <Typography variant="body1">{_t('Are you sure you want to delete the entire note?')}</Typography>
          </Grid>
          <Grid
            item
            container
            css={css`
              flex-basis: 0;
              flex-wrap: nowrap;
              margin: ${theme.spacing(16, 0, 0)};
            `}
          >
            <Grid
              item
              css={css`
                margin: ${theme.spacing(0, 16, 0, 0)};
              `}
            >
              <Button
                onClick={() => {
                  onDelete();
                  setCurrentState(NoteStates.VIEW);
                }}
                size="small"
                variant="primary"
              >
                {_t('Delete')}
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => setCurrentState(NoteStates.VIEW)} size="small" variant="secondary">
                {_t('Cancel')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default NoteDelete;
