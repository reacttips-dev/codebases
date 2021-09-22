export function getExplicitLogonHeaders(
    smtp: string,
    prefixedId?: string
): { [headerName: string]: string } {
    return {
        'X-OWA-ExplicitLogonUser': smtp,
        'X-AnchorMailbox': prefixedId ? prefixedId : smtp,
    };
}
