import Actions, { createAction } from 'actions';
import {
  createFakeNanodegree,
  dummyUser,
  generateImportCode,
  moduleKey,
  nanodegreeId,
  nanodegreeKey,
  partKey,
  retrieveGDocId,
} from 'helpers/lesson-preview-helper';

import { Button } from '@udacity/veritas-components';
import EvaluationsService from 'services/evaluations-service';
import FeatureHelper from 'helpers/feature-helper';
import GoogleApiService from 'services/google-api-service';
import LessonsService from 'services/lessons-service';
/* It's unclear why but we need to import NanodegreeContainer here for
  the preview to work. When loading a nanodegree, the ND route (/nanodegrees/:ndkey/...)
  is called multiple times. If we omit the import statement below, the route loading
  breaks somewhere in the call stack.
  Note that ND component is lazy loaded in the routes but not here.
  However, it affects bundle size only at the /preview path and nowhere else.
*/
import NanodegreesService from 'services/nanodegrees-service';
import PartsService from 'services/parts-service';
import PropTypes from 'prop-types';
import React from 'react';
import RouteHelper from 'helpers/route-helper';
import UserService from 'services/user-service';
import { connect } from 'react-redux';
import styles from './lesson-preview.scss';

const mapStateToProps = (state) => {
  const { lastViewedConcepts } = state.lessonPreview;
  const { atoms } = state;

  return {
    lastViewedConcepts,
    atoms,
  };
};

export class LessonPreviewLoader extends React.Component {
  static displayName = 'lessons/lesson-preview';

  static propTypes = {
    url: PropTypes.string,
    updateUnstructuredUserStateData: PropTypes.func,
    previewLesson: PropTypes.func,
    fetchPreviewLesson: PropTypes.func,
    fetchPreviewNanodegree: PropTypes.func,

    // to help instructors/CMs when they refresh a lesson file
    lastViewedConcepts: PropTypes.object,
    atoms: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const url = this.props.url || '';

    this.state = {
      initializing: true,
      lessonDocumentUrl: url,
      nanodegree: null,
      user: {},
      errorMsg: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.url !== this.props.url) {
      this.setState({
        lessonDocumentUrl: nextProps.url,
      });
    }
  }

  loadND = (location) => {
    this.props.router.push(location);
  };

  stubPartsService = () => {
    PartsService.fetchConceptsUserStates = () => Promise.resolve([{}]);
  };

  stubLessonService = (lessonData) => {
    LessonsService.fetch = () => Promise.resolve(lessonData);
  };

  stubNanodegreeService = (nanodegree) => {
    NanodegreesService.fetchProjectStates = () => Promise.resolve({});
    NanodegreesService.fetch = () => Promise.resolve(nanodegree);
    NanodegreesService.fetchDefaultNanodegrees = () =>
      Promise.resolve([nanodegree]);
  };

  stubUserService = (user) => {
    UserService.fetchUserBase = () => Promise.resolve(user);
  };

  findAtomInLesson = (lesson, atomKey) => {
    var foundAtom;

    _.find(lesson.concepts, (concept) => {
      foundAtom = _.find(concept.atoms, { key: atomKey });
      return !_.isUndefined(foundAtom);
    });

    return foundAtom;
  };

  stubMultipleChoiceQuizAtom = ({ nodeKey, selectedIds }, lesson) => {
    var feedbacks = [];
    var is_correct = true;
    var quizAtom = this.findAtomInLesson(lesson, nodeKey);

    if (quizAtom) {
      _.each(quizAtom.question.answers, (answer) => {
        if (
          (answer.is_correct && !selectedIds.includes(answer.id)) ||
          (!answer.is_correct && selectedIds.includes(answer.id))
        ) {
          is_correct = false;
          if (_.trim(answer.incorrect_feedback, ' \n') !== '') {
            feedbacks.push(answer.incorrect_feedback);
          }
        }
      });

      if (is_correct) {
        feedbacks.push(quizAtom.question.correct_feedback);
      } else if (feedbacks.length === 0) {
        feedbacks.push(quizAtom.question.default_feedback);
      }
    } else {
      is_correct = false;
    }

    return Promise.resolve({
      is_correct,
      feedbacks,
    });
  };

  _stubSingleChoiceQuizAtom = ({ nodeKey, selectedId }, lesson) => {
    var feedback = '';
    var is_correct = true;
    var quizAtom = this.findAtomInLesson(lesson, nodeKey);

    if (quizAtom) {
      _.each(quizAtom.question.answers, (answer) => {
        if (selectedId === answer.id && !answer.is_correct) {
          feedback = _.trim(answer.incorrect_feedback, ' \n');
          is_correct = false;
          return false;
        }
      });

      if (is_correct) {
        feedback = quizAtom.question.correct_feedback;
      }
    } else {
      is_correct = false;
    }

    if (feedback === '') {
      feedback = quizAtom.question.default_feedback;
    }

    return Promise.resolve({
      is_correct,
      feedback,
    });
  };

