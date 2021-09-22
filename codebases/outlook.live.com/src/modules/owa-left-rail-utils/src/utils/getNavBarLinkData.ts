import type { OfficeApp } from '../store/schema/OfficeApp';
import type NavBarLinkData from 'owa-service/lib/contract/NavBarLinkData';
import { oneNoteAppName } from './LeftRailApp.locstring.json';
import { appWord } from 'owa-locstrings/lib/strings/appword.locstring.json';
import { appExcel } from 'owa-locstrings/lib/strings/appexcel.locstring.json';
import { appPowerPoint } from 'owa-locstrings/lib/strings/apppowerpoint.locstring.json';
import { isConsumer } from 'owa-session-store';
import loc from 'owa-localize';
import type NavBarData from 'owa-service/lib/contract/NavBarData';
import getAppHostAppPath from '../getAppHostAppPath';
import { isEdu } from 'owa-bpos-utils';

const wordUrl =
    'https://www.office.com/launch/word?auth=1&from=OWAPromo&WT.mc_id=PROD_OL-Web_InApp_LeftNav_FreeOfficeBarWord';
const excelUrl =
    'https://www.office.com/launch/excel?auth=1&from=OWAPromo&WT.mc_id=PROD_OL-Web_InApp_LeftNav_FreeOfficeBarExcel';
const powerpointUrl =
    'https://www.office.com/launch/powerpoint?auth=1&from=OWAPromo&WT.mc_id=PROD_OL-Web_InApp_LeftNav_FreeOfficeBarPPT';
const oneNoteUrl = 'https://www.office.com/launch/onenote?auth=1';

const WORD_WORKLOAD_ID = 'ShellWordOnline';
const EXCEL_WORLOAD_ID = 'ShellExcelOnline';
const POWERPOINT_WORKLOAD_ID = 'ShellPowerPointOnline';
const YAMMER_WORKLOAD_ID = 'ShellYammer';
const ONENOTE_WORKLOAD_ID = 'ShellOneNoteOnline';
const BOOKINGS_WORKLOAD_ID = 'ShellBookings';

export function getNavBarLinkData(officeApp: OfficeApp, navBarData: NavBarData): NavBarLinkData {
    if (isConsumer()) {
        // getBposNavBarData does not work in consumer
        return getNavBarLinkDataForConsumer(officeApp);
    }

    if (!navBarData?.WorkloadLinks) {
        return null;
    }
    let dataDirectory = navBarData.WorkloadLinks;

    let workloadId: string | null = null;
    switch (officeApp) {
        case 'OrgExplorer':
            return isEdu()
                ? null
                : {
                      Url: getAppHostAppPath(officeApp),
                      Text: 'Org Explorer',
                      Title: 'Org Explorer',
                  };
        case 'Word':
            workloadId = WORD_WORKLOAD_ID;
            break;
        case 'Excel':
            workloadId = EXCEL_WORLOAD_ID;
            break;
        case 'Powerpoint':
            workloadId = POWERPOINT_WORKLOAD_ID;
            break;
        case 'OneNote':
            workloadId = ONENOTE_WORKLOAD_ID;
            break;
        case 'Yammer':
            workloadId = YAMMER_WORKLOAD_ID;
            break;
        case 'Bookings':
            workloadId = BOOKINGS_WORKLOAD_ID;
            dataDirectory = navBarData.AppsLinks;
            break;
        default:
            throw new Error('No url for office app ' + officeApp);
    }

    const [workload] = dataDirectory.filter(workload => workload.Id === workloadId);

    return workload;
}

function getNavBarLinkDataForConsumer(app: OfficeApp): NavBarLinkData {
    let url;
    let displayName;

    switch (app) {
        case 'Word':
            url = wordUrl;
            displayName = appWord;
            break;
        case 'Excel':
            url = excelUrl;
            displayName = appExcel;
            break;
        case 'Powerpoint':
            url = powerpointUrl;
            displayName = appPowerPoint;
            break;
        case 'OneNote':
            url = oneNoteUrl;
            displayName = oneNoteAppName;
            break;
        default:
            return null;
    }

    return {
        Url: url,
        Text: loc(displayName),
        Title: loc(displayName),
    };
}
