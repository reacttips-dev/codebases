import type { AnalyticsOptions } from '../types/DatapointEnums';
import { isGulpOrBranchingValue, hasQueryStringParameter } from 'owa-querystring';
import { isTdsBox } from 'owa-config';

export default function isDevEnvironment(analyticsOptions: AnalyticsOptions): boolean {
    if (hasQueryStringParameter('teAnLoc')) {
        return false;
    }
    return isGulpOrBranchingValue || analyticsOptions?.isTesting || isTdsBox();
}
