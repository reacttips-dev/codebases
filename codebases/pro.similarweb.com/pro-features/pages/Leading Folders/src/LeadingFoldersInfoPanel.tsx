import { SWReactIcons } from "@similarweb/icons";
import { Button } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { InfoPanel } from "../../../components/Panel/src/InfoPanel";
import WithAllContexts from "./WithAllContexts";

const Icon: any = styled(SWReactIcons)`
    margin-right: 8px;
    width: 1em;
    height: 1em;
`;

export const Flex = styled.div`
    align-items: center;
    flex-wrap: wrap;
    flex-direction: row;
    display: flex;
`;

const StyledFlex = styled(Flex)`
    color: #97a1ab;
`;

export const FlexSpaceBetween = styled(Flex)`
    justify-content: space-between;
`;

export interface ILeadingFoldersInfoPanel {
    whitelistButtonClick?: () => void;
    domain: string;
}
export const LeadingFoldersInfoPanel: StatelessComponent<ILeadingFoldersInfoPanel> = (props) => {
    const { whitelistButtonClick, domain } = props;

    const whitelistButtonClickInternal = (track) => {
        whitelistButtonClick();
        track("request whitelist", "click", `Website Analysis/Leading Folder/${domain}`);
    };
    return (
        <WithAllContexts>
            {({ track, translate }) => {
                return (
                    <InfoPanel>
                        <FlexSpaceBetween>
                            <StyledFlex>
                                <Icon iconName={"info"} />
                                <span>
                                    {translate("website.analysis.leading.folders.info.panel.text")}
                                </span>
                            </StyledFlex>
                            <Button
                                onClick={() => {
                                    whitelistButtonClickInternal(track);
                                }}
                            >
                                {translate("website.analysis.leading.folders.info.panel.button")}
                            </Button>
                        </FlexSpaceBetween>
                    </InfoPanel>
                );
            }}
        </WithAllContexts>
    );
};
