import React from "react";
import {
    Dropdown,
    IDropDownItem,
    DropdownButton,
    CheckboxIcon,
} from "@similarweb/ui-components/dist/dropdown";
import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { StyledBaseDropdownButtonWrap, StyledDropdownContainer } from "../../styles";
import { StyledDropdownItem, StyledItemText, StyledCheckboxContainer } from "./styles";

type AudienceDropdownProps = {
    id: string;
    items: readonly (IDropDownItem & { tooltip: string })[];
    buttonText: string;
    selectedItems: readonly string[];
    onSelect(item: IDropDownItem & { tooltip: string }): void;
};

const AudienceDropdown = (props: AudienceDropdownProps) => {
    const { id, items, selectedItems, buttonText, onSelect } = props;
    const selectedIds = selectedItems.reduce((map, id) => {
        map[id] = true;
        return map;
    }, {});

    return (
        <StyledDropdownContainer id={id}>
            <Dropdown
                onClick={onSelect}
                appendTo={`#${id}`}
                closeOnItemClick={false}
                selectedIds={selectedIds}
            >
                {[
                    <StyledBaseDropdownButtonWrap key="audience-dd-button">
                        <DropdownButton>{buttonText}</DropdownButton>
                    </StyledBaseDropdownButtonWrap>,
                ].concat(
                    items.map((item) => (
                        <StyledDropdownItem key={item.id} id={item.id as string}>
                            <StyledItemText>{item.text}</StyledItemText>
                            <StyledCheckboxContainer>
                                <PlainTooltip tooltipContent={item.tooltip}>
                                    <div>
                                        <SWReactIcons iconName="info" size="xs" />
                                    </div>
                                </PlainTooltip>
                                <CheckboxIcon
                                    selected={selectedItems.includes(item.id as string)}
                                />
                            </StyledCheckboxContainer>
                        </StyledDropdownItem>
                    )),
                )}
            </Dropdown>
        </StyledDropdownContainer>
    );
};

export default AudienceDropdown;
