import ContentsList, { ItemTypes } from 'components/common/contents-list';

import ClassroomPropTypes from 'components/prop-types';
import LabHelper from 'helpers/lab-helper';
import LessonHelper from 'helpers/lesson-helper';
import MappingHelper from 'helpers/mapping-helper';
import NodeHelper from 'helpers/node-helper';
import ProjectHelper from 'helpers/project-helper';
import PropTypes from 'prop-types';
import ResourcesList from 'components/common/resources-list';
import SemanticTypes from 'constants/semantic-types';
import Sidebar from './_sidebar';
import { __ } from 'services/localization-service';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import withRoutes from 'decorators/with-routes';

const mapStateToProps = (state, ownProps) => {
  const { activeLesson } = ownProps;
  const { inLessonPreviewMode } = state.lessonPreview;
  const concepts = activeLesson.concepts || [];
  return {
    concepts,
    project: activeLesson.project,
    lab: activeLesson.lab,
    atomsByConceptKey: MappingHelper.createAtomsByConceptKeyMap(
      state,
      _.map(concepts, 'key')
    ),
    inLessonPreviewMode,
  };
};

export class LessonSidebar extends React.Component {
  static displayName = 'common/lesson-sidebar';

  static propTypes = {
    activeLesson: ClassroomPropTypes.lesson.isRequired,
    activeNode: PropTypes.oneOfType([
      ClassroomPropTypes.concept,
      ClassroomPropTypes.project,
      ClassroomPropTypes.lab,
    ]).isRequired,
    course: ClassroomPropTypes.course,

    /* Redux */
    atomsByConceptKey: PropTypes.objectOf(
      PropTypes.arrayOf(ClassroomPropTypes.atom)
    ).isRequired,
    concepts: PropTypes.array,
    project: ClassroomPropTypes.project,

    /* Routes */
    conceptPath: PropTypes.func.isRequired,
    paidCourseConceptPath: PropTypes.func.isRequired,
    lessonListPath: PropTypes.func.isRequired,
    nanodegreeLabPath: PropTypes.func.isRequired,
    projectPath: PropTypes.func.isRequired,
    projectPathForPaidCourseLesson: PropTypes.func.isRequired,
    lessonPreviewPath: PropTypes.func.isRequired,
    paidCourseLessonListPath: PropTypes.func.isRequired,

    // hide certain elements in the sidebar
    // when instructors/CMs preview lesson files
    inLessonPreviewMode: PropTypes.bool,
  };

  static defaultProps = {
    project: null,
    concepts: null,
    course: null,
  };

  static contextTypes = {
    lessons: PropTypes.arrayOf(ClassroomPropTypes.lesson),
    root: ClassroomPropTypes.node,
  };

  _isInteractive(concept) {
    return NodeHelper.isInteractiveAtom(
      _.get(this.props, ['atomsByConceptKey', concept.key, 0])
    );
  }

  _getConceptItemType(concept) {
    if (NodeHelper.isCompleted(concept)) {
      return ItemTypes.CHECK;
    } else if (this._isInteractive(concept)) {
      return ItemTypes.STAR;
    } else {
      return ItemTypes.CIRCLE;
    }
  }

  _getConceptTitle(concept) {
    return `${concept.title}`;
  }

  _getProjectType() {
    const { project } = this.props;
    return ProjectHelper.isCompleted(project)
      ? ItemTypes.CHECK
      : ItemTypes.STAR;
  }

