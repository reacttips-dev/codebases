import SWReactRootComponent from "decorators/SWReactRootComponent";
import React, { FC } from "react";

interface IDashboardLoaderProps {
    isOpened: boolean;
    title: string;
    subtitle: string;
}

export const DashboardLoader: FC<IDashboardLoaderProps> = (props) => {
    const { isOpened, title, subtitle } = props;
    if (!isOpened) return null;

    return (
        <div className="dashboard-loader-container active">
            <div className="loader-content">
                <div className="pdf-jumping"></div>
                <div className="loader-text-title">{title}</div>
                <div className="loader-text">{subtitle}</div>
            </div>
        </div>
    );
};

SWReactRootComponent(DashboardLoader, "DashboardLoader");
