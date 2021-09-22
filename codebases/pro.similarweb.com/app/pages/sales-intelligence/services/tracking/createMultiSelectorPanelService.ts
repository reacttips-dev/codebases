import {
    DropdownListItem,
    TypeOfListItem,
    TypeOfSelectors,
} from "pages/sales-intelligence/common-components/MultiSelector/types";
import { CLICK, CLOSE, SHOW_OPTIONS } from "pages/sales-intelligence/constants/tracking";

const createMultiSelectorPanelTrackingService = (
    track: (category: string, action: string, name: string) => void,
) => {
    const getTrackingEventNameByListItemType = (selectedListItem: DropdownListItem): string => {
        if (selectedListItem.type === TypeOfListItem.MANUAL) {
            return "manual selection";
        }
        return `${selectedListItem.type.toLowerCase()} ${selectedListItem.value}`;
    };

    const getTrackingOpenEventNameByOption = (option: TypeOfSelectors): string => {
        if (TypeOfSelectors.ACCOUNT === option) {
            return "save to my lists options";
        }
        if (TypeOfSelectors.EXCEL === option) {
            return "export options";
        }
        if (TypeOfSelectors.DELETE === option) {
            return "remove from lists";
        }
    };

    const getTrackingCloseEventNameByOption = (option: TypeOfSelectors): string => {
        if (TypeOfSelectors.ACCOUNT === option) {
            return "save to my lists";
        }
        if (TypeOfSelectors.EXCEL === option) {
            return "export options";
        }
        if (TypeOfSelectors.DELETE === option) {
            return "delete";
        }
    };

    return {
        trackMultiSelectorClose(option: TypeOfSelectors) {
            track("multi select actions", CLOSE, `${getTrackingCloseEventNameByOption(option)}`);
        },
        trackMultiSelectorOpen(option: TypeOfSelectors) {
            track(
                "multi select actions",
                SHOW_OPTIONS,
                `${getTrackingOpenEventNameByOption(option)}`,
            );
        },
        trackMultiSelectorExportClick(quota: number, value: DropdownListItem) {
            track(
                "multi select actions",
                CLICK,
                `export/${quota}/${getTrackingEventNameByListItemType(value)}`,
            );
        },
        trackMultiSelectorSaveToListClick(quota: number, value: DropdownListItem) {
            track(
                "multi select actions",
                CLICK,
                `save to list/${quota}/${getTrackingEventNameByListItemType(value)}`,
            );
        },
        trackMultiSelectorRemoveClick(domains: number, selectedDomains: number) {
            track("multi select actions", CLICK, `remove from list/${domains}/${selectedDomains}`);
        },
    };
};

export default createMultiSelectorPanelTrackingService;
