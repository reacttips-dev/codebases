import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import { LIST_SETTINGS_MODAL_KEY } from "../../../../../constants/translations";
import { AlertsSettings } from "../../../../../sub-modules/opportunities/types";
import {
    StyledMetricSection,
    StyledMetric,
    StyledMetricName,
    StyledSettingsFeed,
    StyledLabel,
    StyledMetricSwitch,
} from "../styles";
import { SETTINGS_METRICS, getSectionName } from "../metrics";

type ListSettingsFeedProps = {
    metrics: AlertsSettings["metrics"];
    onToggle(metric: string): void;
};

const ListSettingsFeed = (props: ListSettingsFeedProps) => {
    const translate = useTranslation();
    const { metrics, onToggle } = props;

    return (
        <StyledSettingsFeed>
            {SETTINGS_METRICS.map((settingsMetrics) => {
                const name = getSectionName();

                return (
                    <StyledMetricSection key={name}>
                        <StyledLabel>
                            <span>{translate(`${LIST_SETTINGS_MODAL_KEY}.label.${name}`)}</span>
                        </StyledLabel>
                        {settingsMetrics.map((metric) => (
                            <StyledMetric key={metric}>
                                <StyledMetricName>
                                    <span>
                                        {translate(`${LIST_SETTINGS_MODAL_KEY}.metric.${metric}`)}
                                    </span>
                                </StyledMetricName>
                                <StyledMetricSwitch>
                                    <OnOffSwitch
                                        isSelected={metrics.includes(metric)}
                                        onClick={() => onToggle(metric)}
                                    />
                                </StyledMetricSwitch>
                            </StyledMetric>
                        ))}
                    </StyledMetricSection>
                );
            })}
        </StyledSettingsFeed>
    );
};

export default React.memo(ListSettingsFeed);
