import getPrimaryFromAddress from './getPrimaryFromAddress';
import { isSameStringIgnoreCase } from '../isSelf';

// S/MIME option should be disabled if the From well is showing an address that
// is not the user's primary identity
export default function isPrimaryAddressInFromWell(addressInFromWell: string): boolean {
    return isSameStringIgnoreCase(addressInFromWell, getPrimaryFromAddress());
}
