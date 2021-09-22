export const MAILTO_HANDLER_IGNORED_COUNT: string = 'mailtoHandlerIgnoredCount';
export const MAILTO_HANDLER_MAX_IGNORED_COUNT: number = 14;
export const LOCAL_STORAGE_TTL: number = 60 * 1000 * 60 * 24 * 7;
/**
  belew are tokens used to test the experimental API for url protocol handler registration for PWAs
  https://docs.microsoft.com/en-us/microsoft-edge/origin-trials
*/
export const originTrialTokenSet = {
    'https://outlook-sdf.office.com':
        'AoxP1SeWYDYaKSqgQMEvcNV6+kiHTEA8E7F9FjDjLwt7H0aRzgY65MUDyudqsVVEU4fc3e3gWdo0W2cPQO6iAKYAAAB6eyJvcmlnaW4iOiJodHRwczovL291dGxvb2stc2RmLm9mZmljZS5jb206NDQzIiwiaXNTdWJkb21haW4iOnRydWUsImZlYXR1cmUiOiJQYXJzZVVybFByb3RvY29sSGFuZGxlciIsImV4cGlyeSI6MTYyODcxMDg1NX0=',
    'https://outlook.office.com':
        'ArohrU+3nrD+36RWgvyIVASpPMV5qmL2aBKg/vdjAPsb74oW+ljPFdkdIMWDND2sIN67kbxraiSt5lnF+SyovEMAAAB2eyJvcmlnaW4iOiJodHRwczovL291dGxvb2sub2ZmaWNlLmNvbTo0NDMiLCJpc1N1YmRvbWFpbiI6dHJ1ZSwiZmVhdHVyZSI6IlBhcnNlVXJsUHJvdG9jb2xIYW5kbGVyIiwiZXhwaXJ5IjoxNjI4NzEwODgxfQ==',
    'https://outlook-sdf.live.com':
        'AuUoPvZX8c3JfzbLy7x7DfhA112kexySjZL3RNuqj+tiOK9dItPzWZENDwOa8vH0W0YvqCu1XsmKAGqbhVGLBakAAAB4eyJvcmlnaW4iOiJodHRwczovL291dGxvb2stc2RmLmxpdmUuY29tOjQ0MyIsImlzU3ViZG9tYWluIjp0cnVlLCJmZWF0dXJlIjoiUGFyc2VVcmxQcm90b2NvbEhhbmRsZXIiLCJleHBpcnkiOjE2Mjg3MTI3MTV9',
    'https://outlook.live.com':
        'AuLB2GUe2LClDSVyaFtvIFySHIjhldxQuohbvtoqo1W8RQTQRTDuyE0y8lwoDKsUj50ta4qmsIpdjcgPzluIzIUAAAB0eyJvcmlnaW4iOiJodHRwczovL291dGxvb2subGl2ZS5jb206NDQzIiwiaXNTdWJkb21haW4iOnRydWUsImZlYXR1cmUiOiJQYXJzZVVybFByb3RvY29sSGFuZGxlciIsImV4cGlyeSI6MTYyODcxMjczMn0=',
};

export const enum OperationType {
    TryItNow = 'MailToBannerTryItNow',
    Close = 'MailToBannerClose',
    AskAgainLater = 'MailToBannerAskAgainLater',
}
