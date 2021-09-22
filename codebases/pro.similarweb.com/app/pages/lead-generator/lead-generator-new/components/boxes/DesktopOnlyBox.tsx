import React from "react";
import { createFilterBoxes, IFiltersBoxProps } from "./FiltersBox";
import { isDesktopDevice } from "pages/lead-generator/lead-generator-new/helpers";
import StyledFiltersBox from "pages/lead-generator/lead-generator-new/components/FiltersBox/StyledFiltersBox";

export interface IDesktopOnlyBoxProps extends IFiltersBoxProps {
    device: string;
}

const DesktopOnlyBox: React.FC<IDesktopOnlyBoxProps> = (props) => {
    const { filters, isActive, setActive, device, technologies } = props;
    const isDesktop = isDesktopDevice(device);

    return (
        <StyledFiltersBox
            isActive={isActive}
            setActive={setActive}
            isDesktopOnly={isDesktop}
            {...props}
        >
            {createFilterBoxes(filters, isActive, setActive, isDesktop, technologies)}
        </StyledFiltersBox>
    );
};

export default DesktopOnlyBox;
