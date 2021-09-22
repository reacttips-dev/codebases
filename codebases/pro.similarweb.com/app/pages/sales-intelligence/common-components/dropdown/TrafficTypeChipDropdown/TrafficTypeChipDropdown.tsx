import React from "react";
import { StyledTrafficTypeChipButton } from "./styles";
import { useTranslation } from "components/WithTranslation/src/I18n";
import TrafficTypeDropdown from "../TrafficTypeDropdown/TrafficTypeDropdown";
import { TrafficType } from "pages/sales-intelligence/sub-modules/competitor-customers/types";

type TrafficTypeChipDropdownProps = {
    selected: TrafficType;
    trafficTypes: TrafficType[];
    onSelect(trafficType: TrafficType): void;
};

const TrafficTypeChipDropdown = (props: TrafficTypeChipDropdownProps) => {
    const translate = useTranslation();
    const { selected, trafficTypes, onSelect } = props;
    const renderButton = React.useCallback(
        (selectedText: string) => {
            return (
                <StyledTrafficTypeChipButton key="traffic-selector-button">
                    {translate(selectedText)}
                </StyledTrafficTypeChipButton>
            );
        },
        [translate],
    );

    return (
        <TrafficTypeDropdown
            selected={selected}
            onSelect={onSelect}
            trafficTypes={trafficTypes}
            renderButton={renderButton}
        />
    );
};

export default TrafficTypeChipDropdown;
