import { Flex } from "pages/Leading Folders/src/LeadingFoldersInfoPanel";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import StyledBoxSubtitle from "../../../../.pro-features/styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import {
    IconItem,
    DefaultItem,
    default as BoxSubtitle,
} from "../../../../.pro-features/components/BoxSubtitle/src/BoxSubtitle";
import { FlexRow } from "../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";

export const LeadGeneratorSubtitleBoxWrap: any = styled(StyledBoxSubtitle)`
    ${FlexRow} {
        flex-wrap: wrap;
        overflow: hidden;
        align-items: center;
        ${IconItem}, ${DefaultItem} {
            padding: 2px 0;
            margin-right: 16px;
            font-size: 14px;
            align-items: center;
            :before {
                content: "•";
                position: relative;
                left: -8px;
                margin-right: 0px;
                margin-left: 0px;
            }
            svg {
                width: 16px;
                height: 16px;
                margin: 0px 8px -2px 0px;
            }
        }
    }
`;
LeadGeneratorSubtitleBoxWrap.displayName = "LeadGeneratorSubtitleBoxWrap";

interface ILeadGeneratorSubtitleBoxProps {
    filters: any;
}

const LeadGeneratorSubtitleBox: StatelessComponent<ILeadGeneratorSubtitleBoxProps> = ({
    filters,
}) => {
    return (
        <LeadGeneratorSubtitleBoxWrap>
            <BoxSubtitle filters={filters} />
        </LeadGeneratorSubtitleBoxWrap>
    );
};

export default LeadGeneratorSubtitleBox;
