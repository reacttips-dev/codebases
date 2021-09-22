import { DurationSelectorPresets } from "@similarweb/ui-components/dist/duration-selector";
import React from "react";
import styled from "styled-components";
import { DurationSelectorSimple } from "./DurationSelectorSimple";

const Wrapper = styled.div`
    height: auto;
    overflow-y: auto;
`;
const FixedDurationSelectorInner: React.FC<any> = ({
    closePopup,
    onPresetChange,
    items,
    selectedPreset,
}) => {
    const privateOnPresetChange = (item) => {
        if (typeof closePopup === "function") {
            closePopup();
        }
        onPresetChange(true)(item);
    };
    return (
        <Wrapper>
            <DurationSelectorPresets
                itemsCount={items.length}
                fixedRowHeight={52}
                items={items}
                selectedId={selectedPreset}
                onSelect={privateOnPresetChange}
            />
        </Wrapper>
    );
};

export class FixedDurationsSelector extends DurationSelectorSimple {
    // override the default method of the base class, Since in this use case,
    // We need to allow custom duration to be the selected preset
    getSelectedPreset = (props) => {
        const selectedPreset = props.initialPreset;
        return selectedPreset;
    };
    getDurationSelectorStateless = () => {
        const items = this.props.presets;
        return (
            <FixedDurationSelectorInner
                items={items}
                onPresetChange={this.onPresetSelect}
                selectedPreset={this.state.selectedPreset}
            />
        );
    };
}
