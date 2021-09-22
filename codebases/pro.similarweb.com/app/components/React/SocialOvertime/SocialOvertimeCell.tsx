import { IconButton } from "@similarweb/ui-components/dist/button";
import React from "react";

export const OvertimeDefaultCell = ({ row }) => {
    return <>{!row.parent && <IconButton iconName="chev-down" type="flat" className="enrich" />}</>;
};
