import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import styled from "styled-components";

const NoDataSegmentsContainer: any = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    justify-content: center;
`;
NoDataSegmentsContainer.displayName = "NoDataSegmentsContainer";

const MessageHeader: any = styled.div`
    padding-top: 28px;
    align-items: center;
    justify-content: center;
    display: flex;
    font-size: 16px;
    font-weight: 500;
    color: ${colorsPalettes.carbon["400"]};
`;
MessageHeader.displayName = "MessageHeader";

const MessageText: any = styled.div`
    padding-top: 5px;
    color: ${colorsPalettes.midnight["500"]};
    opacity: 54%;
    align-items: center;
    justify-content: center;
    display: flex;
`;
MessageText.displayName = "MessageText";

const SvgContainer: any = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;
SvgContainer.displayName = "SvgContainer";

// @ts-ignore
export const NoDataSegmentsSVG = () => <SWReactIcons iconName={"no-data-lab-2"} />;

export interface INoDataSegments {
    messageBottomHeader: string;
    messageBottomText?: string;
}

export const NoDataSegments: React.FC<INoDataSegments> = ({
    messageBottomHeader,
    messageBottomText,
}) => {
    return (
        <NoDataSegmentsContainer>
            <SvgContainer>
                <NoDataSegmentsSVG />
            </SvgContainer>
            <MessageHeader>{messageBottomHeader}</MessageHeader>
            <MessageText>{messageBottomText}</MessageText>
        </NoDataSegmentsContainer>
    );
};
