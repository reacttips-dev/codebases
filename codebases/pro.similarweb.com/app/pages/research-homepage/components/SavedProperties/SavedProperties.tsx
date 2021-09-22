import * as React from "react";
import { FC } from "react";
import styled from "styled-components";
import { BoxStates, resourcesNames } from "../../pageDefaults";
import { i18nFilter } from "filters/ngFilters";
import { Title } from "@similarweb/ui-components/dist/title";
import { Box } from "@similarweb/ui-components/dist/box";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { LoadingBox } from "../LoadingBox";
import I18n from "components/React/Filters/I18n";
import { AssetsService } from "services/AssetsService";
import { FailedMsg } from "../FailedBox";
import { SWReactIcons } from "@similarweb/icons";
import StyledBoxSubtitle from "../../../../../.pro-features/styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";

export const EmptySubtitle = styled(StyledBoxSubtitle)`
    width: 240px;
    font-size: 14px;
    text-align: center;
    color: rgba(49, 70, 93, 0.8);
`;
EmptySubtitle.displayName = "EmptySubtitle";

export const SavedProperties: FC<any> = (props) => {
    const resourceName = resourcesNames.savedProperties;
    switch (props.state) {
        case BoxStates.LOADING:
            return <LoadingBox resourceName={resourceName} />;
        case BoxStates.READY:
            return <Ready {...props} resourceName={resourceName} />;
        case BoxStates.FAILED:
            return <Failed {...props} resourceName={resourceName} />;
        case BoxStates.EMPTY:
            return <Empty />;
    }
};

const title = "research.homepage.savedAnalysis.title";

const Ready: FC<any> = ({ table }) => {
    return (
        <Box className="Box--researchHomepage fade-items-in">
            <Title className="Box-Title--researchHomepage Title saved-properties-title populated">
                <I18n>{title}</I18n>
                <span
                    className="scss-tooltip scss-tooltip--s"
                    data-scss-tooltip={i18nFilter()("research.homepage.savedAnalysis.tooltip")}
                >
                    <SWReactIcons iconName="info" className="info-icon" />
                </span>
            </Title>
            <div className="line-separator"></div>
            <MiniFlexTable
                key="MiniFlexTable"
                className="MiniFlexTable MiniFlexTable--swProTheme"
                data={table.data}
                columns={table.columns}
                metadata={table.metadata}
                pagination={true}
                onPaging={table.onPaging}
            />
        </Box>
    );
};

const Empty: FC<{}> = () => {
    const img = AssetsService.assetUrl(`/images/Saved-properties.svg`);

    return (
        <Box className="Box--researchHomepage Box--researchHomepage--empty">
            <Title className="Box-Title--researchHomepage Title saved-properties-title">
                <I18n>{title}</I18n>
            </Title>
            <EmptySubtitle>
                <I18n>{"research.homepage.savedAnalysis.description"}</I18n>
            </EmptySubtitle>
            <img className="Box-Img--researchHomepage-empty" src={img} />
        </Box>
    );
};

const Failed: FC<{}> = () => {
    return (
        <Box className="Box--researchHomepage">
            <Title className="Box-Title--researchHomepage Title saved-properties-title failed">
                <I18n>{title}</I18n>
                <span
                    className="scss-tooltip scss-tooltip--s"
                    data-scss-tooltip={i18nFilter()("research.homepage.savedAnalysis.tooltip")}
                >
                    <SWReactIcons iconName="info" className="info-icon" />
                </span>
            </Title>
            <FailedMsg key="FailedMsg" error="something.went.wrong.error.message" />
        </Box>
    );
};
