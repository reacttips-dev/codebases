import React from "react";
import I18n from "../../../../components/React/Filters/I18n";
import { ChangePercentage } from "../../../../components/React/Table/cells";
import { LeadGeneratorChangePercentageRightAlign, NewStyle } from "./StyledComponents";

export function LeadGeneratorChangePercentage(props) {
    const { value = "N/A" as any } = props;
    switch (value) {
        case "Infinity":
        case 999999999:
            return (
                <LeadGeneratorChangePercentageRightAlign>
                    <NewStyle>
                        <I18n>grow.lead_generator.exist.table.cell.infinite_change</I18n>
                    </NewStyle>
                </LeadGeneratorChangePercentageRightAlign>
            );
        case null:
        case "N/A":
            return (
                <LeadGeneratorChangePercentageRightAlign>
                    N/A
                </LeadGeneratorChangePercentageRightAlign>
            );
        default:
            return <ChangePercentage {...props} />;
    }
}