  _stubMatchingQuizAtom = ({ nodeKey, answerIds }, lesson) => {
    var feedback = '';
    var is_correct = true;
    var quizAtom = this.findAtomInLesson(lesson, nodeKey);

    if (quizAtom) {
      _.each(quizAtom.question.concepts, (concept) => {
        var answerId = answerIds.shift();
        if (answerId !== concept.correct_answer_id) {
          is_correct = false;
          return false;
        }
      });
    }

    feedback = is_correct
      ? quizAtom.question.correct_feedback
      : quizAtom.question.default_feedback;

    return Promise.resolve({
      is_correct,
      feedback,
    });
  };

  stubEvaluationsService = (lesson) => {
    EvaluationsService.gradeCheckboxQuizAtom = ({ nodeKey, selectedIds }) => {
      return this.stubMultipleChoiceQuizAtom({ nodeKey, selectedIds }, lesson);
    };

    EvaluationsService.gradeMatchingQuizAtom = ({ nodeKey, answerIds }) => {
      return this._stubMatchingQuizAtom({ nodeKey, answerIds }, lesson);
    };

    EvaluationsService.gradeRadioQuizAtom = ({ nodeKey, selectedId }) => {
      return this._stubSingleChoiceQuizAtom({ nodeKey, selectedId }, lesson);
    };
  };

  loadGoogleDoc = () => {
    const gdocId = retrieveGDocId(this.state.lessonDocumentUrl);

    GoogleApiService.getDoc(gdocId)
      .then((response) => {
        const document = response.result;
        const lessonData = generateImportCode(document);
        const nanodegree = createFakeNanodegree(lessonData);
        const lessonKey = lessonData.key;

        // Monkey patch feature actions to avoid the calling
        Actions.fetchFeatureEnabledOptimizely = () =>
          createAction(Actions.Types.FETCH_FEATURE_ENABLED_COMPLETED, {});
        Actions.fetchStudentHubEnabled = () =>
          createAction(Actions.Types.FETCH_FEATURE_ENABLED_COMPLETED, {});
        Actions.fetchCohorts = () =>
          createAction(Actions.Types.FETCH_COHORTS_COMPLETED, {});
        FeatureHelper.isNDHomeEnabled = () => false;

        // stub the response returned by the API services
        // to use our dummy degree and generated lesson
        this.stubPartsService();
        this.stubLessonService(lessonData);
        this.stubNanodegreeService(nanodegree);
        this.stubUserService(dummyUser);
        this.stubEvaluationsService(lessonData);

        this.props.fetchPreviewLesson(lessonData);
        this.props.fetchPreviewNanodegree(nanodegree);

        let lastViewedConceptKey = this.props.lastViewedConcepts[
          lessonData.key
        ];

        // access the last viewed concept for usability when instructors are
        // changing/previewing one or more lesson files.
        let conceptPath = '';
        if (lastViewedConceptKey) {
          conceptPath = `concepts/${lastViewedConceptKey}`;
        } else {
          conceptPath = `concepts/${lessonData.concepts[0].key}`;
        }

        const location = `${RouteHelper.nanodegreeLessonPath({
          nanodegreeKey,
          partKey,
          moduleKey,
          lessonKey,
        })}/${conceptPath}`;

        this.loadND(location);
      })
      .catch((error) => {
        this.setErrorMessage(_.get(error, 'result.error.message'));
      });
  };

  setErrorMessage = (errorMsg) => {
    this.setState({
      errorMsg,
    });
  };

  clearAtomUserStates = () => {
    let atomsWithUserState = _.filter(this.props.atoms, (atom) => {
      return !_.isUndefined(atom.user_state);
    });

    _.each(atomsWithUserState, (atom) => {
      this.props.updateUnstructuredUserStateData({
        rootKey: nanodegreeKey,
        rootId: nanodegreeId,
        nodeKey: atom.key,
        nodeId: atom.id,
        json: '"{}"',
      });
    });
  };

  loadPreview = () => {
    this.setErrorMessage('');
    this.loadGoogleDoc();
    this.clearAtomUserStates();
    this.props.previewLesson(this.state.lessonDocumentUrl);
  };

  onUrlChange = (evt) => {
    this.setState({
      lessonDocumentUrl: evt.target.value,
    });
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.previewSection}>
          <input
            type="text"
            placeholder="Enter lesson document URL"
            value={this.state.lessonDocumentUrl}
            onChange={this.onUrlChange}
          />
          <Button
            label={'Preview'}
            variant="primary"
            onClick={this.loadPreview}
          />
        </div>
        {this.state.errorMsg ? (
          <p className={styles.error}>{this.state.errorMsg}</p>
        ) : null}
      </div>
    );
  }
}

export default connect(mapStateToProps)(cssModule(LessonPreviewLoader, styles));
