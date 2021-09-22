import { useTranslation } from "components/WithTranslation/src/I18n";
import { Dayjs } from "dayjs";
import { FC, useCallback, useState } from "react";
import isFunction from "lodash/isFunction";
import { YearCalendarWithSelection } from "@similarweb/ui-components/dist/duration-selector";
import { IconButton, Button } from "@similarweb/ui-components/dist/button";
import { withAutoReposition } from "components/duration-selectors/DurationSelectedPresetOriented/steps/withAutoReposition";
import { formatDuration } from "pages/website-analysis/DurationSelectorSimple";
import { getCompareDurationSelected } from "pages/website-analysis/DurationSelectorUtils";
import { MoreDataBanner } from "../MoreDataBanner";
import * as SC from "./StyledComponents";

interface ICalendarStep {
    closePopup?: VoidFunction;
    onBack: VoidFunction;
    minDate: Dayjs;
    maxDate: Dayjs;
    onSubmit: (duration: any) => void;
    initialDuration: { from: Dayjs; to: Dayjs };
}

const CalendarStep: FC<ICalendarStep> = ({
    closePopup,
    onSubmit,
    onBack,
    minDate,
    maxDate,
    initialDuration,
}) => {
    const translate = useTranslation();
    const durationToCompareDuration = (duration) =>
        getCompareDurationSelected(duration, false, null);

    const [selectedCompareDuration, setSelectedCompareDuration] = useState(() =>
        durationToCompareDuration(initialDuration),
    );

    const onSelectionChange = (duration) =>
        setSelectedCompareDuration(durationToCompareDuration(duration));

    const handlePopupClose = useCallback(() => {
        if (isFunction(closePopup)) {
            closePopup();
        }
    }, [closePopup]);

    const submitAndClose = useCallback(() => {
        onSubmit(formatDuration(selectedCompareDuration.primary));
        handlePopupClose();
    }, [onSubmit, handlePopupClose, selectedCompareDuration]);

    return (
        <>
            <SC.BackSection>
                <IconButton type="flat" iconSize="xs" iconName="arrow-left" onClick={onBack} />
                <SC.BackText>{translate("duration_selector.custom.title")}</SC.BackText>
            </SC.BackSection>
            <YearCalendarWithSelection
                minDate={minDate}
                maxDate={maxDate}
                onSelectionChange={onSelectionChange}
                selection={selectedCompareDuration}
                hasPermissionsLock={false}
                renderContactUs={() => null}
                hasVerticalLineSeperator={true}
            />
            <SC.BottomSection>
                <Button type="primary" onClick={submitAndClose}>
                    {translate("duration_selector.custom.apply")}
                </Button>
            </SC.BottomSection>
            <div>
                <MoreDataBanner large={true} onClick={handlePopupClose} />
            </div>
        </>
    );
};

export default withAutoReposition(CalendarStep);
