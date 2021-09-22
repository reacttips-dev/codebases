/* eslint-disable @typescript-eslint/camelcase */
import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { ITableCellProps } from "components/React/Table/interfaces/ITableCellProps";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { WebsiteTooltipTopCell } from "../../../../components/React/Table/cells";
import {
    Container,
    LeadLabel,
    StyledInfoIconWrapper,
    StyledContentWrapper,
    StyledLeftDomainCell,
    StyledRightDomainCell,
} from "./styles";

const NEW = "si.savedSearch.table.domainCell.tag.new";

type DomainProps = ITableCellProps & { infoIconText?: string };

function DomainCell(props: DomainProps) {
    const translate = useTranslation();

    const { row, infoIconText } = props;
    const { is_new, is_returning } = row;

    return (
        <Container isNew={is_new} isReturning={is_returning}>
            <StyledLeftDomainCell>
                <WebsiteTooltipTopCell isIconHidden hideTrackButton {...props} />
                {infoIconText && (
                    <PlainTooltip placement="top" text={infoIconText}>
                        <StyledContentWrapper>
                            <StyledInfoIconWrapper className="infoIcon">
                                <SWReactIcons size="xs" iconName="light-bulb" />
                            </StyledInfoIconWrapper>
                        </StyledContentWrapper>
                    </PlainTooltip>
                )}
            </StyledLeftDomainCell>
            <StyledRightDomainCell>
                {is_new && <LeadLabel width={30}>{translate(NEW)}</LeadLabel>}
                {is_returning && <LeadLabel width={30}>{translate(NEW)}</LeadLabel>}
            </StyledRightDomainCell>
        </Container>
    );
}

export default DomainCell;
