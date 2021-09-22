import { Button } from "@similarweb/ui-components/dist/button";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { countryTextByIdFilter, i18nFilter, subCategoryFilter } from "filters/ngFilters";
import * as numeral from "numeral";
import * as React from "react";
import { AssetsService } from "services/AssetsService";
import styled from "styled-components";
import { Spinner } from "../../../../.pro-features/components/Loaders/src/Spinner";
import {
    IProModalCustomStyles,
    ProModal,
} from "../../../../.pro-features/components/Modals/src/ProModal";
import { DefaultCell, RankCell } from "../../../components/React/Table/cells";
import { LeadGeneratorInfoIcon } from "../components/elements";
import LeadGeneratorTooltip from "../components/LeadGeneratorTooltip";
import {
    LeadGeneratorModalContent,
    LeadGeneratorModalFooter,
    LeadGeneratorModalSubtitle,
    LeadGeneratorModalTitle,
    PreviewModalNoResultsContent,
    PreviewModalTableHeader,
    PreviewModalTableImgWrapper,
    PreviewModalTableWebsiteCell,
} from "./elements";
import { LoaderListItems } from "components/Loaders/src/LoaderListItems";

// This needs to be a type and not an interface
// It's supposidly "by design"
// https://github.com/microsoft/TypeScript/issues/15300
type IPreviewRecord = {
    site: string;
    country: string;
    category: string;
    rank: string;
    visits: string;
    favicon: string;
};

interface IPreviewData {
    records: IPreviewRecord[];
    totalCount: number;
}

interface IPreviewModalProps {
    isOpen: boolean;
    reportDate: string;
    previewData: IPreviewData;
    isDesktopOnly?: boolean;
    onClickClose: () => void;
    onClickRun: () => void;
}

const proModalStyles: IProModalCustomStyles = {
    content: {
        boxSizing: "content-box",
        width: "640px",
    },
};

export const PreviewSpinner = styled(Spinner)`
    margin: 0 auto;
    position: relative;
    top: 16px;
`;

