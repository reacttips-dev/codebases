import React from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

import { reshapeHighlightForClient } from 'bundles/video-highlighting/utils/highlightAPIUtils';

import type { Highlight, HighlightDraft } from 'bundles/video-highlighting/types';
import type { Course, Module, NotesDataRenderProps } from 'bundles/video-highlighting/review-page/types';

import type {
  UserNotesV1CourseModuleWithContentSortQuery,
  UserNotesV1CourseModuleWithContentSortQueryVariables,
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
 * <ModuleNotesQueryProvider course={course} pageSize={10}>
 *   {({ notes, onLastPage, fetchNextPage, error, loadingInitialPage, loadingNextPage }) =>
 *     <Component notes={notes} onLastPage={onLastPage} .../>
 *   }
 * </ModuleNotesQueryProvider>
 */

export const NOTES_BY_MODULE = gql`
  query NotesModuleQuery($courseId: String!, $moduleId: String!, $start: Int, $limit: Int) {
    UserNotesV1 @naptime {
      courseModuleWithContentSort(courseId: $courseId, moduleId: $moduleId, start: $start, limit: $limit) {
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
  module: Module;
  pageSize: number;
  children: (renderProps: NotesQueryRenderProps) => React.ReactNode;
};

const ModuleNotesQueryProvider = ({ course, module, pageSize, children }: NotesQueryProviderProps) => (
  <Query<
    UserNotesV1CourseModuleWithContentSortQuery,
    UserNotesV1CourseModuleWithContentSortQueryVariables & { start: number; limit: number }
  >
    query={NOTES_BY_MODULE}
    variables={{ courseId: course.id, moduleId: module.id, start: 0, limit: pageSize }}
    notifyOnNetworkStatusChange={true}
  >
    {({ loading, error, data, fetchMore }) => {
      if (error) {
        return children({
          notes: null,
          onLastPage: false,
          fetchNextPage: () => {},
          error: true,
          loadingInitialPage: false,
          loadingNextPage: false,
        });
      }

      if (loading && !(((data || {}).UserNotesV1 || {}).courseModuleWithContentSort || {}).elements) {
        return children({
          notes: null,
          onLastPage: false,
          fetchNextPage: () => {},
          error: false,
          loadingInitialPage: true,
          loadingNextPage: false,
        });
      }

      const { courseModuleWithContentSort } = (data || {}).UserNotesV1 || {};
      // @ts-expect-error TSMIGRATION-3.9
      const notes = ((courseModuleWithContentSort || {}).elements || []).map(reshapeHighlightForClient);
      // @ts-expect-error TSMIGRATION-3.9
      const pagingInfo = (courseModuleWithContentSort || {}).paging;

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
            newMergedData.UserNotesV1.courseModuleWithContentSort.elements = [
              // @ts-expect-error TSMIGRATION-3.9
              ...prevData.UserNotesV1.courseModuleWithContentSort.elements,
              // @ts-expect-error TSMIGRATION-3.9
              ...fetchMoreResult.UserNotesV1.courseModuleWithContentSort.elements,
            ];

            // @ts-expect-error TSMIGRATION-3.9
            const newPaging = fetchMoreResult.UserNotesV1.courseModuleWithContentSort.paging;
            // @ts-expect-error TSMIGRATION-3.9
            newMergedData.UserNotesV1.courseModuleWithContentSort.paging = newPaging;
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
        loadingNextPage: !!loading,
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
 * <ModuleNotesDeletionProvider course={course} pageSize={20}>
 *   {({ deleteNote }) =>
 *     <Component deleteNote={deleteNote} />
 *   }
 * </ModuleNotesDeletionProvider>
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
  module: Module;
  pageSize: number;
  children: (renderProps: NotesDeletionRenderProps) => React.ReactNode;
};

const ModuleNotesDeletionProvider = ({ course, module, pageSize, children }: NotesDeletionProviderProps) => (
  <Mutation mutation={DELETE_NOTE}>
    {(deleteNoteMutation: $TSFixMe) => {
      const deleteNote = (noteId: $TSFixMe) => {
        deleteNoteMutation({
          variables: { noteId },
          update: (cache: $TSFixMe) => {
            // NOTE: We must use the original query variables to manually update the cache.
            // This is because when using a paginated query as with notes, the cache actually keys
            // the query by the original query variables.
            const cachedNotesData: any = cache.readQuery({
              query: NOTES_BY_MODULE,
              variables: { courseId: course.id, moduleId: module.id, start: 0, limit: pageSize },
            });

            const prevDataClone = cloneData(cachedNotesData);
            const { courseModuleWithContentSort } = (cachedNotesData || {}).UserNotesV1 || {};
            const prevNoteElements = (courseModuleWithContentSort || {}).elements || [];
            const newNoteElements = prevNoteElements.filter((note: $TSFixMe) => note.id !== noteId);

            // adjust notes field in cloned data to get new data
            const newUpdatedData = prevDataClone;
            newUpdatedData.UserNotesV1.courseModuleWithContentSort.elements = newNoteElements;

            cache.writeQuery({
              query: NOTES_BY_MODULE,
              variables: { courseId: course.id, moduleId: module.id, start: 0, limit: pageSize },
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
 * <ModuleNotesUpdateProvider>
 *   {({ updateNote }) =>
 *     <Component updateNote={updateNote} />
 *   }
 * </ModuleNotesUpdateProvider>
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

const ModuleNotesUpdateProvider = ({ children }: NotesUpdateProviderProps) => (
  <Mutation mutation={UPDATE_NOTE}>
    {(updateNoteMutation: $TSFixMe) => {
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

type ModuleNotesProviderProps = {
  course: Course;
  module: Module;
  pageSize: number;
  children: (renderProps: NotesDataRenderProps) => React.ReactNode;
};

const ModuleNotesDataProvider = ({ course, module, pageSize, children }: ModuleNotesProviderProps) => (
  <ModuleNotesQueryProvider course={course} module={module} pageSize={pageSize}>
    {({ notes, fetchNextPage, error, loadingInitialPage, loadingNextPage, onLastPage }) => (
      <ModuleNotesDeletionProvider course={course} module={module} pageSize={pageSize}>
        {({ deleteNote }) => (
          <ModuleNotesUpdateProvider>
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
          </ModuleNotesUpdateProvider>
        )}
      </ModuleNotesDeletionProvider>
    )}
  </ModuleNotesQueryProvider>
);

export default ModuleNotesDataProvider;
