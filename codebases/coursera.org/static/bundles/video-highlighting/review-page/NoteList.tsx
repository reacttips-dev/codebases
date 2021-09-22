/* @jsx jsx */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { getDraftFromHighlight } from 'bundles/video-highlighting/utils/highlightUtils';
import { compareHighlightsByStartTimestamp } from 'bundles/video-highlighting/utils/highlightAPIUtils';

import { Grid, Button, useTheme } from '@coursera/cds-core';

import _t from 'i18n!nls/video-highlighting';

import ContentNotesDataProvider from 'bundles/video-highlighting/review-page/data/ContentNotesDataProvider';
import { Course, Module } from 'bundles/video-highlighting/review-page/types';
import NotesReviewPageDataState from 'bundles/video-highlighting/review-page/private/NotesReviewPageDataState';
import Note from './note/Note';
import Divider from './Divider';
import { Highlight } from 'bundles/video-highlighting/types';

const NOTE_PAGE_SIZE = 20;

type Props = {
  course: Course;
  module: Module | null;
};

const partialSortByTimestamp = (arr: Highlight[], start: number, end: number) => {
  let preSorted = arr.slice(0, start),
    postSorted = arr.slice(end);
  let sorted = arr.slice(start, end).sort(compareHighlightsByStartTimestamp);
  arr.length = 0;
  arr.push.apply(arr, preSorted.concat(sorted).concat(postSorted));
  return arr;
};

const sortByTimestampWithinModule = (notes: Highlight[]) => {
  let startIndex = 0;
  let endIndex = startIndex + 1;
  while (endIndex < notes.length) {
    while (endIndex < notes.length && notes[endIndex].itemName === notes[endIndex - 1].itemName) {
      endIndex++;
    }
    notes = partialSortByTimestamp(notes, startIndex, endIndex);
    startIndex = endIndex;
    endIndex = startIndex + 1;
  }
  return notes;
};

const NoteList = (props: Props) => {
  const theme = useTheme();

  return (
    <ContentNotesDataProvider
      pageSize={NOTE_PAGE_SIZE}
      contentType={props.module ? 'module' : 'course'}
      course={props.course}
      module={props.module}
    >
      {({ notes, onLastPage, fetchNextPage, error, loadingInitialPage, loadingNextPage, updateNote, deleteNote }) => {
        if (error) {
          return <NotesReviewPageDataState dataState="error" />;
        }
        if (loadingInitialPage) {
          return <NotesReviewPageDataState dataState="loading" />;
        }
        if (!notes || notes.length === 0) {
          return <NotesReviewPageDataState dataState="empty" />;
        }

        const sortedNotes = sortByTimestampWithinModule(notes);

        return (
          <React.Fragment>
            <ul
              css={css`
                margin: 0;
                padding: 0;
              `}
            >
              {sortedNotes.map((note) => (
                <Note
                  course={props.course}
                  key={note.id}
                  note={note}
                  onSave={(id, text) => {
                    updateNote(
                      id,
                      getDraftFromHighlight({
                        itemId: note.itemId,
                        courseId: props.course.id,
                        highlight: {
                          ...note,
                          noteText: text ?? note.noteText ?? '',
                        },
                        languageCode: note.languageCode,
                      })
                    );
                  }}
                  onDelete={(id) => deleteNote(id)}
                />
              ))}
            </ul>
            <Divider />

            {!onLastPage && (
              <Grid container justify="center">
                <Button variant="secondary" disabled={loadingNextPage} onClick={fetchNextPage}>
                  {loadingNextPage ? _t('Loading Notes...') : _t('See More Notes')}
                </Button>
              </Grid>
            )}
          </React.Fragment>
        );
      }}
    </ContentNotesDataProvider>
  );
};

export { partialSortByTimestamp, sortByTimestampWithinModule, NoteList };
