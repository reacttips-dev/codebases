import React from "react";
import { debounce } from "lodash";
import { findParentByClass } from "@similarweb/ui-components/dist/utils";
import DropdownButton from "pages/workspace/sales/components/custom-dropdown/DropdownButton/DropdownButton";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useBodyClick from "pages/workspace/sales/hooks/useBodyClick";
import { AD_NETWORKS_DROPDOWN_TITLE, AD_NETWORKS_SEARCH_TRACK_TIMEOUT } from "../../constants";
import { SignalWithId } from "../../../signals/types";
import { summarizeSubFiltersCounts } from "../../../signals/helpers";
import { buildGroupedAdNetworks } from "../../helpers";
import feedTrackingService from "../../services/feedTrackingService";
import AdNetworksDropdownContent from "../AdNetworksDropdownContent/AdNetworksDropdownContent";
import { AdNetworksDropdownContainerProps } from "./AdNetworksDropdown";

type AdNetworksDropdownProps = {
    disabled?: boolean;
    value: string | null;
    className?: string;
    opportunitiesListId: string;
    selectedSignal: SignalWithId;
    onChange(id: string | null): void;
};

const AdNetworksDropdown: React.FC<AdNetworksDropdownProps & AdNetworksDropdownContainerProps> = ({
    value,
    onChange,
    selectedSignal,
    getUseStatistics,
    mostUsedAdNetworkIds,
    updateUseStatistics,
    syncUseStatistics,
    opportunitiesListId,
    className = null,
    disabled = false,
}) => {
    const translate = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const dropdownScrollAreaRef = React.useRef(null);

    const debouncedSearchTrack = debounce((s: string) => {
        if (s.length > 2) {
            feedTrackingService.trackAdNetworkDropdownSearch(s);
        }
    }, AD_NETWORKS_SEARCH_TRACK_TIMEOUT);

    const handleButtonClick = React.useCallback(() => {
        setOpen(true);
        feedTrackingService.trackAdNetworkDropdownOpen(
            summarizeSubFiltersCounts(selectedSignal.sub_filters),
        );
    }, [setOpen, selectedSignal.sub_filters]);

    const handleClose = React.useCallback(() => {
        onChange(null);
    }, [onChange]);

    const handleBodyClick = React.useCallback(
        (e) => {
            const parent = findParentByClass(e.target, className.split(" ")[0]);

            if (!parent && open) {
                setOpen(false);
                feedTrackingService.trackAdNetworkDropdownClose(selectedSignal.sub_filters.length);
            }
        },
        [open, selectedSignal],
    );

    const trackSelection = React.useCallback(
        (id: string, group: string) => {
            const item = selectedSignal.sub_filters.find((sf) => sf.code === id);

            feedTrackingService.trackAdNetworkDropdownSelection(group, item?.title as string);
        },
        [selectedSignal.sub_filters],
    );

    const handleItemSelection = React.useCallback(
        (id: string, group: string) => {
            setOpen(false);

            if (value !== id) {
                onChange(id);
                updateUseStatistics({ listId: opportunitiesListId, itemId: id });
                trackSelection(id, group);
            }
        },
        [onChange, setOpen, opportunitiesListId, updateUseStatistics, trackSelection],
    );

    const groupedItems = React.useMemo(() => {
        return buildGroupedAdNetworks(search, mostUsedAdNetworkIds, selectedSignal.sub_filters);
    }, [selectedSignal.sub_filters, search, mostUsedAdNetworkIds]);

    const handleSearchAndTrack = React.useCallback(
        (search: string) => {
            if (dropdownScrollAreaRef.current) {
                dropdownScrollAreaRef.current.scrollYTo(0);
            }

            setSearch(search);
            debouncedSearchTrack(search);
        },
        [setSearch],
    );

    const setDropdownScrollAreaRef = React.useCallback(
        (scrollArea) => {
            if (dropdownScrollAreaRef) {
                dropdownScrollAreaRef.current = scrollArea;
            }
        },
        [dropdownScrollAreaRef],
    );

    useBodyClick(handleBodyClick);

    React.useEffect(() => {
        getUseStatistics();

        return () => {
            syncUseStatistics();
        };
    }, []);

    function getSelectedText() {
        const foundObject = selectedSignal.sub_filters.find((sf) => sf.code === value);

        if (!foundObject) {
            return value;
        }

        return foundObject.title;
    }

    return (
        <div className={className}>
            <DropdownButton
                disabled={disabled}
                onClose={handleClose}
                onClick={handleButtonClick}
                selectedText={getSelectedText()}
                buttonText={translate(AD_NETWORKS_DROPDOWN_TITLE)}
            />
            <AdNetworksDropdownContent
                open={open}
                search={search}
                selected={value}
                groupedItems={groupedItems}
                onSelect={handleItemSelection}
                onSearch={handleSearchAndTrack}
                setDropdownScrollAreaRef={setDropdownScrollAreaRef}
            />
        </div>
    );
};

export default React.memo(AdNetworksDropdown);
