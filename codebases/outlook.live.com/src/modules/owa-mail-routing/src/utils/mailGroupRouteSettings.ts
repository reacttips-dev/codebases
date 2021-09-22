const emailAddressRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i;

export interface MailGroupRouteParameters {
    groupDomain: string;
    groupAlias: string;
    actionId?: string;
    rowId?: string;
}

export function ensureValidGroupSmtpAddress(parameters: MailGroupRouteParameters): string {
    if (!parameters.groupAlias || !parameters.groupDomain) {
        return null;
    }

    const groupSmtp = parameters.groupAlias + '@' + parameters.groupDomain;

    if (!isValidEmailAddress(groupSmtp)) {
        return null;
    }

    return groupSmtp;
}

function isValidEmailAddress(emailAddress: string): boolean {
    // TODO: remove it from here when VSO:1041 is fixed
    return emailAddressRegex.test(emailAddress);
}
