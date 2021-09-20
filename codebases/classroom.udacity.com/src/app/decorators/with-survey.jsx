import { ATTEMPTED_SURVEY, FREE_COURSE_SURVEY } from 'constants/survey';

import LocalStorage from 'components/common/local-storage';
import PropTypes from 'prop-types';
import SemanticTypes from 'constants/semantic-types';
import SettingsHelper from 'helpers/settings-helper';
import { connect } from 'react-redux';
import { getDisplayName } from 'helpers/decorator-helpers.js';
import { getItem } from 'components/common/local-storage/local-storage-wrapper';
import moment from 'moment';

export default function withSurvey(WrappedComponent) {
  class WithSurvey extends React.Component {
    static propTypes = {
      isGTStudent: PropTypes.bool,
    };

    static contextTypes = {
      root: PropTypes.object,
    };

    state = {
      surveyEnabled: false,
    };

    componentDidMount() {
      if (SemanticTypes.isNanodegree(this.context.root)) {
        return;
      }

      // check local storage
      const survey = getItem(FREE_COURSE_SURVEY);
      const { isGTStudent } = this.props;

      if (
        !isGTStudent &&
        (_.isEmpty(survey) ||
          (survey.status === ATTEMPTED_SURVEY &&
            moment(survey.time_stamp).add(1, 'week').isBefore(moment())))
      ) {
        this.setState({ surveyEnabled: true });
      }
    }

    onDismissModal = () => {
      this.setState({ surveyEnabled: false });
    };

    render() {
      return (
        <LocalStorage storageKey={FREE_COURSE_SURVEY} defaultValue={{}}>
          {({ value, setValue }) => (
            <WrappedComponent
              surveyStatus={value}
              updateSurveyStatus={setValue}
              surveyEnabled={this.state.surveyEnabled}
              onDismissModal={this.onDismissModal}
              {...this.props}
            />
          )}
        </LocalStorage>
      );
    }
  }

  const mapStateToProps = (state) => ({
    isGTStudent: SettingsHelper.State.isGTStudent(state),
  });

  WithSurvey.displayName = `WithSurvey(${getDisplayName(WrappedComponent)})`;
  WithSurvey.WrappedComponent = WrappedComponent;
  WithSurvey.Component = WithSurvey;

  return connect(mapStateToProps)(WithSurvey);
}
