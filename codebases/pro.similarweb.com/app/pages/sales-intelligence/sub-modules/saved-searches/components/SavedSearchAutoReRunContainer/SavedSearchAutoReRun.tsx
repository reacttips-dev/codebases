import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SavedSearchType } from "../../types";
import {
    SAVE_SEARCH_RE_RUN_TOOLTIP_DISABLED_LIMIT,
    SAVE_SEARCH_RE_RUN_TOOLTIP_DISABLED_TRIAL,
} from "pages/workspace/sales/constants/constants";
import { StyledSavedSearchReRunSwitch } from "pages/workspace/sales/saved-searches/SavedSearchReRunSwitch/styles";
import { usePrevious } from "components/hooks/usePrevious";
import { getSearchAutoRerunEnabled, getSearchRerunSuccessKey } from "../../helpers";
import { SavedSearchAutoReRunContainerProps } from "./SavedSearchAutoReRunContainer";

export type SavedSearchAutoRerunProps = SavedSearchAutoReRunContainerProps & {
    currentSavedSearch: SavedSearchType;
};

const SavedSearchAutoReRun = (props: SavedSearchAutoRerunProps) => {
    const {
        currentSavedSearch,
        autoRerunLimit,
        autoRerunAvailable,
        toggleAutoReRun,
        searchUpdating,
        searchUpdateError,
        showSuccessToast,
        showErrorToast,
    } = props;
    const translate = useTranslation();
    const isActiveSwitch = getSearchAutoRerunEnabled(currentSavedSearch);
    const prevActive = usePrevious(isActiveSwitch);
    const prevUpdating = usePrevious(searchUpdating);

    const disabledReasonText = React.useMemo(() => {
        if (autoRerunLimit === 0) {
            // TODO: Add new "si." translation keys
            return translate(SAVE_SEARCH_RE_RUN_TOOLTIP_DISABLED_TRIAL);
        }

        return translate(SAVE_SEARCH_RE_RUN_TOOLTIP_DISABLED_LIMIT, {
            number: autoRerunLimit,
        });
    }, [autoRerunLimit]);

    const handleSwitchToggle = React.useCallback(
        (toggled: boolean) => {
            toggleAutoReRun(currentSavedSearch, toggled);
        },
        [toggleAutoReRun, currentSavedSearch],
    );

    const doneUpdating = React.useMemo(() => {
        return (
            typeof prevUpdating !== "undefined" &&
            prevUpdating !== searchUpdating &&
            !searchUpdating
        );
    }, [searchUpdating]);

    // Show success/error toast on rerun update
    React.useEffect(() => {
        if (prevActive === isActiveSwitch) {
            return;
        }

        if (doneUpdating) {
            if (!searchUpdateError) {
                showSuccessToast(translate(getSearchRerunSuccessKey(currentSavedSearch)));
            } else {
                showErrorToast(translate("si.pages.search_result.rerun.failure"));
            }
        }
    }, [doneUpdating, currentSavedSearch]);

    return (
        <StyledSavedSearchReRunSwitch
            toggled={isActiveSwitch}
            onToggle={handleSwitchToggle}
            disabledReasonText={disabledReasonText}
            disabled={!autoRerunAvailable && !isActiveSwitch}
        />
    );
};

export default SavedSearchAutoReRun;
