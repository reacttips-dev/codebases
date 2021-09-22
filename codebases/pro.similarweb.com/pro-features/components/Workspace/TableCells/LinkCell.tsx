import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import * as React from "react";
import { ReactNode, StatelessComponent } from "react";
import styled from "styled-components";
import * as _ from "lodash";

const StyledLinkCell = styled.a`
    display: inline-block;
    text-decoration: none;
    color: inherit;
    width: calc(100% - 15px);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

interface ILinkCellProps {
    href: string;
    target?: string;
    children?: ReactNode;
    className?: string;
    title?: string;
    value: number;
    onClick?: () => void;
}

export const LinkCell: StatelessComponent<ILinkCellProps> = ({
    href,
    target,
    children,
    className,
    value,
    onClick,
    title,
}) => {
    return (
        <StyledLinkCell href={href} onClick={onClick} target={target} title={title}>
            {value}
        </StyledLinkCell>
    );
};

LinkCell.displayName = "LinkCell";
LinkCell.defaultProps = {
    href: "",
    target: "_self",
    onClick: _.noop,
};
