import React from "react";
import { Dropdown, IDropDownItem, NoBorderButton } from "@similarweb/ui-components/dist/dropdown";
import { DD_WIDTH, StyledDDItem, StyledDDContainer } from "./styles";

type TrafficChangesDropdownProps = {
    items: IDropDownItem[];
    selected: string;
    buttonText: string;
    hasSelection: boolean;
    onSelect(id: string): void;
};

const TrafficChangesDropdown = (props: TrafficChangesDropdownProps) => {
    const { items, selected, buttonText, hasSelection, onSelect } = props;

    const handleSelect = (item: { id: string }) => {
        onSelect(item.id);
    };

    return (
        <StyledDDContainer>
            <Dropdown
                width={DD_WIDTH}
                onClick={handleSelect}
                selectedIds={{ [selected]: true }}
                dropdownPopupPlacement="ontop-left"
            >
                {[
                    <NoBorderButton key={selected} isPlaceholder={!hasSelection}>
                        {buttonText}
                    </NoBorderButton>,
                    ...items.map((item) => (
                        <StyledDDItem key={item.id} {...item}>
                            {item.text}
                        </StyledDDItem>
                    )),
                ]}
            </Dropdown>
        </StyledDDContainer>
    );
};

export default TrafficChangesDropdown;
