import epicClient from 'bundles/epic/client';

declare global {
  interface Window {
    coursera: {
      courseId: string;
    };
  }
}

export const isMonacoEnabled = (): boolean => {
  let courseId: string | null = null;
  if (typeof window !== 'undefined') {
    courseId = window.coursera?.courseId;
  }
  return courseId
    ? epicClient.get('Authoring', 'enableMonacoEditor', {
        // eslint-disable-next-line camelcase
        course_id: courseId,
      })
    : false;
};
