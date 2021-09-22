import React from "react";
import { i18nFilter } from "filters/ngFilters";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    InsightContainer,
    MainContent,
    MainTextContainer,
    Icon,
    AnchorContainer,
} from "./styledComponents";
import { navigate } from "components/React/commonInsights/utilities/functions";

interface IInsightProps {
    mainText: JSX.Element;
    innerLinkKey: string;
    icon?: string;
    rawData?: any;
    onCtaClick: () => void;
    innerLinkPage: string;
    navigationParams: any;
}

const DEFAULT_INSIGHT_ICON = "phrases";

export const Insight: React.FunctionComponent<IInsightProps> = ({
    mainText,
    innerLinkPage,
    onCtaClick,
    innerLinkKey,
    icon = DEFAULT_INSIGHT_ICON,
    navigationParams,
}) => {
    const onClick = () => {
        onCtaClick();
        navigate(innerLinkPage, navigationParams);
    };
    return (
        <InsightContainer onClick={onClick}>
            <Icon iconName={icon} />
            <MainContent>
                <MainTextContainer>{mainText}</MainTextContainer>
                <AnchorContainer>
                    <Button type="flat">{i18nFilter()(innerLinkKey)}</Button>
                </AnchorContainer>
            </MainContent>
        </InsightContainer>
    );
};
