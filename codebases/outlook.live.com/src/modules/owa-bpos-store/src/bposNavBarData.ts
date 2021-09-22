import getBposShellInfoNavBarDataOperation from 'owa-service/lib/operation/getBposShellInfoNavBarDataOperation';
import getBposShellInfoNavBarDataForBookingsOperation from 'owa-service/lib/operation/getBposShellInfoNavBarDataForBookingsOperation';
import type NavBarData from 'owa-service/lib/contract/NavBarData';
import { logUsage } from 'owa-analytics/lib/api/logUsage';

let navBarDataPromise: Promise<NavBarData | null> | undefined;
let navBarData: NavBarData | null;

export function getBposNavBarDataAsync(
    callingFunctionName: string,
    appName?: string,
    ignoreAuthError?: boolean
): Promise<NavBarData | null> {
    if (!navBarDataPromise) {
        const operation =
            appName === 'Bookings'
                ? getBposShellInfoNavBarDataForBookingsOperation
                : getBposShellInfoNavBarDataOperation;
        navBarDataPromise = operation({ authNeededOnUnAuthorized: !ignoreAuthError })
            .then(data => {
                logUsage(
                    'getBposNavBarDataAsync',
                    {
                        owa_1: callingFunctionName,
                        owa_2: 'Fetch succeeded',
                    },
                    { ring: 'Dogfood' }
                );

                return (navBarData = data);
            })
            .catch(error => {
                // set the promise to undefined here so we can try to call this again later
                navBarDataPromise = undefined;

                logUsage(
                    'getBposNavBarDataAsync',
                    {
                        owa_1: callingFunctionName,
                        owa_2: 'Fetch failure',
                        owa_3: error.message + ' - ' + error.stack,
                    },
                    { ring: 'Dogfood' }
                );

                return (navBarData = null);
            });
    }

    return navBarDataPromise;
}

export function getBposPromise(): Promise<NavBarData | null> | undefined {
    return navBarDataPromise;
}

export function getBposNavBarData(): NavBarData | null {
    return navBarData;
}
