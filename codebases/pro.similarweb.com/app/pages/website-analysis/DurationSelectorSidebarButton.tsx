import { FC } from "react";
import PropTypes from "prop-types";
import { getDropDownButtonTitle } from "./DurationSelectorUtils";
import { IDropdownItem } from "@similarweb/ui-components/dist/dropdown";

interface IDurationSelectorSidebarButtonProps {
    initialPreset: string;
    presets: IDropdownItem[];
    compareSelected: boolean;
    disabled?: boolean;
    onClick?: () => void;
    onSelect?: () => void;
}

export const DurationSelectorSidebarButton: FC<IDurationSelectorSidebarButtonProps> = (props) => {
    let style: any = {
        lineHeight: "60px",
    };
    if (props.disabled) {
        style = { ...style, pointerEvents: "none", cursor: "auto" };
    }
    return (
        <div style={style} onClick={props.onClick}>
            {getDropDownButtonTitle(props.initialPreset, props.presets)}
            {props.compareSelected && <span className="isCompareBullet" />}
        </div>
    );
};

DurationSelectorSidebarButton.displayName = "DurationSelectorSidebarButton";

DurationSelectorSidebarButton.propTypes = {
    initialPreset: PropTypes.string.isRequired,
    presets: PropTypes.array.isRequired,
    compareSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    onSelect: PropTypes.func,
};
