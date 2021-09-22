/* @jsx jsx */
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import Retracked from 'js/app/retracked';
import epic from 'bundles/epic/client';

import NotesReviewPageDataState from 'bundles/video-highlighting/review-page/private/NotesReviewPageDataState';
import CourseContentDataProvider from 'bundles/video-highlighting/review-page/data/CourseContentDataProvider';

import { Typography, useTheme } from '@coursera/cds-core';
import type { Course, Module } from 'bundles/video-highlighting/review-page/types';
import initLearnerPlatformFeedbackPendo from 'bundles/common/utils/initLearnerPlatformFeedbackPendo';

import _t from 'i18n!nls/video-highlighting';
import NotesPageFilterDropdown from './NotesPageFilterDropdown';

import { NoteList } from './NoteList';

export type Props = {
  course: Course;
  modules: Module[];
};

const NotesReviewPageWithCourseData = (props: Props) => {
  const [selectedModule, setSelectedModule] = useState<string | undefined>();

  React.useEffect(() => {
    if (epic.get('BlueJays', 'LearnerNotesPendoSampleIncluded')) {
      initLearnerPlatformFeedbackPendo();
    }
  }, []);
  const theme = useTheme();

  return (
    <div
      css={css`
        ${theme.breakpoints.up('md')} {
          margin: ${theme.spacing(32, 48)};
        }

        ${theme.breakpoints.down('sm')} {
          margin: ${theme.spacing(16, 0)};
        }

        /*
          We need to disable a global focus style that clashes with CDS
        */
        a:focus,
        button:focus {
          outline: none;
        }

        /* 
          We are setting the typography of components that are not yet migrated to CDS and that are still being used by the original page 
          We don't want to override the font if the rest of the page is not using CDS
        */
        .rc-NotesReviewPageDataState * {
          ${theme.typography.h2};
        }
        .rc-NotesReviewPageDataState {
          margin: ${theme.spacing(48, 0, 0)};
        }
      `}
    >
      <Typography
        variant="h1semibold"
        css={css`
          margin: ${theme.spacing(0, 0, 48)};
          ${theme.breakpoints.down('sm')} {
            margin: ${theme.spacing(0, 0, 32)};
          }
        `}
      >
        {_t('Notes')}
      </Typography>

      <NotesPageFilterDropdown
        modules={props.modules}
        course={props.course}
        selectedContentId={selectedModule}
        onSelect={setSelectedModule}
      />
      <NoteList course={props.course} module={props.modules.find((m) => m.id === selectedModule) || null} />
    </div>
  );
};

// NOTE: Here we use an HOC to provide tracking functionality instead of
// a render prop as with other state management. This is because the HOC usage
// is far more prevalent in our codebase (consistency), and also because converting
// this to a render prop component for this case is more unwieldy than desired.
const TrackedNotesReviewPage = Retracked.createTrackedContainer<Props>(({ course }) => ({
  namespace: {
    page: 'notes_review',
  },
  courseId: course.id,
}))(NotesReviewPageWithCourseData);

// Provide course data to the notes review page.
// This is slightly ugly, since we wrap this render prop component over an HOC,
// then over another component with render props.
// Unfortunately, tracking only works with a statically-defined HOC, so we're
// stuck with something like this.
const NotesReviewPage = ({
  params: { courseSlug },
}: {
  params: {
    courseSlug: string;
  };
}) => (
  <CourseContentDataProvider courseSlug={courseSlug}>
    {({ course, modules, error, loading }) => {
      if (error) {
        return <NotesReviewPageDataState dataState="error" />;
      }

      if (loading) {
        return <NotesReviewPageDataState dataState="loading" />;
      }

      // @ts-expect-error ts-migrate(2322) FIXME: Type 'Course | null' is not assignable to type 'Co... Remove this comment to see the full error message
      return <TrackedNotesReviewPage course={course} modules={modules} />;
    }}
  </CourseContentDataProvider>
);

export default NotesReviewPage;
export { NotesReviewPageWithCourseData };
