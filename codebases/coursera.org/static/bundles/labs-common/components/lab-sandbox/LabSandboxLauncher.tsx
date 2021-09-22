import React from 'react';
import { compose } from 'recompose';
import { css, StyleSheet, Box } from '@coursera/coursera-ui';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import connectToRouter from 'js/lib/connectToRouter';
import TrackedDiv from 'bundles/page/components/TrackedDiv';
import withCourseOwnership from 'bundles/enroll/utils/withCourseOwnership';
import type { PropsFromWithCourseOwnership } from 'bundles/enroll/utils/withCourseOwnership';
import LabSandboxLaunchButton from 'bundles/labs-common/components/lab-sandbox/LabSandboxLaunchButton';
import type CourseStoreClass from 'bundles/ondemand/stores/CourseStore';
import type SessionStoreClass from 'bundles/course-sessions/stores/SessionStore';
import { canUserAccessLabSandboxForCourseOrItem, getLanguagesSpec } from 'bundles/labs-common/utils/LabSandboxUtils';
import { getLabSandboxConfigurationForCourse } from 'bundles/item-workspace/utils/FeatureUtils';
import InteractiveIcon from 'bundles/labs-common/components/lab-sandbox/InteractiveIcon';
import _t from 'i18n!nls/labs-common';

type PropsFromCaller = {
  courseId: string;
  itemId?: string;
  isPrimaryCallToAction?: boolean;
  className?: string;
  style?: React.CSSProperties;
  showForFreeTrial?: boolean;
};

type PropsFromConnectToRouter = {
  courseSlug: string;
};

type PropsFromStores = {
  courseBranchId?: string;
};

type DefaultProps = Required<Pick<PropsFromCaller, 'isPrimaryCallToAction'>>;

export type PropsToComponent = PropsFromCaller &
  PropsFromConnectToRouter &
  PropsFromWithCourseOwnership &
  PropsFromStores &
  DefaultProps;

const styles = StyleSheet.create({
  container: {
    border: '1px solid #eaeaea',
    padding: 24,
  },
  headerBar: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 12,
  },
  icon: {
    marginTop: -2,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
    marginRight: 14,
  },
  betaLabel: {
    backgroundColor: '#1f1f1f',
    borderRadius: 4,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    padding: 4,
    paddingBottom: 2,
    textTransform: 'uppercase',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionList: {
    paddingLeft: 22,
  },
  feedbackLink: {
    // Some page styles were overwriting these styles.
    color: '#2163B2 !important',
    fontWeight: 'bold',
    marginRight: 20,
    textDecoration: 'underline !important',
  },
  upgradeButton: {
    fontSize: 14,
  },
});

export const LabSandboxLauncher: React.FC<PropsToComponent> = ({
  courseId,
  courseSlug,
  courseBranchId,
  itemId,
  ownsCourse,
  isFreeTrial,
  showForFreeTrial,
  className,
  style,
  isPrimaryCallToAction = true,
}) => {
  if (
    !canUserAccessLabSandboxForCourseOrItem(courseId, courseBranchId, itemId, ownsCourse, isFreeTrial) ||
    (isFreeTrial && showForFreeTrial === false)
  ) {
    return null;
  }

  const sandboxConfig = getLabSandboxConfigurationForCourse(courseId);
  const languagesSpec = getLanguagesSpec(
    sandboxConfig?.computerLanguages,
    sandboxConfig?.computerLanguagesAreProgrammingLanguages
  );
  const labApplicationName = sandboxConfig?.labApplicationName;

  return (
    <TrackedDiv
      data-e2e="LabSandboxLauncher"
      trackingName="lab_sandbox_launcher"
      withVisibilityTracking
      trackClicks={false}
      {...css(styles.container, className, style)}
    >
      <Box {...css(styles.headerBar)}>
        <InteractiveIcon />

        <span {...css(styles.header)}>
          {_t('Coursera Lab Sandbox')}
          {isFreeTrial && <span color="red"> (free trial)</span>}
        </span>
        <span {...css(styles.betaLabel)}>{_t('Beta')}</span>
      </Box>

      <div {...css(styles.descriptionContainer)}>
        <ul {...css(styles.descriptionList)}>
          <li>
            <FormattedMessage
              message={_t("Easily launch Coursera's preconfigured environment for {languages}")}
              languages={languagesSpec}
            />
          </li>

          {labApplicationName ? (
            <li>
              <FormattedMessage
                message={_t(
                  'Get access to all dependencies (libraries and packages) for {labApplication}—no local software installation required'
                )}
                labApplication={labApplicationName}
              />
            </li>
          ) : (
            <li>
              <FormattedMessage
                message={_t(
                  'Get access to all development dependencies (libraries and packages)—no local software installation required'
                )}
              />
            </li>
          )}

          <li>
            <FormattedMessage
              message={_t('Practice {languages}, run test cases, and work on assignments from your browser')}
              languages={languagesSpec}
            />
          </li>
        </ul>
      </div>

      <Box justifyContent="between" alignItems="center">
        <LabSandboxLaunchButton courseSlug={courseSlug} isPrimaryCallToAction={isPrimaryCallToAction} />
      </Box>
    </TrackedDiv>
  );
};

type Stores = {
  CourseStore: CourseStoreClass;
  SessionStore: SessionStoreClass;
};

export default compose<PropsToComponent, PropsFromCaller>(
  connectToRouter<PropsFromConnectToRouter>((router) => ({
    courseSlug: router.params.courseSlug,
  })),

  connectToStores<PropsFromStores, PropsFromCaller, Stores>(
    ['CourseStore', 'SessionStore'],
    ({ CourseStore, SessionStore }) => {
      return {
        courseBranchId: SessionStore.getBranchId() || CourseStore.getCourseId(),
      };
    }
  ),

  withCourseOwnership
)(LabSandboxLauncher);
