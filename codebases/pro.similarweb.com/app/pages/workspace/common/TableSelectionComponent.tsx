import { colorsPalettes } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import * as React from "react";
import styled from "styled-components";
import {
    TableSelection,
    TableSelectionContent,
    TableSelectionSelector,
    TableSelectionSeparator,
} from "../../../../.pro-features/components/TableSelection/src/TableSelection";
import { SWReactTableWrapperContextConsumer } from "../../../components/React/Table/SWReactTableWrapperSelectionContext";
import { i18nFilter } from "../../../filters/ngFilters";

const TableSelectionWrapper = styled.div`
    width: 100%;
    ${TableSelectionContent} {
        flex-grow: 1;
        justify-content: space-between;
    }
    ${TableSelectionSelector} {
        margin-right: 10px;
    }
    ${TableSelectionSeparator} {
        opacity: 0;
    }
    button,
    button:hover {
        .SWReactIcons svg path {
            fill: ${colorsPalettes.carbon[0]};
        }
    }
`;

export const TableSelectionComponent = ({ onRemoveOpportunities }) => (
    <SWReactTableWrapperContextConsumer>
        {({ selectedRows, clearAllSelectedRows }) => {
            const text = i18nFilter()("workspaces.table_selected.summary", {
                number: selectedRows.length.toString(),
            });
            return (
                <TableSelectionWrapper>
                    <TableSelection
                        key="1"
                        selectedText={text}
                        onCloseClick={clearAllSelectedRows}
                        addToGroupLabel=""
                        isVisible={selectedRows.length > 0}
                        groupSelectorElement={
                            <PlainTooltip
                                tooltipContent={i18nFilter()("workspaces.table_selected.delete")}
                                placement="top"
                            >
                                <div>
                                    <IconButton
                                        type="flat"
                                        iconName="delete"
                                        onClick={() => {
                                            onRemoveOpportunities(selectedRows);
                                            clearAllSelectedRows();
                                        }}
                                    />
                                </div>
                            </PlainTooltip>
                        }
                    />
                </TableSelectionWrapper>
            );
        }}
    </SWReactTableWrapperContextConsumer>
);
