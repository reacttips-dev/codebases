import { TableDropdownButton } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import * as _ from "lodash";
import * as React from "react";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import swLog from "@similarweb/sw-log";

const TableDropdownComponentInner = (props) => {
    const { tableOptions, onDropdownToggle, setRef, tableData, clickedRowIndex } = props;
    if (tableOptions.EnrichedRowComponent) {
        if (tableOptions.enrichedRowComponentHeight > 0) {
            return (
                <Dropdown
                    appendTo={
                        tableOptions.enrichedRowComponentAppendTo
                            ? tableOptions.enrichedRowComponentAppendTo
                            : ".flex-table"
                    }
                    autoPlacement={false}
                    dropdownPopupHeight={tableOptions.enrichedRowComponentHeight}
                    onToggle={onDropdownToggle}
                    onClick={_.noop}
                    {...(typeof tableOptions.enrichedRowComponentClass
                        ? { cssClassContainer: tableOptions.enrichedRowComponentClass }
                        : {})}
                >
                    <TableDropdownButton setRef={setRef} />
                    <tableOptions.EnrichedRowComponent
                        row={tableData[clickedRowIndex]}
                        height={tableOptions.enrichedRowComponentHeight}
                    />
                </Dropdown>
            );
        } else {
            swLog.error(`You must pass a "enrichedRowComponentHeight" prop.`);
        }
    }
    return null;
};

const propsAreEqual = (prevProps, nextProps) => {
    const { tableOptions, tableData, clickedRowIndex } = prevProps;
    const {
        tableOptions: nextTableOptions,
        tableData: nextTableData,
        clickedRowIndex: nextClickedRowIndex,
    } = nextProps;
    return (
        tableOptions === nextTableOptions &&
        tableData === nextTableData &&
        clickedRowIndex === nextClickedRowIndex
    );
};
export const TableDropdownComponent = React.memo(TableDropdownComponentInner, propsAreEqual);
