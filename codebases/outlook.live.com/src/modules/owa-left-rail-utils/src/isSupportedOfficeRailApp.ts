import { isFeatureEnabled } from 'owa-feature-flags';
import { isBrowserIE } from 'owa-user-agent/lib/userAgent';

const supportedOfficeRailApps = [
    'Yammer',
    'Bookings',
    'OrgExplorer',
    'Y29tLm1pY3Jvc29mdC50ZWFtc3BhY2UudGFiLnBsYW5uZXIjIzEuMi4zIyNQdWJsaXNoZWQ=', // Planner
    'MmUzYTYyOGQtNmY1NC00MTAwLTllN2EtZjAwYmMzNjIxYTg1IyMxLjAuOCMjUHVibGlzaGVk', // Learning
    'ZGI1ZTU5NzAtMjEyZi00NzdmLWEzZmMtMjIyN2RjNzc4MmJmIyMyLjIuMyMjUHVibGlzaGVk', // Yammer
];

export default function isSupportedOfficeRailApp(appName: string) {
    return (
        !isBrowserIE() &&
        isFeatureEnabled('tri-officeRailHost') &&
        supportedOfficeRailApps.includes(appName)
    );
}
