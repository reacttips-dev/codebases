import React from "react";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { AddWebsitesBubble } from "pages/lead-generator/lead-generator-wizard/components/AddWebsitesBubble";

const selectionColumn = {
    fixed: true,
    width: 48,
    cellComponent: (props) => (
        <div className="u-alignCenter">
            <RowSelectionConsumer {...props} />
            {props.row.index === 0 && <AddWebsitesBubble />}
        </div>
    ),
    headerComponent: () => null,
    visible: true,
    sortable: false,
};

export default selectionColumn;
