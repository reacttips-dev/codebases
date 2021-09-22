import URI from 'jsuri';
import _ from 'lodash';
import { stringKeyToTuple } from 'js/lib/stringKeyTuple';

import API from 'bundles/phoenix/lib/apiWrapper';
import { VERB } from 'bundles/authoring/common/utils/permissions/permissionFeatures';

import getNavigationFeatures from 'bundles/authoring/navigation/utils/navigationFeaturePermissions';
import type {
  Feature,
  FeaturePermissions,
  InputFeatures,
  UserPermissions,
  ScopedFeaturePermissions,
  ScopedFeatures,
} from 'bundles/teach-course/utils/types';

let cachedFeaturePermissions: ScopedFeaturePermissions;
let cachedCourseId: string;

export const PERMISSION = {
  GRANTED: 'GRANTED',
  FORBIDDEN: 'FORBIDDEN',
};

function isCustomVerb(verb: string): boolean {
  return ![VERB.CREATE, VERB.READ, VERB.UPDATE, VERB.DELETE, VERB.PUBLISH].includes(verb);
}

function generateFeatureKey(name: string, verb: string, instanceId: string): string {
  return isCustomVerb(verb)
    ? `(instanceId~${instanceId},name~${name},verb~customVerb!~${verb})`
    : `(instanceId~${instanceId},name~${name},verb~${verb})`;
}

export function hasFeaturePermission(
  name: string,
  verb: string,
  instanceId: string,
  permissions: UserPermissions
): boolean {
  const featureKey = generateFeatureKey(name, verb, instanceId);
  return !!(permissions[featureKey] && permissions[featureKey] === PERMISSION.GRANTED);
}

// Returns true if featurePermissions do not exist (!featurePermissions), meaning no feature permissions
// were retrieved as course is not behind the feature permissions epic.
// Otherwise checks permissions on the input feature name and verb
export function hasAccess(name: string, verb: string, featurePermissions?: FeaturePermissions): boolean {
  return !featurePermissions || (featurePermissions[name] && featurePermissions[name][verb]);
}

export function generateFeaturePermissions(
  features: InputFeatures,
  permissions: UserPermissions
): ScopedFeaturePermissions {
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
          permissions
        );
      });
    });
  });

  return featurePermissions;
}

// TODO: replace routeAuthorizationPromise during react-router v4 migration
export function routeAuthorizationPromise(
  userId: number,
  courseSlug: string,
  authorizer?: (x0: FeaturePermissions) => boolean
): Promise<{ isAuthorized: boolean; error?: Error }> {
  if (cachedFeaturePermissions && cachedCourseId) {
    return Promise.resolve({ isAuthorized: !!(authorizer && authorizer(cachedFeaturePermissions[cachedCourseId])) });
  } else {
    const authoringUserCoursePermissionsAPI = API(`/api/authoringUserCoursePermissions.v1/${userId}~${courseSlug}`, {
      type: 'rest',
    });
    // wrap the response in a standard Promise so the return type is consistent
    return Promise.resolve(authoringUserCoursePermissionsAPI.get(new URI().toString()))
      .then((response) => {
        // the id here is of format userId~courseId
        const courseId = stringKeyToTuple(response.elements[0]?.id ?? '')?.[1];
        const navigationFeatures = getNavigationFeatures(courseId);
        // only cache response on the client
        if (typeof window !== 'undefined') {
          cachedCourseId = courseId;
          cachedFeaturePermissions = generateFeaturePermissions(navigationFeatures, response.elements[0].permissions);
        }
        return { isAuthorized: !!(authorizer && authorizer(cachedFeaturePermissions[courseSlug])) };
      })
      .catch((error: Error) => {
        return { isAuthorized: false, error };
      });
  }
}
