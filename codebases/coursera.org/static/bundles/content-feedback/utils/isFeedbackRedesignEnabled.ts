import epic from 'bundles/epic/client';

export default (courseId: string) => {
  return epic.get('Flex', 'feedbackRedesignEnabled', {
    course_id: courseId,
  });
};
