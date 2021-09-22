import { compose, withProps, branch } from 'recompose';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { isTabletOrSmaller } from 'bundles/phoenix/utils/matchMedia';

import connectToRouter from 'js/lib/connectToRouter';
import withEnrollmentStateBannerEnabledState from 'bundles/preview/containers/withEnrollmentStateBannerEnabledState';

/**
 * Encapsulates the logic of checking whether the View as Learner banner
 * should be visible.
 *
 * Usage:
 *    const MyComponent = ({ showEnrollmentStateBanner }) => {
 *      ...
 *    };
 *
 *    _.compose(
 *      withShowEnrollmentStateBanner()
 *    )(MyComponent);
 */
const withShowEnrollmentStateBanner = <Props>() =>
  compose<Props & { showEnrollmentStateBanner: boolean }, Props>(
    connectToRouter(({ location }) => ({
      pathname: location.pathname || '',
    })),
    // Check if on an enrollment banner page
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ pathname }: { pathname: any; ... Remove this comment to see the full error message
    withProps(({ pathname }) => ({
      onEnrollmentBannerEnabledPage: !!(
        pathname &&
        (pathname.indexOf('/learn/') === 0 || pathname.indexOf('/sandbox/') === 0) &&
        !isTabletOrSmaller()
      ),
    })),
    // Check if enrollment state banner feature is enabled
    branch(
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ onEnrollmentBannerEnabledPage... Remove this comment to see the full error message
      ({ onEnrollmentBannerEnabledPage }) => onEnrollmentBannerEnabledPage,
      withEnrollmentStateBannerEnabledState()
    ),
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ onEnrollmentBannerEnabledPage... Remove this comment to see the full error message
    withProps(({ onEnrollmentBannerEnabledPage, isEnrollmentStateBannerEnabled }) => ({
      showEnrollmentStateBanner: onEnrollmentBannerEnabledPage && isEnrollmentStateBannerEnabled,
    }))
  );

export default withShowEnrollmentStateBanner;
