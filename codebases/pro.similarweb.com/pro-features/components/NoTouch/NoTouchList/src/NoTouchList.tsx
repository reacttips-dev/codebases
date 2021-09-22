import * as React from "react";
import {
    StyledNoTouchList,
    StyledNoTouchListIcon,
    StyledNoTouchListLine,
    StyledNoTouchListTitle,
} from "./StyledComponents";

interface INoTouchList {
    children?: any;
    className?: string;
    title?: string;
}

const NoTouchList = ({ children, className, title }: INoTouchList) => (
    <div className={className}>
        {title && <StyledNoTouchListTitle>{title}</StyledNoTouchListTitle>}
        <StyledNoTouchList>
            {React.Children.map(children, (child) => (
                <StyledNoTouchListLine>
                    <StyledNoTouchListIcon iconName="checked" />
                    {child}
                </StyledNoTouchListLine>
            ))}
        </StyledNoTouchList>
    </div>
);

export default NoTouchList;
