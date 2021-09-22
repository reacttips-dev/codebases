import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';
import { compose } from 'recompose';
import Backbone from 'backbone';
import ModuleLessons from 'bundles/course-home/page-course-week/components/ModuleLessons';
import ModuleLearningObjectivesList from 'bundles/learner-learning-objectives/components/views/ModuleLearningObjectivesList';
import type Module from 'pages/open-course/common/models/module';
import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';
import type Course from 'pages/open-course/common/models/course';
import type StoredLearningObjective from 'bundles/learner-learning-objectives/models/StoredLearningObjective';
import constants from 'pages/open-course/common/constants';
import type { LoadModuleLearningObjectivesPayload } from 'bundles/learner-learning-objectives/actions/LearnerLearningObjectivesActions';
import { loadModuleLearningObjectives } from 'bundles/learner-learning-objectives/actions/LearnerLearningObjectivesActions';
import waitForProps from 'js/lib/waitForProps';
import type CourseStoreClass from 'bundles/ondemand/stores/CourseStore';
import type ProgressStoreClass from 'bundles/ondemand/stores/ProgressStore';
import type ModuleLearningObjectivesStoreClass from 'bundles/learner-learning-objectives/stores/ModuleLearningObjectivesStore';
import connectToFluxibleContext from 'js/lib/connectToFluxibleContext';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import InstructorModuleNote from 'bundles/course-home/page-course-week/components/InstructorModuleNote';
import LabSandboxLauncher from 'bundles/labs-common/components/lab-sandbox/LabSandboxLauncher';
import 'css!./__styles__/ModuleSection';

type PropsFromCaller = {
  week: number;
  module: Module;
  moduleIndex: number;
};

type PropsFromCourseStore = {
  course: Course;
  courseId: string;
};

type PropsToStores = {
  course: Course;
  module: Module;
};

type PropsFromProgressStore = {
  isNextItemChoiceStarted: boolean;
  isNextItemLessonStarted: boolean;
  nextItemMetadata: ItemMetadata;
};

type PropsFromModuleLearningObjectivesStore = {
  objectives: Array<StoredLearningObjective>;
};

type Stores = {
  CourseStore: CourseStoreClass;
  ProgressStore: ProgressStoreClass;
  ModuleLearningObjectivesStore: ModuleLearningObjectivesStoreClass;
};

type PropsToFluxibleContext = {
  course: Course;
  module: Module;
  objectives: Array<StoredLearningObjective>;
};

export type PropsToComponent = Omit<
  PropsFromCaller & PropsFromCourseStore & PropsFromProgressStore & PropsFromModuleLearningObjectivesStore,
  // Not used in the component, just to HOCs.
  'course' | 'week'
>;

export class ModuleSection extends React.Component<PropsToComponent> {
  static contextTypes = {
    week: PropTypes.number,
  };

  render() {
    const {
      courseId,
      module,
      moduleIndex,
      isNextItemChoiceStarted,
      isNextItemLessonStarted,
      nextItemMetadata,
      objectives,
    } = this.props;

    const moduleId = module.get('id');
    const moduleDescription = module.get('description');

    return (
      <section className="rc-ModuleSection od-section">
        <InstructorModuleNote title={module.get('name')} moduleId={moduleId} moduleDescription={moduleDescription} />
        <ModuleLearningObjectivesList objectives={objectives} />

        {moduleIndex === 0 && (
          <LabSandboxLauncher
            data-test="LabSandboxLauncher"
            className="lab-sandbox-launcher"
            courseId={courseId}
            isPrimaryCallToAction={false}
            showForFreeTrial={false}
          />
        )}

        <ModuleLessons
          nextItemMetadata={nextItemMetadata}
          lessons={module.getLessons().toArray()}
          isNextItemChoiceStarted={isNextItemChoiceStarted}
          isNextItemLessonStarted={isNextItemLessonStarted}
        />
      </section>
    );
  }
}

export default compose<PropsToComponent, PropsFromCaller>(
  connectToStores<PropsFromCourseStore, PropsToStores, Stores>(['CourseStore'], ({ CourseStore }) => ({
    course: CourseStore.getMetadata(),
    courseId: CourseStore.getCourseId(),
  })),
  connectToStores<PropsFromProgressStore & PropsFromModuleLearningObjectivesStore, PropsToStores, Stores>(
    ['ProgressStore', 'ModuleLearningObjectivesStore'],
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ ProgressStore, ModuleLearning... Remove this comment to see the full error message
    ({ ProgressStore, ModuleLearningObjectivesStore }, { course, module }) => {
      const nextItemMetadata = ProgressStore.getNextItemForModule(module);
      const isNextItemChoiceStarted =
        !!nextItemMetadata &&
        !!nextItemMetadata.getChoice() &&
        _(nextItemMetadata.getChoice().getItemMetadatas().toArray()).some((itemMetadata) =>
          ProgressStore.getItemProgress(itemMetadata.getId()).isAtLeastStarted()
        );

      const isNextItemLessonStarted =
        !!nextItemMetadata &&
        ProgressStore.getLessonProgress(nextItemMetadata.getLessonId()).progressState !== constants.progressNotStarted;

      return {
        isNextItemChoiceStarted,
        isNextItemLessonStarted,
        nextItemMetadata,
        objectives: ModuleLearningObjectivesStore.getModuleObjectivesInBranch(course.get('id'), module.get('id')),
      };
    }
  ),
  connectToFluxibleContext((context, { course, module, objectives }: PropsToFluxibleContext) => {
    if (!objectives) {
      const isBackboneModel = module instanceof Backbone.Model;
      const branchId = course.get('id');
      const moduleId = isBackboneModel ? module.get('id') : module.id;
      const objectiveIds = (isBackboneModel ? module.get('learningObjectives') : module.learningObjectives) || [];

      const loadModuleLearningObjectivesPayload: LoadModuleLearningObjectivesPayload = {
        branchId,
        moduleId,
        objectiveIds,
      };
      context.executeAction(loadModuleLearningObjectives, loadModuleLearningObjectivesPayload);
    }
  }),
  waitForProps(['objectives'])
)(ModuleSection);
