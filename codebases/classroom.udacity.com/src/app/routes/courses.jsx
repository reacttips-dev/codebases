import { makeIndexRoute, makeRoute } from './helpers';

import AnalyticsService from 'services/analytics-service';
import ConceptContainer from 'components/concepts/concept-container';
import ConceptLastViewed from 'components/concepts/last-viewed';
import ConceptShow from 'components/concepts/show';
import LabRoutes from './labs';
import LessonContainer from 'components/lessons/lesson-container';
import ProjectShow from 'components/projects/show';

import loadable from 'react-loadable';

const AsyncOnboarding = loadable({
  loader: async () => {
    const { default: Onboarding } = await import('components/onboarding');
    return Onboarding;
  },
  loading: () => null,
});

export const Routes = [
  makeRoute('lessons/:lessonKey', LessonContainer, {
    childRoutes: [
      LabRoutes,
      // NOTE: CENG-1764 & CLAS-2390 add lesson projects for a la carte career
      makeRoute('project', ProjectShow),
      makeRoute('concepts/last-viewed', ConceptLastViewed),
      makeRoute('concepts/:conceptKey', ConceptContainer, {
        indexRoute: makeIndexRoute(ConceptShow),
        onEnter: ({ params }) =>
          AnalyticsService.page('Course', {
            course_key: params.courseKey,
            lesson_key: params.lessonKey,
            concept_key: params.conceptKey,
          }),
      }),
    ],
  }),
  makeRoute('project', ProjectShow),
  makeRoute('onboarding', AsyncOnboarding),
];
