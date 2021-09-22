import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { InfoPanel } from "../../../components/Panel/src/InfoPanel";
import { Flex } from "./LeadingFoldersInfoPanel";
import WithAllContexts from "./WithAllContexts";

export interface ILeadingFoldersInfoPanelInProgress {
    domain: string;
}

export const BoldSpan = styled.span`
    font-weight: 500;
`;

const StyledInfoPanel = styled(InfoPanel)`
    padding: 24px 16px;
`;
export const LeadingFoldersInfoPanelInProgress: StatelessComponent<ILeadingFoldersInfoPanelInProgress> = (
    props,
) => {
    return (
        <WithAllContexts>
            {({ track, translate }) => {
                return (
                    <StyledInfoPanel>
                        <Flex>
                            <BoldSpan>
                                {translate(
                                    "website.analysis.leading.folders.info.panel.inprogress.part.a",
                                )}
                            </BoldSpan>
                            <span>
                                {translate(
                                    "website.analysis.leading.folders.info.panel.inprogress.part.b",
                                )}
                            </span>
                        </Flex>
                    </StyledInfoPanel>
                );
            }}
        </WithAllContexts>
    );
};
