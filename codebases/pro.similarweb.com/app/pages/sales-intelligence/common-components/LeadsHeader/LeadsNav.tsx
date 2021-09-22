import React, { FC } from "react";

interface ISubNavProps {
    topLeftComponent?: React.ReactNode;
    topRightComponent?: React.ReactNode;
    numberOfComparedItems?: number;
    onTopComponentMouseEnter?: () => void;
    onTopComponentMouseLeave?: () => void;
}

export const LeadsNav: FC<ISubNavProps> = (props) => {
    const {
        topLeftComponent,
        topRightComponent,
        onTopComponentMouseEnter,
        onTopComponentMouseLeave,
    } = props;

    return (
        <>
            <div
                className="subNav u-flex-row u-flex-center u-flex-space-between"
                onMouseEnter={onTopComponentMouseEnter}
                onMouseLeave={onTopComponentMouseLeave}
            >
                {topLeftComponent && <div className="subNav-header">{topLeftComponent}</div>}
                {topRightComponent && <div className="subNav-header">{topRightComponent}</div>}
            </div>
        </>
    );
};
