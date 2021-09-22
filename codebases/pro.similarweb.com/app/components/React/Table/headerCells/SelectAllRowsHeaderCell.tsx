import { CheckboxIcon } from "@similarweb/ui-components/dist/dropdown/";
import * as classNames from "classnames";
import * as React from "react";
import { StatelessComponent } from "react";
import { SWReactTableWrapperContextConsumer } from "../SWReactTableWrapperSelectionContext";

interface ISelectAllRowsHeaderCellProps {
    allRowsSelected: boolean;
    onSelectAllRows: () => void;
}
export const SelectAllRowsHeaderCell: StatelessComponent<ISelectAllRowsHeaderCellProps> = ({
    allRowsSelected,
    onSelectAllRows,
}) => {
    const className = classNames("row-selection", { "row-selection--selected": allRowsSelected });
    return (
        <div
            className={className}
            onClick={() => onSelectAllRows()}
            data-automation-select-all={true}
        >
            <CheckboxIcon selected={allRowsSelected} />
        </div>
    );
};
SelectAllRowsHeaderCell.defaultProps = {
    allRowsSelected: false,
    onSelectAllRows: () => null,
};

export const SelectAllRowsHeaderCellConsumer = (props) => {
    return (
        <SWReactTableWrapperContextConsumer>
            {({ onSelectAllRows, allRowsSelected }) => {
                const SelectAllRowsHeaderCellProps = {
                    ...props,
                    onSelectAllRows,
                    allRowsSelected,
                };
                return <SelectAllRowsHeaderCell {...SelectAllRowsHeaderCellProps} />;
            }}
        </SWReactTableWrapperContextConsumer>
    );
};
