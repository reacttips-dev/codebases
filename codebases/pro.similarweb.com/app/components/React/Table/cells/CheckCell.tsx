import * as React from "react";
import { FunctionComponent } from "react";

export interface ICheckCellProps {
    value: boolean;
}
export const CheckCell: FunctionComponent<ICheckCellProps> = ({ value }) => {
    return value ? (
        <div className="u-alignCenter">
            <i className="sw-icon-checkmark_circle" />
        </div>
    ) : null;
};
