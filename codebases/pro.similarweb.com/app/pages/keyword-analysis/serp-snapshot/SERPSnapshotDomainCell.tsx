import { FC } from "react";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import { ESERPMetaType, SERPSnapshotCellProps } from "./types";
import { FeatureRowDomainCellText } from "pages/keyword-analysis/serp-snapshot/StyledComponents";
import { i18nFilter } from "filters/ngFilters";

export const SERPSnapshotDomainCell: FC<SERPSnapshotCellProps> = (props) => {
    const { row, onCellClick } = props;
    const onClick = (e) => {
        e.stopPropagation();
        onCellClick(e, row?.index);
    };
    //for future use to see the enrich rows
    if (row.type === ESERPMetaType.FEATURE) {
        return (
            <FlexRow
                justifyContent="flex-start"
                alignItems="center"
                onClick={onClick}
                className="enrich"
                style={{ cursor: "pointer" }}
            >
                <FeatureRowDomainCellText>
                    {i18nFilter()(
                        "keyword.research.serp.snapshot.table..domain.cell.domain.count",
                        { domains: row.records?.length },
                    )}
                </FeatureRowDomainCellText>
            </FlexRow>
        );
    } else {
        return <CoreWebsiteCell domain={row.site} icon={row.favicon} />;
    }
};
