import { OwaCachePolicyMap } from 'owa-lazy-cache-policy';
import { lazySampleResultTypePolicy } from 'sampleresult-type-policy';

export const policies: OwaCachePolicyMap = {
    SampleResult: lazySampleResultTypePolicy,
};
