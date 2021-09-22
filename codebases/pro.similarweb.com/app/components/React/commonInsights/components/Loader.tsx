import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import {
    AnchorContainer,
    InsightContainer,
    MainContent,
    MainTextContainer,
} from "components/React/commonInsights/components/styledComponents";
import { colorsPalettes } from "@similarweb/styles";

const RadialGradient = (id) => () => {
    return (
        <linearGradient id={id} x1="0%" x2="0%">
            <animate attributeName="x1" dur="1s" repeatCount="indefinite" from="0%" to="200%" />
            <stop offset="0%" stopColor={colorsPalettes.carbon[25]} />
            <stop offset="40%" stopColor={colorsPalettes.carbon[50]} />
            <stop offset="100%" stopColor={colorsPalettes.carbon[100]} />
        </linearGradient>
    );
};

export const Loader = () => {
    const innerLoaderId = "inner-loader";
    const icon = (
        <div style={{ paddingTop: "4px" }}>
            <PixelPlaceholderLoader
                width={"16px"}
                height={"16px"}
                ShapeMarkup={RadialGradient(innerLoaderId)}
                id={innerLoaderId}
            />
        </div>
    );
    const contentLine = (
        <PixelPlaceholderLoader
            height={"10px"}
            width={"242px"}
            ShapeMarkup={RadialGradient(innerLoaderId)}
            id={innerLoaderId}
        />
    );
    const cta = (
        <PixelPlaceholderLoader
            height={"20px"}
            width={"91px"}
            ShapeMarkup={RadialGradient(innerLoaderId)}
            id={innerLoaderId}
        />
    );
    return (
        <InsightContainer>
            {icon}
            <MainContent>
                <MainTextContainer>
                    {contentLine}
                    {contentLine}
                    {contentLine}
                </MainTextContainer>
                <AnchorContainer>{cta}</AnchorContainer>
            </MainContent>
        </InsightContainer>
    );
};
