import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { calcRemFontSize } from "@similarweb/styles/src/mixins";
import { Button } from "@similarweb/ui-components/dist/button";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import styled from "styled-components";

interface ITrialHookProps {
    text: string;
    buttonText: string;
    label: string;
    iconName?: string;
    onCtaClick?: () => void;
}

type TrialHookLayoutType = "row" | "column";

interface ITrialHookElementProps {
    layout: TrialHookLayoutType;
}

const TrialHookContent: any = styled.div`
    display: flex;
    flex-direction: ${({ layout }: ITrialHookElementProps) => layout};
    align-items: center;
    padding: 12px 30px 12px 20px;
    background-color: ${colorsPalettes.indigo[300]};
`;

const TrialHookIconWrap = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    margin-right: 16px;
    background-color: ${colorsPalettes.indigo[400]};
    border-radius: 50%;
    path {
        fill: ${colorsPalettes.carbon[0]};
    }
`;

const TrialHookText = styled.p`
    margin: ${({ layout }: ITrialHookElementProps) =>
        layout === "row" ? "0 auto 0 0" : "0 0 10px"};
    ${({ layout }: ITrialHookElementProps) =>
        layout === "row" ? calcRemFontSize(16) : calcRemFontSize(14)};
    color: ${colorsPalettes.carbon[0]};
    line-height: normal;
`;

const TrialHook: React.FunctionComponent<ITrialHookProps> = (props) => {
    const { text, buttonText, iconName, onCtaClick } = props;
    const layout: TrialHookLayoutType = iconName ? "row" : "column";

    return (
        <TrialHookContent layout={layout}>
            {iconName && (
                <TrialHookIconWrap>
                    <SWReactIcons iconName={iconName} size="sm" />
                </TrialHookIconWrap>
            )}
            <TrialHookText
                layout={layout}
                dangerouslySetInnerHTML={{
                    __html: i18nFilter()(text),
                }}
            />
            <Button
                type="trial"
                style={{
                    marginLeft: "16px",
                    backgroundColor: colorsPalettes.indigo[400],
                    lineHeight: "normal",
                }}
                onClick={onCtaClick}
            >
                {i18nFilter()(buttonText)}
            </Button>
        </TrialHookContent>
    );
};

TrialHook.displayName = "TrialHook";

SWReactRootComponent(TrialHook, "TrialHook");

export default TrialHook;
