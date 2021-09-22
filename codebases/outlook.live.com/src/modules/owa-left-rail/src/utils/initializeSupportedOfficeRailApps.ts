import type { OfficeApp, OfficeAppData } from 'owa-left-rail-utils/lib/store/schema/OfficeApp';
import type NavBarLinkData from 'owa-service/lib/contract/NavBarLinkData';
import { getNavBarLinkData } from 'owa-left-rail-utils/lib/utils/getNavBarLinkData';
import addSupportedAppsToStore from 'owa-left-rail-utils/lib/mutators/addSupportedAppsToStore';
import type NavBarData from 'owa-service/lib/contract/NavBarData';
import { getBposNavBarData, getBposPromise } from 'owa-bpos-store';
import { isFeatureEnabled } from 'owa-feature-flags';

// Makes call to getBposNavBarData to get the supported apps for this mailbox
export default async function initializeSupportedOfficeRailApps() {
    const leftRailApps: OfficeApp[] = [
        'Word',
        'Excel',
        'Powerpoint',
        'OneNote',
        'Yammer',
        'Bookings',
    ];

    if (!getBposNavBarData()) {
        await getBposPromise();
    }

    if (isFeatureEnabled('tri-officeRailHost')) {
        leftRailApps.unshift('OrgExplorer');
    }

    const navBarData: NavBarData = getBposNavBarData();

    const appData: OfficeAppData[] = leftRailApps
        .map(app => {
            const navBarLinkData: NavBarLinkData = getNavBarLinkData(app, navBarData);
            if (navBarLinkData) {
                return {
                    app: app,
                    displayText: navBarLinkData.Text,
                    title: navBarLinkData.Title,
                    url: navBarLinkData.Url,
                };
            }
            return null;
        })
        .filter(data => !!data);

    if (appData?.length > 0) {
        addSupportedAppsToStore(appData);
    }
}
