const emailAddressRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default function isValidEmailAddress(emailAddress: string): boolean {
    return emailAddressRegex.test(emailAddress);
}
