import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import * as numeral from "numeral";
import * as React from "react";
import { PureComponent } from "react";
import { allTrackers } from "services/track/track";
import { LeadGeneratorInfoIcon } from "../../components/elements";
import LeadGeneratorTooltip from "../../components/LeadGeneratorTooltip";
import LeadGeneratorUtils from "../../LeadGeneratorUtils";
import {
    LeadGeneratorAllDownloadIcon,
    RunsTableCell,
    RunsTableCellButton,
    RunsTableContent,
    RunsTableFooter,
    RunsTableHeader,
    ChangeTableCell,
    FirstRunsTableCell,
} from "./elements";

interface IRunsTableProps {
    reportId: number;
    reportRuns: any[];
}

interface IRunsTableState {
    page: number;
}

function DownloadExcel({ excelLink, onTrack }) {
    return (
        <LeadGeneratorTooltip
            text={i18nFilter()("grow.lead_generator.exist.table.download_excel")}
            key="DownloadExcelBTN"
        >
            <a href={excelLink} style={{ textDecoration: "none" }} onClick={onTrack}>
                <LeadGeneratorAllDownloadIcon />
            </a>
        </LeadGeneratorTooltip>
    );
}

function ViewReport({ reportId, resultsPage, onTrack }) {
    return (
        <a href={resultsPage} key="ViewReportBTN" style={{ textDecoration: "none" }}>
            <Button type="flat" onClick={onTrack}>
                {i18nFilter()("grow.lead_generator.all.report.view")}
            </Button>
        </a>
    );
}

function RunActions({ value, row }) {
    return (
        <RunsTableCellButton>
            <ViewReport
                {...row}
                onTrack={(reportId) =>
                    allTrackers.trackEvent("Internal Link", "click", `reports list/${reportId}`)
                }
            />
            <DownloadExcel
                {...row}
                onTrack={() => allTrackers.trackEvent("Download", "submit-ok", "Table/Excel")}
            />
        </RunsTableCellButton>
    );
}

function TableHeader({ displayName, tooltip }, first = false) {
    return (
        <RunsTableHeader first={first}>
            <span>{displayName}</span>
            {tooltip && (
                <LeadGeneratorTooltip text={tooltip}>
                    <LeadGeneratorInfoIcon />
                </LeadGeneratorTooltip>
            )}
        </RunsTableHeader>
    );
}

function Change({ value }) {
    const text = Object.entries(value)
        .filter(([key, val]) => !!val)
        .map(
            ([key, val]) =>
                `${numeral(val).format("0,0")} ${i18nFilter()(
                    `grow.lead_generator.all.report.change.${key}`,
                )}`,
        )
        .join(" • ");
    if (text.length > 40) {
        return (
            <ChangeTableCell>
                <PlainTooltip tooltipContent={text}>
                    <span>{text}</span>
                </PlainTooltip>
            </ChangeTableCell>
        );
    }
    return (
        <ChangeTableCell>
            <span>{text}</span>
        </ChangeTableCell>
    );
}

class RunsTable extends PureComponent<IRunsTableProps, IRunsTableState> {
    private _swNavigator;
    private pageSize;
    private totalPages;
    private pagesLength;
    private columns;

    constructor(props) {
        super(props);

        this._swNavigator = Injector.get("swNavigator") as any;
        this.initComponent();

        this.state = {
            page: 1,
        };
    }

    private initComponent() {
        this.pageSize = 5;
        this.totalPages = Math.ceil(this.props.reportRuns.length / this.pageSize);
        this.pagesLength = Math.min(this.pageSize, this.props.reportRuns.length);
        this.columns = [
            {
                field: "period",
                displayName: i18nFilter()("grow.lead_generator.all.period"),
                headerComponent: (header) => TableHeader(header, true),
                cellComponent: ({ value }) => <FirstRunsTableCell>{value}</FirstRunsTableCell>,
                tooltip: i18nFilter()("grow.lead_generator.all.period.tooltip"),
                width: 160,
            },
            {
                field: "websites",
                displayName: i18nFilter()("grow.lead_generator.all.websites"),
                headerComponent: (header) => TableHeader(header),
                cellComponent: ({ value }) => <RunsTableCell>{value}</RunsTableCell>,
                tooltip: i18nFilter()("grow.lead_generator.all.websites.tooltip"),
                width: 190,
            },
            {
                field: "change",
                displayName: "Change",
                headerComponent: (header) => TableHeader(header),
                cellComponent: Change,
                tooltip: i18nFilter()("grow.lead_generator.all.change.tooltip"),
                maxWidth: 280,
            },
            {
                field: "actions",
                displayName: "",
                headerComponent: (header) => TableHeader(header),
                cellComponent: RunActions,
            },
        ];
    }

    private onClickPrev = () => {
        this.setState({ page: this.state.page - 1 });
    };

    private onClickNext = () => {
        this.setState({ page: this.state.page + 1 });
    };

    private getTableData() {
        const { reportId } = this.props;
        return this.props.reportRuns.map((run) => {
            const { id: runId } = run;
            return {
                period: LeadGeneratorUtils.formatReportPeriod(run.requestTime),
                websites: run.resultCount
                    ? i18nFilter()("grow.lead_generator.all.report.websites", {
                          number: numeral(run.resultCount).format("0,0").toString(),
                      })
                    : i18nFilter()("grow.lead_generator.all.report.zero_websites"),
                id: run.id,
                reportId,
                resultsPage: this._swNavigator.href("leadGenerator.exist", { reportId, runId }),
                excelLink: `/api/lead-generator/report/query/${reportId}/run/${runId}/excel`,
                change: {
                    added: run.newSinceLastRun,
                    reappeared: run.returnedSinceLastRun,
                    removed: run.removedSinceLastRun,
                },
            };
        });
    }

    public render() {
        const tableData = this.getTableData();
        const firstElement = (this.state.page - 1) * this.pageSize;
        const lastElement = this.state.page * this.pageSize;
        return (
            <div>
                <RunsTableContent length={this.pagesLength}>
                    <MiniFlexTable
                        data={tableData.slice(firstElement, lastElement)}
                        columns={this.columns}
                    />
                </RunsTableContent>
                <RunsTableFooter>
                    <span>
                        {i18nFilter()("grow.lead_generator.all.report.pagination", {
                            start: (firstElement + 1).toString(),
                            end: Math.min(lastElement, this.props.reportRuns.length).toString(),
                            total: this.props.reportRuns.length.toString(),
                        })}
                    </span>
                    <IconButton
                        type="flat"
                        iconName="chev-left-n"
                        onClick={this.onClickPrev}
                        isDisabled={this.state.page <= 1}
                    />
                    <IconButton
                        type="flat"
                        iconName="chev-right-n"
                        onClick={this.onClickNext}
                        isDisabled={this.state.page >= this.totalPages}
                    />
                </RunsTableFooter>
            </div>
        );
    }
}

export default RunsTable;
