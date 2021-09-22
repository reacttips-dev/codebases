/* @jsx jsx */
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { Grid, Typography, useTheme } from '@coursera/cds-core';
import { Highlight } from 'bundles/video-highlighting/types';
import { Course } from 'bundles/video-highlighting/review-page/types';

import Divider from '../Divider';

import NoteEdit from './NoteEdit';
import NoteView from './NoteView';
import NoteDelete from './NoteDelete';
import NoteInformation from './NoteInformation';

import { NoteStates } from './NoteStates';

type Props = {
  note: Highlight;
  course: Course;
  onSave: (id: string, text: string) => void;
  onDelete: (id: string) => void;
};

const Note = ({ note, course, onSave, onDelete }: Props) => {
  const [currentState, setCurrentState] = useState(NoteStates.VIEW);

  const theme = useTheme();

  return (
    <li
      css={css`
        width: 100%;
        list-style: none;
      `}
    >
      <Divider />
      <Grid container data-e2e="note-card">
        <Grid item xs={12} sm={5} md={5} lg={4} xl={3} css={{ padding: theme.spacing(0, 32, 0, 0) }}>
          <NoteInformation note={note} course={course} />
        </Grid>

        <Grid item xs={12} sm={7} md={7} lg={8} xl={9}>
          <Grid container direction="column" css={{ height: '100%' }}>
            <Grid item>
              <Typography variant="body1" data-e2e="video-section-text">
                {note.transcriptText}
              </Typography>
            </Grid>

            {currentState === NoteStates.VIEW && <NoteView setCurrentState={setCurrentState} text={note.noteText} />}

            {currentState === NoteStates.EDIT && (
              <NoteEdit setCurrentState={setCurrentState} text={note.noteText} onSave={(t) => onSave(note.id, t)} />
            )}

            {currentState === NoteStates.DELETE && (
              <NoteDelete setCurrentState={setCurrentState} onDelete={() => onDelete(note.id)} text={note.noteText} />
            )}
          </Grid>
        </Grid>
      </Grid>
    </li>
  );
};

export default Note;
