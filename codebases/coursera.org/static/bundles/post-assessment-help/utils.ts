import epic from 'bundles/epic/client';

export const isPostQuizHelpEnabled = (courseId: string): boolean => {
  const quizHelpFlag = epic.get('postAssessmentHelp', 'postQuizHelp', { course_id: courseId });
  return !!quizHelpFlag;
};
