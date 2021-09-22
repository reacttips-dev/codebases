import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

import { reshapeHighlightForClient } from 'bundles/video-highlighting/utils/highlightAPIUtils';

import type { Highlight, HighlightDraft } from 'bundles/video-highlighting/types';
import type { Course, NotesDataRenderProps } from 'bundles/video-highlighting/review-page/types';

import type {
  UserNotesV1CourseModuleWithContentSortQuery,
  UserNotesV1DeleteQuery,
  UserNotesV1UpdateMutation,
} from 'bundles/video-highlighting/review-page/data/__generated__/UserNotesV1';

/*
 * Takes a non-recursive object and deep clones it.
 * This method can be very slow for large objects - it's used
 * here as a private utility to help with updating small
 * but deep objects in the Apollo cache.
 */
const cloneData = <T extends object>(data: T): T => JSON.parse(JSON.stringify(data));

/*
 * This component passes notes data for a course and pagination
 * helpers to a render prop child.
 *
 * Usage:
 * <CourseNotesQueryProvider course={course} pageSize={10}>
 *   {({ notes, onLastPage, fetchNextPage, error, loadingInitialPage, loadingNextPage }) =>
 *     <Component notes={notes} onLastPage={onLastPage} .../>
 *   }
 * </CourseNotesQueryProvider>
 */

const NOTES_BY_COURSE = gql`
  query NotesDataQuery($courseId: String!, $start: Int, $limit: Int) {
    UserNotesV1 @naptime {
      courseWithContentSort(courseId: $courseId, start: $start, limit: $limit) {
        elements {
          id
          userText
          createdAt
          updatedAt
          details
        }
        paging
      }
    }
  }
`;

type NotesQueryRenderProps = {
  notes: Array<Highlight> | null;
  onLastPage: boolean;
  fetchNextPage: () => void;
  error: boolean;
  loadingInitialPage: boolean;
  loadingNextPage: boolean;
};

type NotesQueryProviderProps = {
  course: Course;
  pageSize: number;
  children: (renderProps: NotesQueryRenderProps) => React.ReactNode;
};

const CourseNotesQueryProvider = ({ course, pageSize, children }: NotesQueryProviderProps) => (
  <Query<UserNotesV1CourseModuleWithContentSortQuery, { start: number; limit: number; courseId: string }>
    query={NOTES_BY_COURSE}
    variables={{ courseId: course.id, start: 0, limit: pageSize }}
    notifyOnNetworkStatusChange={true}
  >
    {({ loading, error, data, fetchMore }) => {
      if (error) {
        return children({
          notes: null,
          onLastPage: false,
          error: true,
          fetchNextPage: () => {},
          loadingInitialPage: false,
          loadingNextPage: false,
        });
      }

      // @ts-expect-error TSMIGRATION-3.9
      const { courseWithContentSort } = (data || {}).UserNotesV1 || {};

      if (loading && !(courseWithContentSort || {}).elements) {
        return children({
          notes: null,
          onLastPage: false,
          error: false,
          fetchNextPage: () => {},
          loadingInitialPage: true,
          loadingNextPage: false,
        });
      }

      const notes = ((courseWithContentSort || {}).elements || []).map(reshapeHighlightForClient);
      const pagingInfo = (courseWithContentSort || {}).paging;

      const onLastPage = !pagingInfo || !pagingInfo.next || (pagingInfo.total && pagingInfo.next >= pagingInfo.total);

      const fetchNextPage = () => {
        fetchMore({
          variables: { start: notes.length, limit: pageSize },
          updateQuery: (prevData, { fetchMoreResult }) => {
            const prevDataClone = cloneData(prevData);

            // no new data received, just give back previous
            if (!fetchMoreResult) return prevDataClone;

            // update fields for new data in clone
            const newMergedData = prevDataClone;

            // @ts-expect-error TSMIGRATION-3.9
            newMergedData.UserNotesV1.courseWithContentSort.elements = [
              // @ts-expect-error TSMIGRATION-3.9
              ...prevData.UserNotesV1.courseWithContentSort.elements,
              // @ts-expect-error TSMIGRATION-3.9
              ...fetchMoreResult.UserNotesV1.courseWithContentSort.elements,
            ];

            // @ts-expect-error TSMIGRATION-3.9
            const newPaging = fetchMoreResult.UserNotesV1.courseWithContentSort.paging;
            // @ts-expect-error TSMIGRATION-3.9
            newMergedData.UserNotesV1.courseWithContentSort.paging = newPaging;
            return newMergedData;
          },
        });
      };

      return children({
        notes,
        fetchNextPage,
        onLastPage,
        error: false,
        loadingInitialPage: false,
        loadingNextPage: loading,
      });
    }}
  </Query>
);

