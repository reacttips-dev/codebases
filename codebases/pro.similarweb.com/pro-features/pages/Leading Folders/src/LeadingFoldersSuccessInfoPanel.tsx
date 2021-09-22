import { SWReactIcons } from "@similarweb/icons";
import { Button } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { SuccessPanel } from "../../../components/Panel/src/InfoPanel";
import { Flex, FlexSpaceBetween } from "./LeadingFoldersInfoPanel";
import WithAllContexts from "./WithAllContexts";
import { colorsPalettes } from "@similarweb/styles";

const Icon: any = styled(SWReactIcons)`
    margin-right: 8px;
    width: 1em;
    height: 1.2em;
    path {
        fill: ${colorsPalettes.green["400"]};
    }
`;

const StyledFlex = styled(Flex)`
    color: #4fbf40;
`;

export interface ILeadingFoldersSuccessInfoPanel {
    gotItButtonClick?: () => void;
    domain: string;
}
export const LeadingFoldersSuccessInfoPanel: StatelessComponent<ILeadingFoldersSuccessInfoPanel> = (
    props,
) => {
    const { gotItButtonClick, domain } = props;

    const gotItButtonClickInternal = (track) => {
        gotItButtonClick();
        track("got it", "click", `Website Analysis/Leading Folder/${domain}`);
    };

    return (
        <WithAllContexts>
            {({ track, translate }) => {
                return (
                    <SuccessPanel>
                        <FlexSpaceBetween>
                            <StyledFlex>
                                <Icon iconName={"checked"} />
                                <span>
                                    {translate(
                                        "website.analysis.leading.folders.info.panel.success.text",
                                    )}
                                </span>
                            </StyledFlex>
                            <Button type={"flat"} onClick={() => gotItButtonClickInternal(track)}>
                                {translate(
                                    "website.analysis.leading.folders.info.panel.success.button",
                                )}
                            </Button>
                        </FlexSpaceBetween>
                    </SuccessPanel>
                );
            }}
        </WithAllContexts>
    );
};
