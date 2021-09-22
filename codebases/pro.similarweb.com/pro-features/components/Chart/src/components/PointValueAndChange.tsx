import { ChangeValue } from "@similarweb/ui-components/dist/change-value";
import * as React from "react";
import styled, { css } from "styled-components";
import StyledBoxSubtitle from "../../../../styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { StyledPrimaryTitle } from "../../../../styled components/StyledBoxTitle/src/StyledBoxTitle";
import { FlexColumn, FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";

const commonStyle = css`
    font-size: 32px;
    font-weight: 300;
    font-family: Roboto;
    line-height: 1em;
`;

export const Title = styled(StyledPrimaryTitle)`
    ${commonStyle}
`;
Title.displayName = "Title";

export const Subtitle = styled(StyledBoxSubtitle)`
    ${commonStyle};
    font-size: 12px;
    color: rgba(42, 62, 82, 0.6);
    font-weight: normal;
    line-height: normal;
    margin-top: 3px;
`;
Subtitle.displayName = "Subtitle";

export const StyledFlexWrapper = styled(FlexRow)`
    align-items: flex-start;
    margin: auto;
    white-space: nowrap;
    ${FlexColumn}:first-child {
        margin-right: 8px;
    }
`;

StyledFlexWrapper.displayName = "StyledFlexWrapper";

export const ChangeValueWrapper = styled.div`
    ${commonStyle}
    .ChangeValue {
        ${commonStyle}
        .ChangeValue-arrow {
            width: 12.5px;
            height: 17.5px;
            display: inline-block;
            vertical-align: initial;
            transform: translateY(-2px);
        }
        .ChangeValue-text {
            margin-left: 8px;
            display: initial;
            vertical-align: initial;
        }
    }
`;
ChangeValueWrapper.displayName = "ChangeValueWrapper";

const getComponent = (value) => {
    function TextComponent() {
        return <span>{value}</span>;
    }

    switch (typeof value) {
        case "function":
            return value;

        default:
            return TextComponent;
    }
};

const getChangeComponent = (value, isDecrease) => {
    function ChangeComponent() {
        return (
            <ChangeValue descriptionText={""} value={value.toString()} isDecrease={isDecrease} />
        );
    }

    if (typeof value !== "function") {
        return ChangeComponent;
    } else return value;
};

ChangeValueWrapper.displayName = "ChangeValueWrapper";
const PointValueAndChange: any = ({ value, valueSubtitle, change, changeSubtitle, isDecrease }) => {
    const Value = getComponent(value);
    const ValueSubtitle = getComponent(valueSubtitle);
    const Change = getChangeComponent(change, isDecrease);
    const ChangeSubtitle = getComponent(changeSubtitle);

    return (
        <StyledFlexWrapper>
            <FlexColumn data-automation-chart-value={true}>
                <Title>
                    <Value />
                </Title>
                <Subtitle>
                    <ValueSubtitle />
                </Subtitle>
            </FlexColumn>
            {change && (
                <FlexColumn data-automation-chart-change={true}>
                    <Title>
                        <ChangeValueWrapper>
                            <Change />
                        </ChangeValueWrapper>
                    </Title>
                    <Subtitle>
                        <ChangeSubtitle />
                    </Subtitle>
                </FlexColumn>
            )}
        </StyledFlexWrapper>
    );
};
export default PointValueAndChange;
