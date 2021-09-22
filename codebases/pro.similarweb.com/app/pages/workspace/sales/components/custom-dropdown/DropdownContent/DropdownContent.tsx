import React from "react";
import classNames from "classnames";
import DropdownSearch from "../DropdownSearch/DropdownSearch";

type DropdownContentProps = {
    open: boolean;
    children: React.ReactNode;
    className?: string;
    searchProps?: {
        value: string;
        placeholder: string;
        onChange(value: string): void;
    };
    includesSearch?: boolean;
};

const DropdownContent: React.FC<DropdownContentProps> = ({
    open,
    children,
    searchProps,
    className = null,
    includesSearch = false,
}) => {
    return (
        <div className={classNames(className, { "--closed": !open })}>
            {includesSearch && searchProps && <DropdownSearch open={open} {...searchProps} />}
            {children}
        </div>
    );
};

export default React.memo(DropdownContent);
