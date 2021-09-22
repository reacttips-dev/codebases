import React from "react";
import { compose } from "redux";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useFilterState from "../../../hooks/useFilterState";
import { FilterContainerProps } from "../../../types/common";
import withFilterAutoRegister from "../../../hoc/withFilterAutoRegister";
import withFilterUpdate from "../../../hoc/withFilterUpdate";
import withFilterInstance from "../../../hoc/withFilterInstance";
import TrafficChangesModal from "../../common/TrafficChangesModal/TrafficChangesModal";
import { StyledBaseFilterContainer } from "../../styles";
import {
    CommonTrafficChangesFilter,
    TrafficChangeType,
    TrafficChangeTrend,
} from "../../../filters/traffic-changes/types";
import {
    StyledAddFilterContainer,
    StyledTrafficChangeItem,
    StyledTrafficChangeItems,
    StyledTrafficChangeItemText,
    StyledTrafficChangeEdit,
    StyledTrafficChangeSwitch,
    StyledTrafficChangeControls,
    StyledTrendValueText,
} from "./styles";

const TrafficChangesFilterContainer = (props: FilterContainerProps<CommonTrafficChangesFilter>) => {
    const translate = useTranslation();
    const { filter, onUpdate } = props;
    const [isModalOpened, setIsModalOpened] = React.useState(false);
    const [modalValue, setModalValue] = React.useState<TrafficChangeType | null>(null);
    const { value, updateFilterAndLocalState } = useFilterState(filter, onUpdate);

    const handleItemToggle = (metric: string) => {
        const newValue = value.map((item) => {
            if (item.metric === metric) {
                return {
                    ...item,
                    enabled: !item.enabled,
                };
            }

            return item;
        });

        updateFilterAndLocalState(newValue);
    };

    const handleModalApply = (trafficChange: TrafficChangeType) => {
        setIsModalOpened(false);

        if (modalValue !== null) {
            const newValue = value.map((item) => {
                if (item.id === trafficChange.id) {
                    return { ...trafficChange, enabled: true };
                }

                return item;
            });

            updateFilterAndLocalState(newValue);
            return setModalValue(null);
        }

        const newValue = value.concat({ ...trafficChange, enabled: true });

        updateFilterAndLocalState(newValue);
        setModalValue(null);
    };

    const handleModalCancel = () => {
        setIsModalOpened(false);
        setModalValue(null);
    };

    const handleItemEdit = (trafficChange: TrafficChangeType) => {
        setModalValue(trafficChange);
        setIsModalOpened(true);
    };

    return (
        <StyledBaseFilterContainer>
            <TrafficChangesModal
                selected={modalValue}
                isOpened={isModalOpened}
                trends={filter.trends}
                periods={filter.periods}
                metrics={filter.getMetricsLeft()}
                onApply={handleModalApply}
                onCancel={handleModalCancel}
            />
            <StyledTrafficChangeItems>
                {value.map((item) => (
                    <StyledTrafficChangeItem key={item.metric}>
                        <StyledTrafficChangeItemText>
                            <span>
                                {translate(
                                    `si.lead_gen_filters.${filter.key}.metric.${item.metric}`,
                                )}
                            </span>
                            <span>&nbsp;</span>
                            {item.trend === TrafficChangeTrend.Increase ? (
                                <span>&uarr;</span>
                            ) : (
                                <span>&darr;</span>
                            )}
                            <StyledTrendValueText enabled={item.enabled}>
                                <span>{Math.round(item.value * 100)}%</span>
                                <span>&nbsp;</span>
                                <span>{translate(`si.common.period.${item.period}`)}</span>
                            </StyledTrendValueText>
                        </StyledTrafficChangeItemText>
                        <StyledTrafficChangeControls>
                            {item.enabled && (
                                <StyledTrafficChangeEdit>
                                    <PlainTooltip tooltipContent={translate("si.common.edit")}>
                                        <div>
                                            <IconButton
                                                type="flat"
                                                iconSize="xs"
                                                iconName="edit-icon"
                                                onClick={() => handleItemEdit(item)}
                                            />
                                        </div>
                                    </PlainTooltip>
                                </StyledTrafficChangeEdit>
                            )}
                            <StyledTrafficChangeSwitch>
                                <OnOffSwitch
                                    isSelected={item.enabled}
                                    onClick={() => handleItemToggle(item.metric)}
                                />
                            </StyledTrafficChangeSwitch>
                        </StyledTrafficChangeControls>
                    </StyledTrafficChangeItem>
                ))}
            </StyledTrafficChangeItems>
            <StyledAddFilterContainer>
                <IconButton
                    type="flat"
                    iconName="add"
                    onClick={() => setIsModalOpened(true)}
                    isDisabled={filter.getMetricsLeft().length === 0}
                >
                    {translate(`si.lead_gen_filters.${filter.key}.button.add`)}
                </IconButton>
            </StyledAddFilterContainer>
        </StyledBaseFilterContainer>
    );
};

export default compose(
    withFilterInstance,
    withFilterUpdate,
    withFilterAutoRegister,
)(TrafficChangesFilterContainer);
