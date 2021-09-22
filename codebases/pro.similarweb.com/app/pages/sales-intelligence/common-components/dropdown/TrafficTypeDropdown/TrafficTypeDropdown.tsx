import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { Dropdown, DropdownButton } from "@similarweb/ui-components/dist/dropdown";
import { TrafficType } from "../../../sub-modules/competitor-customers/types";
import { getTrafficTypeTranslationKey } from "../../../sub-modules/competitor-customers/helpers";
import { StyledTrafficDropdownButton, StyledTrafficTypeDropdownItem } from "./styles";

type TrafficTypeDropdownProps = {
    selected: TrafficType;
    trafficTypes: TrafficType[];
    onSelect(trafficType: TrafficType): void;
    renderButton?(selectedText: string): React.ReactNode;
};

const TrafficTypeDropdown = (props: TrafficTypeDropdownProps) => {
    const translate = useTranslation();
    const { selected, onSelect, trafficTypes, renderButton } = props;

    const button = React.useMemo(() => {
        const text = getTrafficTypeTranslationKey(selected);

        if (typeof renderButton === "function") {
            return renderButton(text);
        }

        return (
            <StyledTrafficDropdownButton key="traffic-selector-button">
                <DropdownButton>{translate(text)}</DropdownButton>
            </StyledTrafficDropdownButton>
        );
    }, [renderButton, selected]);

    const handleSelect = React.useCallback(
        (item: { id: TrafficType }) => {
            onSelect(item.id);
        },
        [onSelect],
    );

    const renderItems = React.useCallback(() => {
        return [button].concat(
            trafficTypes.map((type) => (
                <StyledTrafficTypeDropdownItem id={type} key={`traffic-selector-item-${type}`}>
                    {translate(getTrafficTypeTranslationKey(type))}
                </StyledTrafficTypeDropdownItem>
            )),
        );
    }, [button, selected]);

    return (
        <Dropdown width={188} onClick={handleSelect} selectedIds={{ [selected]: true }}>
            {renderItems()}
        </Dropdown>
    );
};

export default TrafficTypeDropdown;
