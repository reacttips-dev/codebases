import React from "react";
import { TabPanel, TabList, Tab, Tabs } from "@similarweb/ui-components/dist/tabs";
import { SignalsTab, SignalWithId } from "../../types";
import { DropdownItemId } from "pages/workspace/sales/components/custom-dropdown/types";

// Hooks
import useUnlockModal from "custom-hooks/useUnlockModal";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useStaticListTrackingService from "pages/sales-intelligence/hooks/useStaticListTrackingService";

// Constants
import { SIGNALS_DROPDOWN_PLACEHOLDER } from "../../constants";

// Components
import SignalsTabPanel from "../SignalsTabPanel/SignalsTabPanel";

// Styles
import { StyledSignalsDropdownContent } from "./styles";

type SignalsDropdownContentProps = {
    open: boolean;
    tabs: SignalsTab[];
    className?: string;
    selected: SignalWithId["id"] | null;
    selectedTab: number;
    search: string;
    itemsLocked: boolean;
    onSearch(s: string): void;
    onTabSelect(index: number): void;
    onSelect(id: SignalWithId["id"], index: number): void;
};

const SignalsDropdownContent: React.FC<SignalsDropdownContentProps> = ({
    open,
    tabs,
    selected,
    selectedTab,
    search,
    itemsLocked,
    onSearch,
    onSelect,
    onTabSelect,
}) => {
    const translate = useTranslation();
    const trackingService = useStaticListTrackingService();
    const openUnlockCountries = useUnlockModal(
        "CountryFilters",
        "Countries",
        "Country Filter/get in touch",
    );
    const [selectedTabLocal, selectTabLocal] = React.useState(selectedTab);

    const handleTabSelection = React.useCallback(
        (index: number) => {
            if (selectedTabLocal !== index) {
                trackingService.trackSignalDDTabChanged(tabs[index]?.title);
                selectTabLocal(index);
            }
        },
        [selectedTabLocal, selectTabLocal],
    );

    const doSelectItemAndTab = React.useCallback(
        (id: SignalWithId["id"]) => {
            if (selectedTab !== selectedTabLocal) {
                onTabSelect(selectedTabLocal);
            }

            onSelect(id, selectedTabLocal);
        },
        [selectedTabLocal, selectedTab, onTabSelect, onSelect],
    );

    const handleItemSelection = React.useCallback(
        (id: DropdownItemId, tabIndex: number) => {
            // FIXME: relying on tabindex is safe only in particular tabs order
            if (itemsLocked && tabIndex === 1) {
                openUnlockCountries();

                return;
            }

            doSelectItemAndTab(id as string);
        },
        [itemsLocked, doSelectItemAndTab],
    );

    const searchProps = React.useMemo(() => {
        return {
            value: search,
            onChange: onSearch,
            placeholder: translate(SIGNALS_DROPDOWN_PLACEHOLDER),
        };
    }, [search, onSearch, translate]);

    React.useEffect(() => {
        selectTabLocal(selectedTab);
    }, [selectedTab]);

    return (
        <StyledSignalsDropdownContent includesSearch open={open} searchProps={searchProps}>
            <Tabs
                className="signals-tabs"
                onSelect={handleTabSelection}
                selectedIndex={selectedTabLocal}
            >
                <TabList>
                    {tabs.map((t, index) => (
                        <Tab
                            key={`${t.title}-tab`}
                            data-automation={`signals-dropdown-tab-${index}`}
                        >
                            {t.title} ({t.total})
                        </Tab>
                    ))}
                </TabList>
                {tabs.map((t, tabIndex) => (
                    <TabPanel
                        key={`${t.title}-panel`}
                        className={selectedTab === tabIndex ? "selected-tab" : null}
                    >
                        <SignalsTabPanel
                            tab={t}
                            index={tabIndex}
                            itemsLocked={itemsLocked}
                            selectedItemId={selected}
                            onItemClick={handleItemSelection}
                        />
                    </TabPanel>
                ))}
            </Tabs>
        </StyledSignalsDropdownContent>
    );
};

export default SignalsDropdownContent;
