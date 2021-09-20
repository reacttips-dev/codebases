import { locationShape, routerShape } from 'react-router';

import ClassroomPropTypes from 'components/prop-types';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import PropTypes from 'prop-types';
import RouteHelper from 'helpers/route-helper';
import SemanticType from 'constants/semantic-types';
import enrollmentState from 'constants/enrollments';

class Redirect extends React.Component {
  static displayName = 'nanodegrees/_redirect';
  static propTypes = {
    user: ClassroomPropTypes.user.isRequired,
    program: ClassroomPropTypes.program.isRequired,
    isNDHomeEnabled: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    router: routerShape.isRequired,
    location: locationShape.isRequired,
  };

  componentDidMount() {
    this._redirectIfNeeded();
  }

  componentDidUpdate() {
    this._redirectIfNeeded();
  }

  _redirectIfNeeded() {
    const { router, location } = this.context;
    const path = this._getTargetPath();
    // assume we don't want to redirect to a parent path
    if (path && !RouteHelper.isPathSubpath(location.pathname, path)) {
      router.replace(path);
    }
  }

  _shouldRedirectToOnboarding() {
    const {
      user: {
        settings: { onboarding_completed_keys = [] },
      },
      program,
    } = this.props;

    // Previously, all Nanodegrees required cohorts and we stored the cohort id in the onboarding_completed_keys.
    // Although we no longer rely on cohorts, we don't want to surface onboarding to students who completed it
    // during the era of cohorts. Therefore, we'll check for cohort id (if it exists) and nanodegree node_key.
    const currentCohort = NanodegreeHelper.getCurrentCohort(program);

    // Onboarding is only enabled for certain service models (see Registrar-Api's service_model table)

    const isOnboardingEnabled = _.get(
      program,
      'enrollment.includes_welcome_flow',
      false
    );
    return (
      isOnboardingEnabled &&
      _.get(program, 'enrollment.state') === enrollmentState.ENROLLED &&
      !_.includes(
        onboarding_completed_keys,
        _.toString(_.get(currentCohort, 'id')) ||
          _.toString(_.get(program, 'user_state.node_key'))
      )
    );
  }

  _getTargetPath() {
    const {
      program: { key },
      isNDHomeEnabled,
      program,
    } = this.props;
    const { location } = this.context;
    if (this._shouldRedirectToOnboarding()) {
      if (SemanticType.isNanodegree(program)) {
        return RouteHelper.nanodegreeOnboardingPath({ nanodegreeKey: key });
      } else if (SemanticType.isPart(program)) {
        return RouteHelper.courseOnboardingPath({ courseKey: key });
      }
    } else if (
      // If it's at the base route then we need to default to somewhere
      SemanticType.isNanodegree(program) &&
      RouteHelper.isPathSubpath(
        RouteHelper.nanodegreePath({ nanodegreeKey: key }),
        location.pathname
      )
    ) {
      if (isNDHomeEnabled) {
        return RouteHelper.dashboardPath({ nanodegreeKey: key });
      } else {
        return RouteHelper.coreCurriculumPath({ nanodegreeKey: key });
      }
    } else if (SemanticType.isPart(program)) {
      return RouteHelper.paidCoursePath({ courseKey: key });
    }
  }

  render() {
    return null;
  }
}

export default Redirect;
