import React from "react";
import { compose } from "redux";
import { SignalsTab, SignalWithId } from "../../types";
import { SignalsMainDropdownContainerProps } from "./SignalsMainDropdownContainer";

// Hooks
import { useTranslation } from "components/WithTranslation/src/I18n";
import { useOnOutsideClick } from "pages/sales-intelligence/hooks/useOnOutsideClick";
import useStaticListTrackingService from "pages/sales-intelligence/hooks/useStaticListTrackingService";
import { useSalesSettingsHelper } from "../../../../../../sales-intelligence/services/salesSettingsHelper";

// Constants
import {
    SIGNALS_DROPDOWN_TITLE,
    SIGNALS_ALL_COUNTRIES_TAB,
    SIGNALS_OTHER_COUNTRIES_TAB,
    SIGNALS_CURRENT_COUNTRY_TAB,
    SIGNALS_DROPDOWN_TOOLTIP,
} from "../../constants";

// Helpers
import {
    getToSignalWithLabelMapper,
    getItemsGroupsByMostUsed,
    getTranslatedSortedSignals,
    addTotalToLabel,
} from "../../helpers";

// Components
import DropdownButton from "pages/workspace/sales/components/custom-dropdown/DropdownButton/DropdownButton";
import SignalsDropdownContent from "../SignalsDropdownContent/SignalsDropdownContent";

export type SignalsMainDropdownProps = {
    disabled?: boolean;
    className?: string;
    selected: SignalWithId["id"] | null;
    selectedText: string;
    mostUsedSignalsKeys: string[];
    onCloseItem(): void;
    onChange(id: SignalWithId["id"]): void;
};

const SignalsMainDropdown: React.FC<
    SignalsMainDropdownContainerProps & SignalsMainDropdownProps
> = ({
    selected,
    selectedText,
    onChange,
    onCloseItem,
    selectTab,
    signals,
    selectedTab,
    restCountriesSignals,
    mostUsedSignalsKeys,
    currentCountrySignalsTotal,
    restCountriesSignalsTotal,
    className = null,
    disabled = false,
}) => {
    const translate = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const salesSettings = useSalesSettingsHelper();
    const userHasOneCountry = salesSettings.hasSingleCountryAllowed();
    const staticListTrackingService = useStaticListTrackingService();
    const toSignalWithLabelMapper = React.useCallback(
        compose(addTotalToLabel, getToSignalWithLabelMapper(translate)),
        [translate],
    );

    const mainSignalsGroup = React.useMemo(() => {
        return getItemsGroupsByMostUsed(
            mostUsedSignalsKeys,
            getTranslatedSortedSignals(toSignalWithLabelMapper, search, signals),
        );
    }, [search, signals, mostUsedSignalsKeys, toSignalWithLabelMapper]);

    const restSignalsGroup = React.useMemo(() => {
        return getItemsGroupsByMostUsed(
            mostUsedSignalsKeys,
            getTranslatedSortedSignals(toSignalWithLabelMapper, search, restCountriesSignals),
        );
    }, [search, restCountriesSignals, mostUsedSignalsKeys, toSignalWithLabelMapper]);

    const tabs: SignalsTab[] = [
        {
            title: translate(SIGNALS_CURRENT_COUNTRY_TAB),
            signalsGroup: mainSignalsGroup,
            total: currentCountrySignalsTotal,
        },
        {
            title: translate(
                userHasOneCountry ? SIGNALS_OTHER_COUNTRIES_TAB : SIGNALS_ALL_COUNTRIES_TAB,
            ),
            signalsGroup: restSignalsGroup,
            total: restCountriesSignalsTotal,
        },
    ];
    const noSignalsAvailable = tabs.every((t) => t.total === 0);

    const handleItemSelection = (id: SignalWithId["id"], tabIndex: number) => {
        staticListTrackingService.trackSignalDDValueSelected(tabs[tabIndex]?.title, id);
        setOpen(false);
        onChange(id);
    };

    const handleButtonClick = () => {
        setOpen(true);
        staticListTrackingService.trackSignalDDOpened();
    };

    const handleOutsideClick = React.useCallback(() => {
        if (open) {
            setOpen(false);
            staticListTrackingService.trackSignalDDClosed(tabs[selectedTab]?.total);
        }
    }, [open]);

    useOnOutsideClick(className, handleOutsideClick);

    return (
        <div className={className}>
            <DropdownButton
                onClose={onCloseItem}
                onClick={handleButtonClick}
                selectedText={selectedText}
                disabled={disabled || noSignalsAvailable}
                buttonText={translate(SIGNALS_DROPDOWN_TITLE)}
                tooltipText={translate(SIGNALS_DROPDOWN_TOOLTIP)}
            />
            <SignalsDropdownContent
                open={open}
                tabs={tabs}
                search={search}
                selected={selected}
                onSearch={setSearch}
                selectedTab={selectedTab}
                onSelect={handleItemSelection}
                itemsLocked={userHasOneCountry}
                onTabSelect={selectTab}
            />
        </div>
    );
};

export default SignalsMainDropdown;
