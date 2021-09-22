import type { OfficeAppData } from './store/schema/OfficeApp';
import type { IOverflowSetItemProps } from '@fluentui/react/lib/OverflowSet';
import * as trace from 'owa-trace';
import { Module } from 'owa-workloads';
import isSupportedOfficeRailApp from './isSupportedOfficeRailApp';
import onOfficeAppClick from './actions/onOfficeAppClick';
import getSelectedOfficeRailApp from './selectors/getSelectedOfficeRailApp';
import getAppHostAppPath from './getAppHostAppPath';
import { default as OrganizationRegular } from 'owa-fluent-icons-svg/lib/icons/OrganizationRegular';

import EXCEL_SVG from './resources/Excel_16x.svg';
import POWERPOINT_SVG from './resources/PowerPoint_16x.svg';
import WORD_SVG from './resources/Word_16x.svg';
import ONENOTE_SVG from './resources/OneNote_16x.svg';
import YAMMER_SVG from './resources/yammer_16x.svg';
import BOOKINGS_SVG from './resources/bookings_16x.svg';

export default function getOfficeAppItemDisplayProperties(
    appData: OfficeAppData,
    currentlySelectedModule: Module
): IOverflowSetItemProps {
    let svgPath;
    let iconName;
    let iconProps;

    const app = appData.app;
    switch (app) {
        case 'OrgExplorer':
            iconName = OrganizationRegular;
            break;
        case 'Word':
            svgPath = WORD_SVG;
            break;
        case 'Excel':
            svgPath = EXCEL_SVG;
            break;
        case 'Powerpoint':
            svgPath = POWERPOINT_SVG;
            break;
        case 'OneNote':
            svgPath = ONENOTE_SVG;
            break;
        case 'Yammer':
            svgPath = YAMMER_SVG;
            break;
        case 'Bookings':
            svgPath = BOOKINGS_SVG;
            break;
        default:
            trace.errorThatWillCauseAlert('Svg does not exist for app ' + appData.displayText);
            svgPath = '';
            break;
    }

    const url = isSupportedOfficeRailApp(app) ? getAppHostAppPath(app) : appData.url;
    iconProps = iconName
        ? { iconName: iconName }
        : {
              imageProps: {
                  src: svgPath,
                  width: 16,
                  height: 16,
                  shouldFadeIn: false,
              },
          };

    return {
        key: app,
        text: appData.displayText,
        ariaLabel: appData.title,
        app: app,
        url: url,
        iconProps: iconProps,
        onClick: () => {
            onOfficeAppClick(app, currentlySelectedModule);
        },
        isSelected:
            getSelectedOfficeRailApp() === app && currentlySelectedModule === Module.AppHost,
        renderAsButton: isSupportedOfficeRailApp(app),
        openInNewTab: true,
    };
}
