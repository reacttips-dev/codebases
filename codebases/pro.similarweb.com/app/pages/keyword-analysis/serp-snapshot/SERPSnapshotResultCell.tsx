import { FunctionComponent } from "react";
import * as React from "react";
import { SERP_MAP } from "pages/website-analysis/traffic-sources/search/components/serp/SerpTypes";
import { ESERPMetaType } from "pages/keyword-analysis/serp-snapshot/types";
import classNames from "classnames";
import { i18nFilter } from "filters/ngFilters";
import {
    FeatureRowResultCellContainer,
    FeatureRowResultCellIcon,
    FeatureRowResultCellLeftSideContainer,
    FeatureRowResultCellText,
    SERPSnapshotResultCellWrapper,
    StyledEnrichButton,
    StyledEnrichButtonText,
    StyledUrlCell,
    UrlTitle,
} from "pages/keyword-analysis/serp-snapshot/StyledComponents";
import { SERPSnapshotCellProps } from "pages/keyword-analysis/serp-snapshot/types";
import { UrlCell } from "components/React/Table/cells";

export const SERPSnapshotResultCell: FunctionComponent<SERPSnapshotCellProps> = (props) => {
    const { value, row, onCellClick } = props;
    const onClick = (e: Event) => {
        e.stopPropagation();
        onCellClick(e, row?.index);
    };
    //for future use to see the enrich rows
    if (row.type === ESERPMetaType.FEATURE) {
        const { icon, name, id } = SERP_MAP[row.serpFeature];
        return (
            <FeatureRowResultCellContainer justifyContent="space-between" alignItems="center">
                <FeatureRowResultCellLeftSideContainer
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <FeatureRowResultCellIcon iconName={icon} size="xs" />
                    <FeatureRowResultCellText>{name}</FeatureRowResultCellText>
                </FeatureRowResultCellLeftSideContainer>
                <StyledEnrichButton
                    height={24}
                    onClick={onClick}
                    className={classNames("enrich")}
                    iconName={"chev-down"}
                >
                    <StyledEnrichButtonText>
                        {i18nFilter()("keyword.research.serp.snapshot.table.enrich.button.title")}
                    </StyledEnrichButtonText>
                </StyledEnrichButton>
            </FeatureRowResultCellContainer>
        );
    } else {
        return (
            <SERPSnapshotResultCellWrapper alignItems="flex-start">
                {row.title ? <UrlTitle>{row.title}</UrlTitle> : <div>-</div>}
                {value ? (
                    <StyledUrlCell>
                        <UrlCell site={value} />
                    </StyledUrlCell>
                ) : (
                    <div>-</div>
                )}
            </SERPSnapshotResultCellWrapper>
        );
    }
};