const PreviewModal: React.FC<IPreviewModalProps> = ({
    isOpen,
    reportDate,
    previewData,
    isDesktopOnly,
    onClickClose,
    onClickRun,
}) => {
    const trans = i18nFilter();
    const createTableHeaderComponent = (props) => (
        <PreviewModalTableHeader>
            {props.displayName}
            <LeadGeneratorTooltip
                text={trans(props.tooltip)}
                cssClass="plainTooltip-element Tooltip-In-Modal"
            >
                <LeadGeneratorInfoIcon />
            </LeadGeneratorTooltip>
        </PreviewModalTableHeader>
    );

    const SiteCellComponent = (props) => (
        <PreviewModalTableWebsiteCell>
            <PreviewModalTableImgWrapper>
                <img src={props.row.favicon} />
            </PreviewModalTableImgWrapper>
            <span>{props.value}</span>
        </PreviewModalTableWebsiteCell>
    );

    const CountryCellComponent = (props) => (
        <DefaultCell {...props} value={countryTextByIdFilter()(props.value)} />
    );

    const CategoryCellComponent = (props) => (
        <DefaultCell
            {...props}
            value={
                props.value.indexOf("/") > -1
                    ? subCategoryFilter()(props.value.split("/")[1])
                    : subCategoryFilter()(props.value)
            }
        />
    );

    const RankCellComponent = (props) => <RankCell {...props} />;

    const VisitsCellComponent = (props) => <DefaultCell {...props} format="minVisitsAbbr" />;

    const tableColumns = [
        {
            field: "site",
            displayName: trans("grow.lead_generator.exist.table.column.site"),
            tooltip: trans("grow.lead_generator.exist.table.tooltip.site"),
            headerComponent: createTableHeaderComponent,
            cellComponent: SiteCellComponent,
        },
        {
            field: "country",
            displayName: trans("grow.lead_generator.exist.table.column.country"),
            tooltip: trans("grow.lead_generator.exist.table.tooltip.country"),
            headerComponent: createTableHeaderComponent,
            cellComponent: CountryCellComponent,
            ppt: {
                // override the table column format when rendered in ppt
                overrideFormat: "Country",
            },
        },
        {
            field: "category",
            displayName: trans("grow.lead_generator.exist.table.column.category"),
            tooltip: trans("grow.lead_generator.exist.table.tooltip.category"),
            headerComponent: createTableHeaderComponent,
            cellComponent: CategoryCellComponent,
        },
        {
            field: "rank",
            displayName: trans("grow.lead_generator.exist.table.column.rank"),
            tooltip: trans("grow.lead_generator.exist.table.tooltip.rank"),
            headerComponent: createTableHeaderComponent,
            cellComponent: RankCellComponent,
        },
        {
            field: "visits",
            displayName: isDesktopOnly
                ? trans("grow.lead_generator.exist.table.column.desktop_visits")
                : trans("grow.lead_generator.exist.table.column.visits"),
            tooltip: isDesktopOnly
                ? trans("grow.lead_generator.exist.table.tooltip.desktop_visits")
                : trans("grow.lead_generator.exist.table.tooltip.visits"),
            headerComponent: createTableHeaderComponent,
            cellComponent: VisitsCellComponent,
        },
    ];

    const createPreviewModalLoading = () => (
        <LoaderListItems
            title={trans("grow.lead_generator.modal.preview.loading.title")}
            subtitle={trans("grow.lead_generator.modal.preview.loading.subtitle")}
            textSize="large"
        />
    );

    const createPreviewModalNoResults = () => (
        <div>
            <PreviewModalNoResultsContent>
                <img src={AssetsService.assetUrl(`/images/empty.svg`)} alt="empty" />
                <LeadGeneratorModalTitle>
                    {trans("grow.lead_generator.modal.preview.no_results.title")}
                </LeadGeneratorModalTitle>
                <LeadGeneratorModalSubtitle>
                    {trans("grow.lead_generator.modal.preview.no_results.subtitle")}
                </LeadGeneratorModalSubtitle>
            </PreviewModalNoResultsContent>
            <LeadGeneratorModalFooter>
                <Button type="flat" onClick={onClickClose}>
                    {trans("grow.lead_generator.modal.preview.cancel")}
                </Button>
            </LeadGeneratorModalFooter>
        </div>
    );

    function createPreviewModalContent() {
        const title =
            previewData.totalCount === 1
                ? trans("grow.lead_generator.modal.preview.title.one_result")
                : trans("grow.lead_generator.modal.preview.title", {
                      number: numeral(previewData.totalCount).format("0,0").toString(),
                  });
        const subtitle =
            previewData.records.length === 1
                ? trans("grow.lead_generator.modal.preview.subtitle.one_result", {
                      run: trans("grow.lead_generator.modal.preview.run"),
                  })
                : trans("grow.lead_generator.modal.preview.subtitle", {
                      run: trans("grow.lead_generator.modal.preview.run"),
                      number: previewData.records.length.toString(),
                  });
        return (
            <div>
                <LeadGeneratorModalContent>
                    <LeadGeneratorModalTitle>{`${title} (${reportDate})`}</LeadGeneratorModalTitle>
                    <LeadGeneratorModalSubtitle>{subtitle}</LeadGeneratorModalSubtitle>
                    <MiniFlexTable data={previewData.records} columns={tableColumns} />
                </LeadGeneratorModalContent>
                <LeadGeneratorModalFooter>
                    <Button type="flat" onClick={onClickClose}>
                        {trans("grow.lead_generator.modal.preview.back")}
                    </Button>
                    <Button onClick={onClickRun}>
                        {trans("grow.lead_generator.modal.preview.run")}
                    </Button>
                </LeadGeneratorModalFooter>
            </div>
        );
    }

    return (
        <ProModal isOpen={isOpen} onCloseClick={onClickClose} customStyles={proModalStyles}>
            {Object.keys(previewData).length
                ? previewData.records.length
                    ? createPreviewModalContent()
                    : createPreviewModalNoResults()
                : createPreviewModalLoading()}
            <img
                src={AssetsService.assetUrl(`/images/empty.svg`)}
                style={{ display: "none" }}
                alt="empty"
            />
        </ProModal>
    );
};

export default PreviewModal;
