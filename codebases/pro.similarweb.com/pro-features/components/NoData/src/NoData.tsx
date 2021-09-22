import { SWReactIcons } from "@similarweb/icons";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { NoData as DefaultNoData } from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import * as React from "react";
import styled from "styled-components";
import { FlexColumn, FlexRow } from "../../../styled components/StyledFlex/src/StyledFlex";
import WithTranslation from "../../WithTranslation/src/WithTranslation";

export const NoDataIcon: any = styled(SWReactIcons)`
    height: 90px;
    width: 194px;
    margin-bottom: 32px;
`;

NoDataIcon.displayName = "NoDataIcon";

export const NoDataTitle = styled.div`
    font-size: 24px;
    letter-spacing: 0.2px;
    margin-bottom: 24px;
    color: rgba(42, 62, 82, 0.6);
    text-align: center;
    font-weight: 500;
    max-width: 74%;
`;
NoDataTitle.displayName = "NoDataTitle";

export const NoDataSubtitle = styled(NoDataTitle)`
    font-size: 14px;
    letter-spacing: 0.1;
    margin: 0;
`;
NoDataSubtitle.displayName = "NoDataSubtitle";

export const NoDataContainer: any = styled(FlexColumn)`
    align-items: center;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    font-family: Roboto;
`;
NoDataContainer.displayName = "NoDataContainer";

export const NoDataLandscapeTitleContainer: any = styled(FlexRow)`
    align-items: flex-end;
    margin-bottom: 16px;
    ${NoDataIcon} {
        height: 24px;
        width: 24px;
        margin-bottom: 0;
        margin-right: 8px;
    }
    ${NoDataTitle} {
        margin-bottom: 0;
    }
`;
NoDataLandscapeTitleContainer.displayName = "NoDataLandscapeTitleContainer";

export const NoDataRowContainer = styled(FlexRow)`
    ${NoDataSubtitle} {
        text-align: left;
        padding: 0px 0px 0px 10px;
        align-self: center;
    }
    ${NoDataIcon} {
        width: 32px;
        height: 32px;
        padding-top: 3px;
        margin-bottom: 0px;
    }
`;
NoDataRowContainer.displayName = "NoDataRowContainer";

const DefaultNoDataLayoutContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
`;

const noDataDefaultProps = {
    iconName: "no-data-lab",
    title: "global.nodata.notavilable",
    subtitle: "global.nodata.notavilable.subtitle",
};

export const NoData: any = ({
    title,
    subtitle,
    iconName,
    SvgImage,
    className,
}: {
    title?: string;
    subtitle?: string;
    iconName?: string;
    SvgImage?: any;
    className?: string;
}) => (
    <WithTranslation>
        {(translate) => (
            <NoDataContainer className={className}>
                {SvgImage ? <SvgImage /> : <NoDataIcon iconName={iconName} />}
                <NoDataTitle>{translate(title)}</NoDataTitle>
                {subtitle && <NoDataSubtitle>{translate(subtitle)}</NoDataSubtitle>}
            </NoDataContainer>
        )}
    </WithTranslation>
);

export const NoDataLandscape: any = ({
    title,
    subtitle,
}: {
    title?: string;
    subtitle?: string;
}) => (
    <DefaultNoDataLayoutContainer>
        <DefaultNoData noDataTitleKey={title} noDataSubTitleKey={subtitle} />
    </DefaultNoDataLayoutContainer>
);

SWReactRootComponent(NoDataLandscape, "NoDataLandscape");

export const NoDataRow: any = ({
    description,
    iconName,
}: {
    description: string;
    iconName?: string;
}) => (
    <WithTranslation>
        {(translate) => (
            <NoDataContainer>
                <NoDataRowContainer>
                    <NoDataIcon iconName={iconName} />
                    <NoDataSubtitle>{translate(description)}</NoDataSubtitle>
                </NoDataRowContainer>
            </NoDataContainer>
        )}
    </WithTranslation>
);

NoData.defaultProps = noDataDefaultProps;
NoDataLandscape.defaultProps = noDataDefaultProps;
NoDataRow.defaultProps = noDataDefaultProps;
