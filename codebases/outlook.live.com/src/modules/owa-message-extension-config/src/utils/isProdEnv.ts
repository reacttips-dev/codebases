import { getLogicalRing } from 'owa-config';

/**
 * Method to check whether the current env is prod or not.
 * @returns boolean
 */
export default function isProdEnv(): boolean {
    return getLogicalRing() === 'WW';
}
