import { totalTraffic } from "./totalTraffic";
import { paidTraffic } from "./paidTraffic";
import { mobileTraffic } from "./mobileTraffic";
import { organicTraffic } from "./organicTraffic";
import { RowSelectionConsumer } from "components/React/Table/cells/RowSelection";
import { AddWebsitesBubble } from "pages/lead-generator/lead-generator-wizard/components/AddWebsitesBubble";
import React from "react";

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

export const configs = {
    total: [selectionColumn, ...totalTraffic],
    paid: [selectionColumn, ...paidTraffic],
    organic: [selectionColumn, ...organicTraffic],
    mobile: [selectionColumn, ...mobileTraffic],
};
