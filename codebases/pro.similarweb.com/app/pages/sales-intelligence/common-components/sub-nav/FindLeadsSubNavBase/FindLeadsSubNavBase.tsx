import React from "react";
import { StyledSubNavBase } from "./styles";

type FindLeadsSubNavBaseProps = {
    leftComponent?: React.ReactNode;
    rightComponent?: React.ReactNode;
    className?: string;
};

const FindLeadsSubNavBase = (props: FindLeadsSubNavBaseProps) => {
    const { leftComponent, rightComponent, className = null } = props;

    return (
        <StyledSubNavBase className={className} hasBoth={Boolean(leftComponent && rightComponent)}>
            {leftComponent}
            {rightComponent}
        </StyledSubNavBase>
    );
};

export default FindLeadsSubNavBase;
