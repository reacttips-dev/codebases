import isValidRecipientAddress from './isValidRecipientAddress';
import getDisplayNameAndAddressFromRecipientString from './getDisplayNameAndAddressFromRecipientString';

export default function isValidAddressWithOptionalDisplayName(value: string) {
    const parsedNameAndAddress = getDisplayNameAndAddressFromRecipientString(value);
    return isValidRecipientAddress(parsedNameAndAddress.address);
}
