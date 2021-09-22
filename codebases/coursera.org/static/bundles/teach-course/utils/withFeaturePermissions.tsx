/**
 * Example Usage:
 * class MyComponent extends React.Component {
 *   render() {
 *     const { feature1, feature2 } = this.props.featurePermissions;
 *       return (
 *         <div>
 *           <Component1 canExport={feature1.export} />
 *           <Component2 canRead={feature2.read} canUpdate={feature2.update}/>
 *         </div>
 *       );
 *   }
 * }
 *
 * export default compose(
 *   withFeaturePermissions(props => ({
 *     featurePermissions: {
 *       courseId: props.courseId,
 *       features: {
 *         feature1: {
 *           name: 'authoringCourseGrades',
 *           verbs: ['export'],
 *           instanceId: props.courseId,
 *           scopeType: 'COURSE',
 *         },
 *         feature2: {
 *           name: 'authoringCourseMessages',
 *           verbs: ['read', 'update],
 *           instanceId: props.courseId,
 *           scopeType: 'COURSE',
 *         },
 *       },
 *   })),
 *   ...
 * )(MyComponent);
 *
 * Authorization currently only supports 'COURSE' scoped permissions,
 * and single featurePermission object inputs
 * {instanceId} and {scopeType} included for forward compatibility
 *
 * In future we will support multiple feature object inputs:
 *
 * withFeaturePermissions(props => ({
 *    coursefeaturePermissions: {
 *      courseId: props.course.id,
 *      features: getCourseNavigationFeatures(props.course.id),
 *    },
 *    branchfeaturePermissions: {
 *      courseId: props.course.id,
 *      features: getBranchNavigationFeatures(props.branch.id),
 *    },
 *  }))
 *
 *
 */

import type React from 'react';
import Naptime from 'bundles/naptimejs';
import _ from 'underscore';
import user from 'js/lib/user';
import { compose, mapProps, withProps } from 'recompose';
import waitForProps from 'js/lib/waitForProps';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import AuthoringUserCoursePermissions from 'bundles/naptimejs/resources/authoringUserCoursePermissions.v1';

import { hasFeaturePermission } from 'bundles/teach-course/utils/featureAuthorization';

import type {
  CourseInputFunction,
  InputFeatures,
  Feature,
  ScopedFeaturePermissions,
  ScopedFeatures,
  AuthoringUserPermissions,
} from 'bundles/teach-course/utils/types';

// See https://github.com/webedx-spark/infra-services/blob/main/services/authoring/app/org/coursera/authoring/authorization/enrichment/RoleFeaturesMappings.scala
// for defined permissions
const getFeaturePermissions = (input: CourseInputFunction) => (Component: React.ComponentType<any>) =>
  compose(
    mapProps((props: any) => {
      const inputProps = input(props);
      const permissionsReturnKey = Object.keys(inputProps)[0];

      return {
        ...props,
        ...inputProps[permissionsReturnKey],
        permissionsReturnKey,
      };
    }),
    Naptime.createContainer(
      ({ courseId, gracefulDegradation }: { courseId: string; gracefulDegradation: boolean }) => ({
        authoringUserPermissions: AuthoringUserCoursePermissions.get(`${user.get().id}~${courseId}`, {
          required: !gracefulDegradation,
        }),
      })
    ),
    mapProps(
      ({
        features,
        authoringUserPermissions,
        permissionsReturnKey,
        courseId,
        ...rest
      }: {
        features: InputFeatures;
        authoringUserPermissions?: AuthoringUserPermissions;
        courseId: string;
        permissionsReturnKey: string;
      }) => {
        if (!authoringUserPermissions) {
          return {
            ...rest,
          };
        }

        const featurePermissions: ScopedFeaturePermissions = {};
        _.each(features, (scopedFeatures: ScopedFeatures) => {
          featurePermissions[scopedFeatures.instanceId] = {};
          _.each(scopedFeatures.features, (feature: Feature) => {
            featurePermissions[scopedFeatures.instanceId][feature.name] = {};
            _.each(feature.verbs, (verb: string) => {
              featurePermissions[scopedFeatures.instanceId][feature.name][verb] = hasFeaturePermission(
                feature.name,
                verb,
                scopedFeatures.instanceId,
                authoringUserPermissions.permissions
              );
            });
          });
        });
        return {
          courseId,
          featurePermissions,
          permissionsReturnKey,
          ...rest,
        };
      }
    )
  )(Component);

/**
 * Only get permissions scoped to the `courseId`, returning type `FeaturePermissions` instead
 * of returning type `ScopedFeaturePermissions`
 */
export const withCourseFeaturePermissions = (input: CourseInputFunction) => (Component: React.ComponentType<any>) =>
  compose(
    getFeaturePermissions(input),
    waitForProps(['courseId', 'featurePermissions']),
    // @ts-expect-error TSMIGRATION
    mapProps(({ courseId, featurePermissions, permissionsReturnKey, ...rest }) => ({
      courseId,
      [permissionsReturnKey]: featurePermissions[courseId],
      ...rest,
    }))
  )(Component);

/**
 * Produces similar behavior to `withCourseFeaturePermissions` but handles errors differently.
 * Unlike `withCourseFeaturePermissions`, this HOC does not wait for featurePermissions to be populated before rendering
 * the rest of the tree.
 */
export const withOptionalCourseFeaturePermissions = (input: CourseInputFunction) => (
  Component: React.ComponentType<any>
) =>
  compose(
    withProps(() => ({
      gracefulDegradation: true,
    })),
    getFeaturePermissions(input),
    // @ts-expect-error TSMIGRATION
    mapProps(({ courseId, featurePermissions, permissionsReturnKey, ...rest }) => ({
      courseId,
      [permissionsReturnKey]: featurePermissions && featurePermissions[courseId],
      ...rest,
    }))
  )(Component);

/**
 * Returns all feature permissions with type ScopedFeaturePermissions related to this course
 */
const withFeaturePermissions = (input: CourseInputFunction) => (Component: React.ComponentType<any>) =>
  compose(
    getFeaturePermissions(input),
    waitForProps(['courseId', 'featurePermissions']),
    // @ts-expect-error TSMIGRATION
    mapProps(({ courseId, featurePermissions, permissionsReturnKey, ...rest }) => ({
      courseId,
      [permissionsReturnKey]: featurePermissions,
      ...rest,
    }))
  )(Component);

export default withFeaturePermissions;