/*
 * This component passes a `deleteNote` function via a render prop
 * child. The `deleteNote` function submits an actual deletion to the
 * server. Because deletions do not update the Apollo cache automatically,
 * this function also invalidates the query for the notes page (NOTES_BY_COURSE)
 * manually.
 *
 * NOTE: This will not update other Naptime link queries for notes!
 * It really is expected to only work on the notes page.
 *
 * Usage:
 * <CourseNotesDeletionProvider course={course} pageSize={20}>
 *   {({ deleteNote }) =>
 *     <Component deleteNote={deleteNote} />
 *   }
 * </CourseNotesDeletionProvider>
 */

const DELETE_NOTE = gql`
  mutation DeleteNoteMutation($noteId: String!) {
    UserNotesV1 @naptime {
      delete(id: $noteId) {
        id
      }
    }
  }
`;

type NotesDeletionRenderProps = {
  deleteNote: (id: string) => void;
};

type NotesDeletionProviderProps = {
  course: Course;
  pageSize: number;
  children: (renderProps: NotesDeletionRenderProps) => React.ReactNode;
};

const CourseNotesDeletionProvider = ({ course, pageSize, children }: NotesDeletionProviderProps) => (
  <Mutation<UserNotesV1DeleteQuery, { noteId: string }> mutation={DELETE_NOTE}>
    {(deleteNoteMutation) => {
      const deleteNote = (noteId: string) => {
        deleteNoteMutation({
          variables: { noteId },
          update: (cache) => {
            // NOTE: We must use the original query variables to manually update the cache.
            // This is because when using a paginated query as with notes, the cache actually keys
            // the query by the original query variables.
            const cachedNotesData: any = cache.readQuery({
              query: NOTES_BY_COURSE,
              variables: { courseId: course.id, start: 0, limit: pageSize },
            });

            const prevDataClone = cloneData(cachedNotesData);
            const { courseWithContentSort } = (cachedNotesData || {}).UserNotesV1 || {};

            const prevNoteElements = (courseWithContentSort || {}).elements || [];
            const newNoteElements = prevNoteElements.filter((note: $TSFixMe) => note.id !== noteId);

            // adjust notes field in cloned data to get new data
            const newUpdatedData = prevDataClone;
            newUpdatedData.UserNotesV1.courseWithContentSort.elements = newNoteElements;

            cache.writeQuery({
              query: NOTES_BY_COURSE,
              variables: { courseId: course.id, start: 0, limit: pageSize },
              data: newUpdatedData,
            });
          },
        });
      };
      return children({ deleteNote });
    }}
  </Mutation>
);

/*
 * This component passes an `updateNote` function via a render prop
 * child. The `updateNote` function submits an actual update to the
 * server - it takes a note ID and note draft to update to.
 *
 * Usage:
 * <CourseNotesUpdateProvider>
 *   {({ updateNote }) =>
 *     <Component updateNote={updateNote} />
 *   }
 * </CourseNotesUpdateProvider>
 */

const UPDATE_NOTE = gql`
  mutation UpdateNoteMutation($noteId: String!, $noteDraft: DataMap!) {
    UserNotesV1 @naptime {
      update(id: $noteId, input: $noteDraft) {
        elements {
          id
          userText
          createdAt
          updatedAt
          details
        }
      }
    }
  }
`;

type NotesUpdateRenderProps = {
  updateNote: (id: string, draft: HighlightDraft) => void;
};

type NotesUpdateProviderProps = {
  children: (renderProps: NotesUpdateRenderProps) => React.ReactNode;
};

const CourseNotesUpdateProvider = ({ children }: NotesUpdateProviderProps) => (
  <Mutation<UserNotesV1UpdateMutation, { noteId: string; noteDraft: any }> mutation={UPDATE_NOTE}>
    {(updateNoteMutation) => {
      const updateNote = (noteId: $TSFixMe, noteDraft: $TSFixMe) => {
        updateNoteMutation({
          variables: {
            noteId,
            noteDraft,
          },
        });
      };
      return children({ updateNote });
    }}
  </Mutation>
);

type CourseNotesProviderProps = {
  course: Course;
  pageSize: number;
  children: (renderProps: NotesDataRenderProps) => React.ReactNode;
};

const CourseNotesDataProvider = ({ course, pageSize, children }: CourseNotesProviderProps) => (
  <CourseNotesQueryProvider course={course} pageSize={pageSize}>
    {({ notes, fetchNextPage, error, loadingInitialPage, loadingNextPage, onLastPage }) => (
      <CourseNotesDeletionProvider course={course} pageSize={pageSize}>
        {({ deleteNote }) => (
          <CourseNotesUpdateProvider>
            {({ updateNote }) =>
              children({
                notes,
                onLastPage,
                fetchNextPage,
                deleteNote,
                updateNote,
                error,
                loadingInitialPage,
                loadingNextPage,
              })
            }
          </CourseNotesUpdateProvider>
        )}
      </CourseNotesDeletionProvider>
    )}
  </CourseNotesQueryProvider>
);

export default CourseNotesDataProvider;
