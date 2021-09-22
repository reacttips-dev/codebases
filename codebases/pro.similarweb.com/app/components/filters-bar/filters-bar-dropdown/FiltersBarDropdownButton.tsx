import * as classNames from "classnames";
import { FC } from "react";
import { DropdownButton, IDropdownButtonProps } from "@similarweb/ui-components/dist/dropdown";

interface IFiltersBarDropdownButton extends IDropdownButtonProps {
    className?: string;
}

export const FiltersBarDropdownButton: FC<IFiltersBarDropdownButton> = ({
    className,
    ...props
}) => (
    <DropdownButton
        {...props}
        cssClass={classNames("DropdownButton--filtersBarDropdownButton", className)}
    />
);
