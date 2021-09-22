import React from 'react';
import CourseNotesDataProvider from 'bundles/video-highlighting/review-page/data/CourseNotesDataProvider';
import ModuleNotesDataProvider from 'bundles/video-highlighting/review-page/data/ModuleNotesDataProvider';

import { Course, Module, NotesDataRenderProps } from 'bundles/video-highlighting/review-page/types';

type Props = {
  contentType: 'course' | 'module';
  course: Course;
  module: Module | null;
  pageSize: number;
  children: (renderProps: NotesDataRenderProps) => React.ReactNode;
};

const ContentNotesDataProvider = ({ contentType, course, module, pageSize = 10, children }: Props) => {
  if (contentType === 'module') {
    if (module) {
      return (
        <ModuleNotesDataProvider course={course} module={module} pageSize={pageSize}>
          {(notesDataProps) => children(notesDataProps)}
        </ModuleNotesDataProvider>
      );
    } else {
      return null;
    }
  }

  return (
    <CourseNotesDataProvider course={course} pageSize={pageSize}>
      {(notesDataProps) => children(notesDataProps)}
    </CourseNotesDataProvider>
  );
};

export default ContentNotesDataProvider;
