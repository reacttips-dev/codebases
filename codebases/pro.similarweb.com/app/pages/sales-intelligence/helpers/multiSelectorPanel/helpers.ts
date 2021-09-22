import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import {
    setMultiSelectorPanelAccountItemConfig,
    setMultiSelectorPanelExcelItemConfig,
    setMultiSelectorPanelRemoveItemConfig,
} from "pages/sales-intelligence/sub-modules/common/store/action-creators";
import {
    DEFAULT_SELECT_PANEL_ACCOUNT_ITEM,
    DEFAULT_SELECT_PANEL_EXCEL_ITEM,
    DEFAULT_SELECT_PANEL_REMOVE_ITEM,
} from "pages/sales-intelligence/sub-modules/common/store/reducer";

export const getActionSetDefaultItemConfig = (active: TypeOfSelectors) => {
    switch (active) {
        case TypeOfSelectors.ACCOUNT:
            return () => setMultiSelectorPanelAccountItemConfig(DEFAULT_SELECT_PANEL_ACCOUNT_ITEM);
        case TypeOfSelectors.EXCEL:
            return () => setMultiSelectorPanelExcelItemConfig(DEFAULT_SELECT_PANEL_EXCEL_ITEM);
        default:
            return () => setMultiSelectorPanelRemoveItemConfig(DEFAULT_SELECT_PANEL_REMOVE_ITEM);
    }
};

export const getActionSetItemConfig = (active: TypeOfSelectors) => {
    switch (active) {
        case TypeOfSelectors.ACCOUNT:
            return setMultiSelectorPanelAccountItemConfig;
        case TypeOfSelectors.EXCEL:
            return setMultiSelectorPanelExcelItemConfig;
        default:
            return setMultiSelectorPanelRemoveItemConfig;
    }
};
