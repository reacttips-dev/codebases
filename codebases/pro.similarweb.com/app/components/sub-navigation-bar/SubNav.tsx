import React, { FC } from "react";

interface ISubNavProps {
    backButton?: React.ReactNode;
    bottomRightComponent?: React.ReactNode;
    topLeftComponent?: React.ReactNode;
    bottomLeftComponent?: React.ReactNode;
    education?: React.ReactNode;
    numberOfComparedItems?: number;
    onTopComponentMouseEnter?: () => void;
    onTopComponentMouseLeave?: () => void;
}

export const SubNav: FC<ISubNavProps> = (props) => {
    const {
        backButton,
        topLeftComponent,
        bottomRightComponent,
        education,
        bottomLeftComponent,
        onTopComponentMouseEnter,
        onTopComponentMouseLeave,
    } = props;

    return (
        <>
            <div
                className="subNav u-flex-row u-flex-center"
                onMouseEnter={onTopComponentMouseEnter}
                onMouseLeave={onTopComponentMouseLeave}
            >
                {backButton}
                {topLeftComponent && <div className="subNav-header">{topLeftComponent}</div>}
            </div>
            <div className="subNav u-flex-row u-flex-center u-flex-space-between subNav-secondRow">
                <div className="subNav-page-title">{bottomLeftComponent}</div>
                <div className="subNav-filters">{bottomRightComponent}</div>
            </div>
            <div>
                <div className="subNav-education">{education}</div>
            </div>
        </>
    );
};
