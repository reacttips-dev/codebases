import AssessmentWrapper from 'components/common/assessments';
import ButtonLink from 'components/common/button-link';
import ClassroomPropTypes from 'components/prop-types';
import LabConfidenceRating from '../_lab-confidence-rating.jsx';
import LabHelper from 'helpers/lab-helper';
import Markdown from '@udacity/ureact-markdown';
import PropTypes from 'prop-types';
import Responsive from 'components/common/responsive';
import Section from '../_section';
import { THEMES } from 'constants/theme';
import { __ } from 'services/localization-service';
import styles from './index.scss';

@cssModule(styles)
export default class LabShow extends React.Component {
  static displayName = 'labs/show/index';

  static propTypes = {
    lab: ClassroomPropTypes.lab.isRequired,
    updateLabResult: PropTypes.func,
  };

  static contextTypes = {
    location: PropTypes.object,
    lesson: ClassroomPropTypes.lesson,
  };

  static defaultProps = {
    updateLabResult: _.noop,
  };

  handleLabRatingBeforeChange = (activeStar) => {
    const { lab, updateLabResult, userId, trackLabActivity } = this.props;
    trackLabActivity('lab_skill_confidence_rating_before', {
      rating: activeStar,
    });

    updateLabResult({
      labId: lab.id,
      userId,
      skillConfidenceRatingBefore: activeStar,
    });
  };

  render() {
    const { lab } = this.props;
    const { location, lesson } = this.context;

    return (
      <AssessmentWrapper assessment={lab} lesson={lesson}>
        <div styleName="lab-container">
          <h1 styleName="lab-welcome">{__('Welcome to the Lab')}</h1>
          <Section title={lab.title}>
            <Markdown text={_.get(lab, 'overview.summary')} />
          </Section>
          {!LabHelper.isPassed(lab) && (
            <LabConfidenceRating
              evaluationObjective={lab.evaluation_objective}
              value={lab.result.skill_confidence_rating_before}
              onChange={this.handleLabRatingBeforeChange}
              theme={THEMES.LIGHT}
            />
          )}
          <Responsive block type="until-tablet">
            <p styleName="screen-width-warning">
              {__(
                'Labs can only be completed on a desktop or laptop and not on tablets or mobile devices. Sorry for the inconvenience.'
              )}
            </p>
          </Responsive>
          <Responsive block type="from-tablet">
            <ButtonLink
              variant="primary"
              to={`${location.pathname}/overview`}
              label={__('Go To Lab')}
            />
          </Responsive>
        </div>
      </AssessmentWrapper>
    );
  }
}
