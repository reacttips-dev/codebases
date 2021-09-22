import { IconButton } from "@similarweb/ui-components/dist/button";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import { allTrackers } from "../../../services/track/track";

export const ExcelButtonWrapper = styled.div`
    position: relative;
    bottom: 5px;
`;

export interface IExcelButtonProps {
    url: string;
    trackName: string;
    className?: string;
}

export const ExcelButton: StatelessComponent<IExcelButtonProps> = ({
    url,
    trackName,
    className,
}) => {
    const trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", `${trackName}/Download Excel`);
    };

    return (
        <div>
            <ExcelButtonWrapper className={className}>
                <a href={url} onClick={trackExcelDownload}>
                    <IconButton type="flat" iconName="excel" />
                </a>
            </ExcelButtonWrapper>
        </div>
    );
};
export default SWReactRootComponent(ExcelButton, "ExcelButton");
