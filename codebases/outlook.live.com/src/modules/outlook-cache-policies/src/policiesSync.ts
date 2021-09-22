import { policies as sample } from './policies/sample';
import { OwaCachePolicyMap } from 'owa-lazy-cache-policy';
import merge from 'lodash-es/merge';

export const cachePolicies: OwaCachePolicyMap = merge({}, sample);
