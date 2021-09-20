import {
  ATTEMPTED_SURVEY,
  COMPLETED_SURVEY,
  SURVEY_TEXTS,
} from 'constants/survey';
import { Button, Modal } from '@udacity/veritas-components';
import { branch, renderNothing } from 'recompose';

import AnalyticsService from 'services/analytics-service';
import Megaphone from 'src/assets/images/icons/megaphone.svg';
import PropTypes from 'prop-types';
import QuestionSlide from 'components/survey/question-slide';
import { Slides } from 'components/common/slides';
import { SlidesConsumer } from 'components/common/slides/_context';
import { __ } from 'services/localization-service';
import styles from './survey-modal.scss';
import withAnalytics from 'decorators/analytics';

const CountTitleHeader = () => {
  return (
    <SlidesConsumer>
      {({ slideIndex, slideCount }) => (
        <h1 className={styles['counts-title']}>{`${
          slideIndex + 1
        } of ${slideCount}`}</h1>
      )}
    </SlidesConsumer>
  );
};

@withAnalytics
@cssModule(styles, { allowMultiple: true })
export class SurveyModal extends React.Component {
  static displayName = 'survey/survey-modal';

  static propTypes = {
    surveyEnabled: PropTypes.bool.isRequired,
    surveyStatus: PropTypes.object.isRequired,
    updateSurveyStatus: PropTypes.func,
    onDismissModal: PropTypes.func.isRequired,
    track: PropTypes.func.isRequired, // withAnalytic
  };

  state = {
    isOpen: true,
    isFinished: false,
    showWelcomeSlide: true,
    responses: {},
  };

  handleOnRequestClose = () => {
    const { onDismissModal, updateSurveyStatus, track } = this.props;
    updateSurveyStatus({ status, time_stamp: new Date().getTime() });
    const { isFinished } = this.state;
    track('Survey closed', { finishedSurvey: isFinished });

    if (!isFinished) {
      updateSurveyStatus({
        status: ATTEMPTED_SURVEY,
        time_stamp: new Date().getTime(),
      });
    } else {
      updateSurveyStatus({
        status: COMPLETED_SURVEY,
        time_stamp: new Date().getTime(),
      });
    }

    onDismissModal();
    this.setState({ isOpen: false });
  };

  handleFinish = () => {
    AnalyticsService.track('Survey Submission', this.state.responses);
    this.setState({ isFinished: true });
    return;
  };

  onResponseSelected = (prompt, response) => {
    this.setState({
      responses: {
        ...this.state.responses,
        [prompt]: response,
      },
    });
  };

  getResponse = (question) => {
    return _.get(this.state, ['responses', question], null);
  };

  renderQuestions = () => {
    const surveys = SURVEY_TEXTS.SURVEYS;
    return _.map(surveys, (survey, idx) => {
      return (
        <QuestionSlide
          key={idx}
          survey={survey}
          isLast={idx === surveys.length - 1}
          onResponseSelected={this.onResponseSelected}
          response={this.getResponse(survey.question)}
        />
      );
    });
  };

  renderContent = () => {
    const { track } = this.props;
    const { isFinished, showWelcomeSlide } = this.state;

    if (showWelcomeSlide) {
      return (
        <div styleName="container">
          <h5>{SURVEY_TEXTS.WELCOME_SURVEY_TITLE}</h5>
          <h6>{SURVEY_TEXTS.WELCOME_SURVEY_SUBTITLE}</h6>
          <Button
            variant="primary"
            label={__('Get started')}
            onClick={() => this.setState({ showWelcomeSlide: false })}
          />
        </div>
      );
    }

    if (isFinished) {
      return (
        <div styleName="container">
          <img src={Megaphone} alt={__('megaphone')} />
          <span styleName="thank-you-text">{__('Thank you!')}</span>
          <Button
            variant="primary"
            label={__('Back to my course')}
            onClick={() => this.handleOnRequestClose()}
          />
        </div>
      );
    }

    return (
      <Slides
        onEnterSlide={(slideName) => track(`Viewed ${slideName}`)}
        onFinish={this.handleFinish}
        title={<CountTitleHeader />}
      >
        {this.renderQuestions()}
      </Slides>
    );
  };

  render() {
    const { isOpen } = this.state;

    return (
      <Modal
        open={isOpen}
        onClose={this.handleOnRequestClose}
        label={__('Survey')}
        closeLabel={__('Close Modal')}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

export default branch(
  ({ surveyEnabled }) => !surveyEnabled,
  renderNothing
)(SurveyModal);