  _getContentsListItems() {
    const {
      activeLesson,
      activeNode,
      conceptPath,
      paidCourseConceptPath,
      concepts,
      lab,
      nanodegreeLabPath,
      project,
      projectPath,
      projectPathForPaidCourseLesson,
      course,
    } = this.props;

    return _.compact([
      ..._.map(concepts, (concept, idx) => {
        // hack to show submittable workspace concept as a project
        const isSubmittableWorkspaceConcept =
          idx === concepts.length - 1 &&
          project &&
          LessonHelper.isDisplayWorkspaceProjectOnly(activeLesson);
        return {
          path: SemanticTypes.isPart(course)
            ? paidCourseConceptPath({
                conceptKey: concept.key,
              })
            : conceptPath({
                conceptKey: concept.key,
              }),
          type: isSubmittableWorkspaceConcept
            ? this._getProjectType()
            : this._getConceptItemType(concept),
          isSelected: activeNode.key === concept.key,
          key: concept.key,
          title: isSubmittableWorkspaceConcept
            ? __('Project: <%= conceptTitle %>', {
                conceptTitle: concept.title,
              })
            : this._getConceptTitle(concept),
        };
      }),

      project && !LessonHelper.isDisplayWorkspaceProjectOnly(activeLesson)
        ? {
            path: SemanticTypes.isPart(course)
              ? projectPathForPaidCourseLesson()
              : projectPath(),
            type: this._getProjectType(),
            isSelected: activeNode.key === project.key,
            key: project.key,
            title: __('Project: <%= projectTitle %>', {
              projectTitle: project.title,
            }),
          }
        : null,
      lab
        ? {
            path: nanodegreeLabPath(),
            type: LabHelper.reviewCompleted(lab)
              ? ItemTypes.CHECK
              : ItemTypes.STAR,
            isSelected: activeNode.key === lab.key,
            key: lab.key,
            title: __('Lab: <%= labTitle %>', {
              labTitle: lab.title,
            }),
          }
        : null,
    ]);
  }

  _getTitleParts() {
    const { activeLesson, project, lab } = this.props;
    const { lessons } = this.context;

    if (project) {
      return {
        prefix: __('Project:'),
        text: __('<%= projectTitle %>', {
          projectTitle: project.title,
        }),
      };
    } else if (lab) {
      return {
        prefix: __('Lab:'),
        text: __('<%= labTitle %>', {
          labTitle: lab.title,
        }),
      };
    } else {
      return {
        prefix: __('Lesson <%= lessonNumber %>:', {
          lessonNumber: NodeHelper.getPosition(lessons, activeLesson) + 1,
        }),
        text: __('<%= lessonTitle %>', {
          lessonTitle: activeLesson.title,
        }),
      };
    }
  }

  conceptsSidebarItems = (excludeResources = false) => {
    const { activeLesson } = this.props;
    const { root } = this.context;

    const resources = {
      title: __('Resources'),
      content: <ResourcesList node={activeLesson} root={root} />,
      defaultExpanded: false,
    };

    const concepts = {
      title: __('Concepts'),
      content: <ContentsList items={this._getContentsListItems()} />,
      defaultExpanded: true,
    };

    return excludeResources ? [concepts] : [resources, concepts];
  };

  _renderComponent() {
    const {
      lessonListPath,
      paidCourseLessonListPath,
      inLessonPreviewMode,
      lessonPreviewPath,
      course,
    } = this.props;
    const sidebarItems = this.conceptsSidebarItems(inLessonPreviewMode);
    const isPart = SemanticTypes.isPart(course);
    if (inLessonPreviewMode) {
      return (
        <div data-test="lesson-sidebar">
          <Sidebar
            headerPath={lessonPreviewPath()}
            items={sidebarItems}
            titleParts={{ text: 'Back to Preview' }}
            ndKey={this.context.root.key}
          />
        </div>
      );
    } else {
      return (
        <div data-test="lesson-sidebar">
          <Sidebar
            headerPath={isPart ? paidCourseLessonListPath() : lessonListPath()}
            items={sidebarItems}
            titleParts={this._getTitleParts()}
            ndKey={this.context.root.key}
          />
        </div>
      );
    }
  }

  render() {
    return this._renderComponent();
  }
}

export default compose(
  connect(mapStateToProps),
  withRoutes(
    'conceptPath',
    'paidCourseConceptPath',
    'lessonListPath',
    'paidCourseLessonListPath',
    'nanodegreeLabPath',
    'projectPath',
    'projectPathForPaidCourseLesson',
    'lessonPreviewPath'
  )
)(LessonSidebar);
