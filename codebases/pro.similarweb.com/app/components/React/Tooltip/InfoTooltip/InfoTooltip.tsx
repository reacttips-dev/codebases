import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import React from "react";
import styled from "styled-components";

const DefaultInfoIconContainer = styled.div`
    margin-top: 2px;
    margin-left: 3px;
`;

export const InfoTooltip: React.FunctionComponent<{
    infoText: string;
    enabled: boolean;
    infoIconContainer?: React.FunctionComponent;
}> = ({ infoText, enabled, infoIconContainer: InfoIconContainer = DefaultInfoIconContainer }) => {
    return (
        <PlainTooltip enabled={enabled} tooltipContent={infoText}>
            <InfoIconContainer>
                <SWReactIcons iconName="info" size="xs" />
            </InfoIconContainer>
        </PlainTooltip>
    );
};

InfoTooltip.defaultProps = {
    enabled: true,
};
