/* @jsx jsx */
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { Grid, Button, useTheme, Typography } from '@coursera/cds-core';
import _t from 'i18n!nls/video-highlighting';

import { NoteStates } from './NoteStates';

type Props = {
  setCurrentState: (newState: NoteStates) => void;
  text: string;
  onSave: (newText: string) => void;
};

const NoteEdit = ({ setCurrentState, text, onSave }: Props) => {
  const theme = useTheme();
  const [value, setValue] = useState(text);
  return (
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
      <textarea
        aria-label={_t('Your Notes')}
        autoFocus={true}
        css={{
          width: '100%',
          maxHeight: '175px',
          overflowY: 'scroll',
          margin: theme.spacing(0, 0, 0),
          padding: theme.spacing(16),
          border: `1px solid ${theme.palette.gray[500]}`,
          borderRadius: 2,
          ...theme.typography.body1,
        }}
        id="edit-note"
        defaultValue={value}
        onChange={(event) => setValue(event.target.value)}
        rows={3}
      />
      <Grid container justify="flex-start" css={{ margin: theme.spacing(16, 0, 0) }}>
        <Grid item>
          <Button
            onClick={() => {
              onSave(value);
              setCurrentState(NoteStates.VIEW);
            }}
            size="small"
            variant="primary"
          >
            {_t('Save')}
          </Button>
        </Grid>
        <Grid item>
          <Button
            css={css`
              margin: ${theme.spacing(0, 0, 0, 16)};
            `}
            onClick={() => setCurrentState(NoteStates.VIEW)}
            size="small"
            variant="secondary"
          >
            {_t('Cancel')}
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default NoteEdit;
