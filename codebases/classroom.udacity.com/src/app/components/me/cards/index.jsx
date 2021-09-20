import Applications from './applications';
import AsyncUconnectContainer from './_uconnect';
import CurrentEnrollments from './current-enrollments';
import Footer from 'components/common/footer';
import GraduatedEnrollments from './graduated-enrollments';
import { Heading } from '@udacity/veritas-components';
import LatestActivity from './latest-activity';
import NoEnrollments from './no-enrollments';
import PropTypes from 'prop-types';
import RouteMixin from 'mixins/route-mixin';
import SemanticTypes from 'constants/semantic-types';
import SettingsHelper from 'helpers/settings-helper';
import StateHelper from 'helpers/state-helper';
import { __ } from 'services/localization-service';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import moment from 'moment';
import styles from './index.scss';
import { trackInitialPageLoad } from 'helpers/performance-helper';

/**
 * Show current user's enrolled nanodegrees and courses and parts
 */
@cssModule(styles)
export class Cards extends React.Component {
  static displayName = 'me/cards';

  static propTypes = {
    /* Redux */
    user: PropTypes.object,
    lastViewedNanodegree: PropTypes.object,
    lastViewedCourse: PropTypes.object,
    subscribedNanodegreesCount: PropTypes.number,
    subscribedCoursesCount: PropTypes.number,
    subscribedPartsCount: PropTypes.number,
    graduatedNanodegreesCount: PropTypes.number,
    graduatedCoursesCount: PropTypes.number,
    graduatedPartsCount: PropTypes.number,
    applications: PropTypes.arrayOf(PropTypes.object),
    subscriptions: PropTypes.arrayOf(PropTypes.object),
    nanodegreesAndCoursesAndParts: PropTypes.object,
  };

  static defaultProps = {
    lastViewedNanodegree: {},
    lastViewedCourse: {},
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  mixins: [RouteMixin];

  componentDidMount() {
    trackInitialPageLoad('me');
  }

  render() {
    const {
      connectSession,
      lastViewedNanodegree,
      lastViewedCourse,
      subscribedNanodegreesCount,
      subscribedCoursesCount,
      subscribedPartsCount,
      graduatedNanodegreesCount,
      graduatedCoursesCount,
      graduatedPartsCount,
      user,
      applications,
    } = this.props;

    const hasNoEnrollments =
      subscribedCoursesCount +
        graduatedCoursesCount +
        subscribedPartsCount +
        subscribedNanodegreesCount +
        graduatedPartsCount +
        graduatedNanodegreesCount ===
      0;

    const hasPaidPrograms =
      !!subscribedNanodegreesCount || !!subscribedPartsCount;

    //SXP-124: Optionally sort the results by date so that /me shows newest to oldest
    const paidEnrollments = _.get(
      user,
      'nanodegreesAndCoursesAndParts.current',
      []
    ).filter((node) => {
      return node.semantic_type === 'Degree' || node.semantic_type === 'Part';
    });

    const courseEnrollments = _.filter(
      _.get(user, 'nanodegreesAndCoursesAndParts.current', []),
      {
        semantic_type: SemanticTypes.COURSE,
      }
    );

    const activeApplications = _.filter(applications, (app) =>
      moment().isBefore(moment(app.cohort.start_at))
    );

    const totalGraduatedCount =
      graduatedNanodegreesCount + graduatedCoursesCount + graduatedPartsCount;

    return (
      <div styleName="body">
        <nav styleName="navigation" aria-label="cards-nav">
          <ul>
            {hasPaidPrograms && (
              <li>
                <a href="#nanodegrees">{__('Paid Programs')}</a>
              </li>
            )}
            {subscribedCoursesCount > 0 && (
              <li>
                <a href="#courses">{__('Free Courses')}</a>
              </li>
            )}
            {totalGraduatedCount > 0 && (
              <li>
                <a href="#graduated">{__('Graduated')}</a>
              </li>
            )}
            {!_.isEmpty(activeApplications) && (
              <li>
                <a href="#applications">{__('Applications')}</a>
              </li>
            )}
          </ul>
        </nav>

        {hasNoEnrollments ? (
          <NoEnrollments />
        ) : (
          <div>
            {!_.isEmpty(connectSession) ? (
              <div styleName="section">
                <AsyncUconnectContainer session={connectSession} />
              </div>
            ) : null}
            <div styleName="section">
              <Heading size="h5" as="h2">
                {__('Latest Activity')}
              </Heading>
              <ol>
                <LatestActivity
                  lastViewedNanodegree={lastViewedNanodegree}
                  lastViewedCourse={lastViewedCourse}
                />
              </ol>
            </div>

            {hasPaidPrograms && (
              <div styleName="section" id="nanodegrees">
                <Heading size="h5" as="h2">
                  {__('Current Paid Enrollments')}
                </Heading>
                <ol>
                  <CurrentEnrollments enrollments={paidEnrollments} />
                </ol>
              </div>
            )}

            {subscribedCoursesCount > 0 ? (
              <div styleName="section" id="courses">
                <Heading size="h5" as="h2">
                  {__('Current Free Course Enrollments')}
                </Heading>
                <ol>
                  <CurrentEnrollments enrollments={courseEnrollments} />
                </ol>
              </div>
            ) : null}

            {totalGraduatedCount > 0 ? (
              <div styleName="section" id="graduated">
                <Heading size="h5" as="h2">
                  {__('Graduated')}
                </Heading>
                <ol>
                  <GraduatedEnrollments
                    enrollments={user.nanodegreesAndCoursesAndParts.graduated}
                  />
                </ol>
              </div>
            ) : null}
          </div>
        )}
        {!_.isEmpty(activeApplications) ? (
          <div styleName="section" id="applications">
            <Heading size="h5" as="h2">
              {__('Applications')}
            </Heading>
            <ol>
              <Applications applications={activeApplications} />
            </ol>
          </div>
        ) : null}
        {
          // TODO: Preregistered ND Countdown
        }
        {hasNoEnrollments ? null : <Footer />}
      </div>
    );
  }
}

const mapStateToProps = function (state) {
  function _getLastViewedProgram(programs) {
    return _.chain(programs)
      .orderBy('user_state.last_viewed_at', 'desc') // Note: nulls sort first, which is what we want for new signups
      .head()
      .value();
  }

  return {
    user: SettingsHelper.State.getUser(state),
    lastViewedNanodegree: _getLastViewedProgram(
      StateHelper.getNanodegrees(state)
    ),
    lastViewedCourse: _getLastViewedProgram([
      ...StateHelper.getCourses(state),
      ...StateHelper.getPartsAsCourses(state),
    ]),
    subscribedNanodegreesCount: SettingsHelper.State.getSubscribedNanodegreesCount(
      state
    ),
    subscribedCoursesCount: SettingsHelper.State.getSubscribedCoursesCount(
      state
    ),
    subscribedPartsCount: SettingsHelper.State.getSubscribedPartsCount(state),
    graduatedNanodegreesCount: SettingsHelper.State.getGraduatedNanodegreesCount(
      state
    ),
    graduatedCoursesCount: SettingsHelper.State.getGraduatedCoursesCount(state),
    graduatedPartsCount: SettingsHelper.State.getGraduatedPartsCount(state),
    applications: StateHelper.getApplications(state),
    connectSession: SettingsHelper.State.getConnectSession(state),
    subscriptions: SettingsHelper.State.getSubscriptions(state),
    nanodegreesAndCoursesAndParts: SettingsHelper.State.getNanodegreesAndCoursesAndParts(
      state
    ),
  };
};

export default compose(connect(mapStateToProps))(Cards);
