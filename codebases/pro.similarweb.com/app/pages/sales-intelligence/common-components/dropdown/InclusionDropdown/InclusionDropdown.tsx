import React from "react";
import { objectKeys } from "pages/workspace/sales/helpers";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { Dropdown, DropdownButton } from "@similarweb/ui-components/dist/dropdown";
import { StyledInclusionDDItem, StyledInclusionDDButton } from "./styles";

export enum InclusionEnum {
    includeOnly = "includeOnly",
    excludeOnly = "excludeOnly",
}

type InclusionDropdownProps = {
    width?: number;
    appendTo?: string;
    isDisabled?: boolean;
    selected: InclusionEnum;
    dropdownPopupPlacement?: string;
    onSelect(value: InclusionEnum): void;
};

const InclusionDropdown = (props: InclusionDropdownProps) => {
    const translate = useTranslation();
    const {
        selected,
        onSelect,
        appendTo,
        width = 212,
        isDisabled = false,
        dropdownPopupPlacement = "ontop-left",
    } = props;

    const button = React.useMemo(() => {
        return (
            <StyledInclusionDDButton key="inclusion-selector-button" buttonWidth={width}>
                <DropdownButton disabled={isDisabled}>
                    {translate(`si.components.inclusion_dd.${selected}.text`)}
                </DropdownButton>
            </StyledInclusionDDButton>
        );
    }, [width, isDisabled, selected]);

    const handleSelect = React.useCallback(
        (item: { id: InclusionEnum }) => {
            onSelect(item.id);
        },
        [onSelect],
    );

    const renderItems = React.useCallback(() => {
        return [button].concat(
            objectKeys(InclusionEnum).map((type) => (
                <StyledInclusionDDItem id={type} key={`inclusion-selector-item-${type}`}>
                    {translate(`si.components.inclusion_dd.${type}.text`)}
                </StyledInclusionDDItem>
            )),
        );
    }, [button, selected]);

    return (
        <Dropdown
            width={width}
            appendTo={appendTo}
            disabled={isDisabled}
            onClick={handleSelect}
            selectedIds={{ [selected]: true }}
            dropdownPopupPlacement={dropdownPopupPlacement}
        >
            {renderItems()}
        </Dropdown>
    );
};

export default InclusionDropdown;
