import React from "react";
import { ProModal } from "components/Modals/src/ProModal";
import { Button } from "@similarweb/ui-components/dist/button";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { getUniqueId } from "pages/sales-intelligence/helpers/common";
import TrafficChangeMetricsDropdown from "../TrafficChangeMetricsDropdown/TrafficChangeMetricsDropdown";
import TrafficChangeTrendsDropdown from "../TrafficChangeTrendsDropdown/TrafficChangeTrendsDropdown";
import TrafficChangePeriodsDropdown from "../TrafficChangePeriodsDropdown/TrafficChangePeriodsDropdown";
import {
    TrafficChangePeriod,
    TrafficChangeTrend,
    TrafficChangeType,
} from "../../../filters/traffic-changes/types";
import {
    INPUT_MIN,
    INPUT_MAX,
    CUSTOM_MODAL_STYLES,
    StyledModalContent,
    StyledModalTitle,
    StyledChangeInputContainer,
    StyledSelectionRow,
    StyledSelectionPrefix,
    StyledButtonsContainer,
    StyledPercentageSign,
} from "./styles";

type TrafficChangesModalProps = {
    trends: readonly TrafficChangeTrend[];
    periods: readonly TrafficChangePeriod[];
    metrics: readonly string[];
    isOpened: boolean;
    selected: TrafficChangeType | null;
    onApply(trafficChange: TrafficChangeType): void;
    onCancel(): void;
};

const TrafficChangesModal = (props: TrafficChangesModalProps) => {
    const translate = useTranslation();
    const { isOpened, selected, trends, periods, metrics, onApply, onCancel } = props;
    const [trafficChange, setTrafficChange] = React.useState(selected);
    /** Whether the traffic change value is a valid number within (0-500) range */
    const isValueValid =
        trafficChange?.value > INPUT_MIN && trafficChange?.value <= INPUT_MAX / 100;
    /** Whether the submit button should be disabled */
    const isApplyDisabled =
        !trafficChange?.metric || !trafficChange?.period || !trafficChange?.trend || !isValueValid;

    const updateTrafficChange = (trafficChange: TrafficChangeType | null) => {
        if (typeof trafficChange?.id === "undefined") {
            return setTrafficChange({ ...trafficChange, id: getUniqueId() });
        }

        setTrafficChange(trafficChange);
    };

    const handleTrendSelection = (trend: TrafficChangeTrend) => {
        updateTrafficChange({ ...trafficChange, trend });
    };

    const handleMetricSelection = (metric: string) => {
        updateTrafficChange({ ...trafficChange, metric: metric });
    };

    const handlePeriodSelection = (period: TrafficChangePeriod) => {
        updateTrafficChange({ ...trafficChange, period });
    };

    const handleValueSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { value },
        } = event;
        const parsed = parseFloat(value);

        if (!isNaN(parsed)) {
            updateTrafficChange({ ...trafficChange, value: parsed / 100 });
        } else {
            updateTrafficChange({ ...trafficChange, value: 0 });
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleApply = () => {
        onApply(trafficChange);
    };

    React.useEffect(() => {
        setTrafficChange(selected);
    }, [selected]);

    React.useEffect(() => {
        if (!isOpened) {
            setTimeout(() => setTrafficChange(null), 0);
        }
    }, [isOpened]);

    return (
        <ProModal
            isOpen={isOpened}
            showCloseIcon={false}
            shouldCloseOnOverlayClick={false}
            customStyles={CUSTOM_MODAL_STYLES}
        >
            <StyledModalContent>
                <StyledModalTitle>
                    {translate("si.components.traffic_change_modal.title")}
                </StyledModalTitle>
                <StyledSelectionRow>
                    <StyledSelectionPrefix>
                        {translate("si.components.traffic_change_modal.metric_dd.prefix")}
                    </StyledSelectionPrefix>
                    <TrafficChangeMetricsDropdown
                        metrics={metrics}
                        onSelect={handleMetricSelection}
                        selected={trafficChange?.metric ?? null}
                    />
                </StyledSelectionRow>
                <StyledSelectionRow>
                    <StyledSelectionPrefix>
                        {translate("si.components.traffic_change_modal.trend_dd.prefix")}
                    </StyledSelectionPrefix>
                    <TrafficChangeTrendsDropdown
                        trends={trends}
                        onSelect={handleTrendSelection}
                        selected={trafficChange?.trend ?? null}
                    />
                    <StyledChangeInputContainer>
                        <input
                            type="number"
                            min={INPUT_MIN}
                            max={INPUT_MAX}
                            onInput={handleValueSelection}
                            value={
                                trafficChange?.value ? Math.round(trafficChange.value * 100) : ""
                            }
                        />
                    </StyledChangeInputContainer>
                    <StyledPercentageSign>%</StyledPercentageSign>
                </StyledSelectionRow>
                <StyledSelectionRow>
                    <TrafficChangePeriodsDropdown
                        periods={periods}
                        onSelect={handlePeriodSelection}
                        selected={trafficChange?.period ?? null}
                    />
                </StyledSelectionRow>
                <StyledButtonsContainer>
                    <Button
                        type="flat"
                        onClick={handleCancel}
                        dataAutomation="traffic-changes-modal-button-cancel"
                    >
                        {translate("si.common.button.cancel")}
                    </Button>
                    <Button
                        onClick={handleApply}
                        isDisabled={isApplyDisabled}
                        dataAutomation="traffic-changes-modal-button-apply"
                    >
                        {translate(
                            `si.components.traffic_change_modal.button.${
                                selected !== null ? "update" : "create"
                            }`,
                        )}
                    </Button>
                </StyledButtonsContainer>
            </StyledModalContent>
        </ProModal>
    );
};

export default TrafficChangesModal;
