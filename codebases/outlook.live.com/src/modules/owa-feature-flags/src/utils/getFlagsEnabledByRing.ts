import { ringEnabled } from '../store/features/ringDefinitions';
import type { LogicalRing } from 'owa-config';

// let's get all the features that define a ring and return an object
// if that ring matches the ring that is passed in
export function getFlagsEnabledByRing(ring: LogicalRing) {
    return Object.keys(ringEnabled).reduce((agg, f) => {
        agg[f.toLowerCase()] = ringEnabled[f].ring.indexOf(ring) > -1;
        return agg;
    }, {});
}
