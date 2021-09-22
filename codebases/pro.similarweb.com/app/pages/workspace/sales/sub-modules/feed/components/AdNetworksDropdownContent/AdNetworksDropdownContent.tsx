import React from "react";
import {
    AD_NETWORKS_DROPDOWN_PLACEHOLDER,
    AD_NETWORKS_DROPDOWN_TITLE,
} from "pages/workspace/sales/sub-modules/feed/constants";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { DropdownItemType } from "pages/workspace/sales/components/custom-dropdown/types";
import DropdownItemsGroup from "pages/workspace/sales/components/custom-dropdown/DropdownItemsGroup/DropdownItemsGroup";
import { StyledAdNetworksDropdownContent } from "pages/workspace/sales/sub-modules/feed/components/AdNetworksDropdownContent/styles";
import ScrollableDropdownContainer from "pages/workspace/sales/components/custom-dropdown/ScrollableDropdownContainer/ScrollableDropdownContainer";
import { getDropdownGroupKeysInCorrectOrder } from "pages/workspace/sales/helpers";

type AdNetworksDropdownContentProps = {
    open: boolean;
    search: string;
    selected: string;
    groupedItems: { [name: string]: DropdownItemType[] };
    setDropdownScrollAreaRef?: React.LegacyRef<ScrollArea>;
    onSearch(s: string): void;
    onSelect(id: string, group: string): void;
};

const AdNetworksDropdownContent: React.FC<AdNetworksDropdownContentProps> = ({
    open,
    search,
    selected,
    onSearch,
    onSelect,
    groupedItems,
    setDropdownScrollAreaRef,
}) => {
    const translate = useTranslation();
    const searchProps = React.useMemo(() => {
        return {
            value: search,
            onChange: onSearch,
            placeholder: translate(AD_NETWORKS_DROPDOWN_PLACEHOLDER),
        };
    }, [search, onSearch, translate]);

    return (
        <StyledAdNetworksDropdownContent includesSearch open={open} searchProps={searchProps}>
            <ScrollableDropdownContainer setScrollAreaRef={setDropdownScrollAreaRef}>
                {getDropdownGroupKeysInCorrectOrder(groupedItems)
                    .filter((name) => groupedItems[name].length !== 0)
                    .map((name) => (
                        <DropdownItemsGroup
                            key={name}
                            icon="category"
                            onItemClick={onSelect}
                            selectedItemId={selected}
                            items={groupedItems[name]}
                            title={translate(`${AD_NETWORKS_DROPDOWN_TITLE}.${name}`)}
                        />
                    ))}
            </ScrollableDropdownContainer>
        </StyledAdNetworksDropdownContent>
    );
};

export default React.memo(AdNetworksDropdownContent);
