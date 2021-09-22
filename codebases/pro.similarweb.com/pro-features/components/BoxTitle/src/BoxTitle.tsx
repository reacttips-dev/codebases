import { SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { FlexColumn, FlexRow } from "../../../styled components/StyledFlex/src/StyledFlex";
import StyledLink from "../../../styled components/StyledLink/src/StyledLink";

const TitleRow: any = styled(FlexRow)`
    line-height: 1.2;
`;
TitleRow.displayName = "TitleRow";

const InfoIcon: any = styled(SWReactIcons)`
    margin-left: 8px;
    line-height: 1.4;
    width: 16px;
    height: 16px;
`;
InfoIcon.displayName = "InfoIcon";

const Icon: any = styled(SWReactIcons)`
    margin-right: 8px;
    width: 1em;
    height: 1em;
    line-height: 1.4;
`;
Icon.displayName = "Icon";

export interface IBoxTitleProps {
    children: any;
    tooltip?: string;
    iconName?: string;
    href?: string;
    target?: string;
    customElement?: JSX.Element;
}

const BoxTitle: StatelessComponent<IBoxTitleProps> = ({
    children,
    tooltip,
    iconName,
    href,
    target,
    customElement,
}) => {
    return (
        <TitleRow>
            {iconName ? <Icon iconName={iconName} /> : null}
            {href ? (
                <StyledLink href={href} target={target}>
                    {children}
                </StyledLink>
            ) : (
                children
            )}
            {tooltip ? (
                <PlainTooltip placement="top" tooltipContent={tooltip}>
                    <span>
                        <InfoIcon iconName="info" />
                    </span>
                </PlainTooltip>
            ) : null}
            {customElement && customElement}
        </TitleRow>
    );
};
BoxTitle.displayName = "BoxTitle";
export default BoxTitle;
export { InfoIcon, Icon };
