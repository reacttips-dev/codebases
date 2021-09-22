import { useTranslation } from "components/WithTranslation/src/I18n";
import { FC, ReactElement, useCallback } from "react";
import isFunction from "lodash/isFunction";
import uniq from "lodash/uniq";
import { Dayjs } from "dayjs";
import { DropdownContent } from "@similarweb/ui-components/dist/dropdown";
import { withAutoReposition } from "components/duration-selectors/DurationSelectedPresetOriented/steps/withAutoReposition";
import { Presets } from "../../types";
import { MoreDataBanner } from "../MoreDataBanner";
import * as SC from "./StyledComponents";

const CUSTOM_DURATION_ITEM_ID = "duration::custom";

interface IDropdownStep {
    closePopup?: VoidFunction;
    onCustomDuration: VoidFunction;
    onPresetSelect: (id: string) => void;
    presets: Presets;
    selectedPreset: string | null;
    selectedCustomDuration: any | null;
}

const DropdownStep: FC<IDropdownStep> = ({
    closePopup,
    onCustomDuration,
    onPresetSelect,
    presets,
    selectedPreset,
    selectedCustomDuration,
    ...props
}) => {
    const translate = useTranslation();
    const handlePopupClose = useCallback(() => {
        if (isFunction(closePopup)) {
            closePopup();
        }
    }, [closePopup]);

    const handleDropdownItemClick = useCallback(
        (item: ReactElement<{ id: string }>) => {
            if (item.props.id !== CUSTOM_DURATION_ITEM_ID) {
                handlePopupClose();
                onPresetSelect(item.props.id);
            } else {
                onCustomDuration();
            }
        },
        [onCustomDuration, onPresetSelect, handlePopupClose],
    );

    const formatItemDate = (from: Dayjs, to: Dayjs) =>
        `(${uniq([from, to].map((date) => date.format("MMM YYYY"))).join(" - ")})`;

    return (
        <div>
            <DropdownContent
                {...props}
                selectedIds={{ [selectedPreset || CUSTOM_DURATION_ITEM_ID]: true }}
                onClick={handleDropdownItemClick}
            >
                {presets.map(({ id, text, value: { from, to } }) => {
                    const secondaryText = id.match(/\d+d/) ? "" : formatItemDate(from, to);
                    return (
                        <SC.DropdownItem id={id} key={id}>
                            {text}{" "}
                            {secondaryText && (
                                <SC.DropdownItemDate>{secondaryText}</SC.DropdownItemDate>
                            )}
                        </SC.DropdownItem>
                    );
                })}
                <SC.DropdownItem id={CUSTOM_DURATION_ITEM_ID}>
                    {translate("duration_selector.custom")}
                    {selectedCustomDuration ? " " : "..."}
                    {selectedCustomDuration && (
                        <SC.DropdownItemDate>
                            {formatItemDate(selectedCustomDuration.from, selectedCustomDuration.to)}
                        </SC.DropdownItemDate>
                    )}
                </SC.DropdownItem>
            </DropdownContent>
            <SC.BottomSection>
                <MoreDataBanner onClick={handlePopupClose} />
            </SC.BottomSection>
        </div>
    );
};

export default withAutoReposition(DropdownStep);
