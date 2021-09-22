import {
    MTDContainer,
    MTDToggleContainer,
} from "pages/industry-analysis/category-share/CategoryShareGraph/CategoryShareGraphStyles";
import { getMonthsToDateTooltipText } from "UtilitiesAndConstants/UtilityFunctions/monthsToDateUtilityFunctions";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import { ICategoryShareServices } from "pages/industry-analysis/category-share/CategoryShareTypes";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { noop } from "lodash";
import { useCallback, useMemo } from "react";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { MTDTitle } from "pages/industry-analysis/category-share/CategoryShareGraph/CategoryShareGraphStyles";

interface IMonthToDateToggleProps {
    /**
     * Disables the toggle for interaction
     */
    isDisabled: boolean;

    /**
     * Is the toggle active (toggled / non-toggled)
     */
    isMonthToDateActive: boolean;

    /**
     * Toggle callback
     */
    onToggleMonthToDate: (isActive: boolean) => void;

    /**
     * Category share services
     */
    services: ICategoryShareServices;
}

export const MonthToDateToggle = (props: IMonthToDateToggleProps) => {
    const { isMonthToDateActive, onToggleMonthToDate, services, isDisabled } = props;

    const tooltipText = useMemo(() => {
        return getMonthsToDateTooltipText(!isDisabled, isMonthToDateActive);
    }, [isMonthToDateActive, isDisabled]);

    const handleMTDToggle = useCallback(() => {
        if (isDisabled) return;
        onToggleMonthToDate(!isMonthToDateActive);
    }, [isDisabled, isMonthToDateActive]);

    return (
        <MTDContainer isDisabled={isDisabled}>
            <PlainTooltip enabled={true} text={tooltipText}>
                <MTDToggleContainer onClick={handleMTDToggle}>
                    <OnOffSwitch
                        isSelected={!isDisabled && isMonthToDateActive}
                        onClick={noop}
                        isDisabled={isDisabled}
                    />
                    <MTDTitle isDisabled={isDisabled}>
                        <span>
                            {services.translate("wa.traffic.engagement.over.time.mtd.toggle_label")}
                        </span>
                    </MTDTitle>
                </MTDToggleContainer>
            </PlainTooltip>
        </MTDContainer>
    );
};
