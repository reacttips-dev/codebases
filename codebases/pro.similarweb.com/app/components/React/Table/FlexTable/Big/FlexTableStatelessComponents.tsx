import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import * as classNames from "classnames";
import * as React from "react";
import styled from "styled-components";
import { i18nFilter } from "../../../../../filters/ngFilters";
import { IconContainer } from "../../../PopularPagesFilters/PopularPagesFilters";
import { PlainTooltip } from "../../../Tooltip/PlainTooltip/PlainTooltip";
import { NoDataLandscape } from "components/NoData/src/NoData";
import { SWReactTableWrapperBox } from "components/React/Table/SWReactTableWrapper";

const IconContainerArrow = styled(IconContainer)`
    path {
        fill: ${colorsPalettes.carbon[400]};
        fill-opacity: 0.8;
    }
    position: relative;
    top: 5px;
    height: 21px;
    width: 21px;
`;

export const SWReactTableNoDataWrapper = styled.div`
    padding: 50px;
`;

export const RegularFlexTable: any = ({
    columns,
    scrollArrowsContainerWidth,
    scrollBy,
    setRef,
    onMouseLeave,
}) => {
    return (
        <div className="swReactTable-wrapper" onMouseLeave={onMouseLeave}>
            <div
                className="swReactTable-container"
                style={{ userSelect: "initial" }}
                ref={(el) => {
                    setRef("tableEl", el);
                }}
            >
                {columns.scrollable.length > 0 && (
                    <FlexTableScrollArrows
                        containerWidth={scrollArrowsContainerWidth}
                        scrollBy={scrollBy}
                    />
                )}
                {columns.pinned.length > 0 && (
                    <div className="swReactTable-pinned" style={{ flexBasis: columns.pinnedWidth }}>
                        {columns.pinned}
                    </div>
                )}
                <div
                    className="swReactTable-scrollable"
                    ref={(el) => {
                        setRef("scrollableEl", el);
                    }}
                    style={{ overflowY: "hidden" }}
                >
                    {columns.scrollable}
                </div>
            </div>
        </div>
    );
};

export const FixedFlexTable: any = ({
    tableHeight,
    columns,
    scrollArrowsContainerWidth,
    scrollBy,
    setRef,
    onMouseEnterHeader,
    onMouseLeave,
}) => {
    const DEFAULT_TABLE_HEIGHT = 410;
    return (
        <div>
            <div className="swReactTable-container fixed-header" onMouseEnter={onMouseEnterHeader}>
                {columns.scrollable.length > 0 && (
                    <FlexTableScrollArrows
                        containerWidth={scrollArrowsContainerWidth}
                        scrollBy={scrollBy}
                    />
                )}
                <div className="swReactTable-pinned" style={{ flexBasis: columns.pinnedWidth }}>
                    {columns.pinnedSticky}
                </div>
                <div
                    className="swReactTable-scrollable"
                    ref={(el) => {
                        setRef("scrollableStickyEl", el);
                    }}
                >
                    {columns.scrollableSticky}
                </div>
            </div>
            <div
                className="swReactTable-wrapper"
                style={{ height: tableHeight || DEFAULT_TABLE_HEIGHT }}
                onMouseLeave={onMouseLeave}
            >
                <div
                    className="swReactTable-container"
                    style={{ userSelect: "initial" }}
                    ref={(el) => {
                        setRef("tableEl", el);
                    }}
                >
                    <div
                        className="swReactTable-pinned shadow-delimiter"
                        style={{ flexBasis: columns.pinnedWidth }}
                    >
                        {columns.pinned}
                    </div>
                    <div
                        className="swReactTable-scrollable"
                        ref={(el) => {
                            setRef("scrollableEl", el);
                        }}
                    >
                        {columns.scrollable}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const StickyFlexTable: any = ({
    columns,
    scrollArrowsContainerWidth,
    scrollBy,
    setRef,
    stickyClass,
    aboveHeaderComponents,
    onMouseEnterHeader,
    onMouseLeave,
}) => {
    return (
        <div>
            <div className={classNames("swReactTable-header-wrapper", stickyClass)}>
                {aboveHeaderComponents.map((component, index) => (
                    <div
                        key={`table-header-component-${index}`}
                        className={classNames(
                            "swReactTable-container",
                            "swReactTable-header",
                            "swReactTable-header-above-header",
                        )}
                    >
                        {component}
                    </div>
                ))}
                <div
                    className={classNames("swReactTable-container", "swReactTable-header")}
                    onMouseEnter={onMouseEnterHeader}
                    ref={(el) => setRef("headerEl", el)}
                >
                    {columns.scrollable.length > 0 && (
                        <FlexTableScrollArrows
                            containerWidth={scrollArrowsContainerWidth}
                            scrollBy={scrollBy}
                        />
                    )}
                    <div className="swReactTable-pinned" style={{ width: columns.pinnedWidth }}>
                        {columns.pinnedSticky}
                    </div>
                    <div
                        className="swReactTable-scrollable"
                        ref={(el) => {
                            setRef("scrollableStickyEl", el);
                        }}
                        style={{ overflowX: "hidden" }}
                    >
                        {columns.scrollableSticky}
                    </div>
                </div>
            </div>

            <div className="swReactTable-wrapper" onMouseLeave={onMouseLeave}>
                <div
                    className="swReactTable-container"
                    style={{ userSelect: "initial" }}
                    ref={(el) => setRef("tableEl", el)}
                >
                    <div className="swReactTable-pinned" style={{ flexBasis: columns.pinnedWidth }}>
                        {columns.pinned}
                    </div>
                    <div
                        className="swReactTable-scrollable"
                        ref={(el) => setRef("scrollableEl", el)}
                    >
                        {columns.scrollable}
                    </div>
                </div>
            </div>
        </div>
    );
};

StickyFlexTable.defaultProps = {
    aboveHeaderComponents: [],
};

export const FlexTableScrollArrows: any = ({ containerWidth, scrollBy }) => {
    const offset = 100;
    return (
        <div className="scroll-container" style={{ width: containerWidth }}>
            <div
                className="swTable-scroll swTable-scroll--left end-of-scroll"
                onClick={(e: any) => scrollBy(e.target, -offset)}
            >
                <IconContainerArrow>
                    <SWReactIcons iconName="chev-left" />
                </IconContainerArrow>
            </div>
            <div
                className="swTable-scroll swTable-scroll--right"
                onClick={(e: any) => scrollBy(e.target, offset)}
            >
                <IconContainerArrow>
                    <SWReactIcons iconName="chev-right" />
                </IconContainerArrow>
            </div>
        </div>
    );
};

export const FlexTableColumn: any = ({
    columnConfig,
    columnCells,
    style,
    isLast,
    colMinWidth,
    onDragStart,
    onResizeableBorderHover,
}) => {
    const resizeAllowed =
        columnConfig.isResizable !== undefined
            ? columnConfig.isResizable
            : !isLast && (columnConfig.width || columnConfig.minWidth) > colMinWidth;
    return (
        <div
            className={classNames(
                "u-relative",
                columnConfig.columnClass,
                columnConfig.isSortedClass,
            )}
            style={style}
        >
            {columnCells}
            {resizeAllowed ? (
                <div
                    className="resizeable-border"
                    onMouseDown={(e) => onDragStart(columnConfig, e)}
                    onMouseEnter={onResizeableBorderHover}
                />
            ) : null}
        </div>
    );
};

export const FlexTableHeaderCell: any = ({
    index,
    columnConfig,
    tableMetadata,
    onSort,
    tooltip = columnConfig.tooltip,
    onSelectAllRows,
    allRowsSelected,
}) => {
    const tooltipAttr = getTooltipAttr();

    function getTooltipAttr(): string | false {
        if (!tooltip) {
            return false;
        }

        const text = i18nFilter()(tooltip);

        if (!columnConfig.displayName) {
            return text;
        }

        return `<strong>${columnConfig.displayName}</strong><br />${text}`;
    }

    return (
        <PlainTooltip
            cssClass={"plainTooltip-element plainTooltip-element--header"}
            placement="top"
            text={tooltipAttr || ""}
            enabled={tooltipAttr !== false}
            dangerouslySetInnerHTML={true}
        >
            <div className={columnConfig.headerCellClass} onClick={(e) => onSort(columnConfig)}>
                <columnConfig.HeaderComponent
                    key={"h" + index}
                    {...columnConfig}
                    tableMetadata={tableMetadata}
                    onSelectAllRows={onSelectAllRows}
                    allRowsSelected={allRowsSelected}
                />
            </div>
        </PlainTooltip>
    );
};

export const FlexStickyTableHeaderCell: any = ({
    index,
    columnConfig,
    tableMetadata,
    onSort,
    style,
    isLast,
    onDragStart,
    colMinWidth,
    onSelectAllRows,
    allRowsSelected,
}) => {
    const resizeAllowed =
        columnConfig.isResizable !== undefined
            ? columnConfig.isResizable
            : !isLast && columnConfig.width > colMinWidth;
    return (
        <div className={classNames("u-relative", columnConfig.columnClass)} style={style}>
            <FlexTableHeaderCell
                key={"h" + index}
                index={index}
                columnConfig={columnConfig}
                tableMetadata={tableMetadata}
                onSort={onSort}
                onSelectAllRows={onSelectAllRows}
                allRowsSelected={allRowsSelected}
            />
            {resizeAllowed ? (
                <div
                    className="resizeable-border"
                    onMouseDown={(e) => onDragStart(columnConfig, e)}
                />
            ) : null}
        </div>
    );
};

export class FlexTableCell extends React.Component<any, any> {
    private sign;
    private isChild;
    private cellClasses;

    shouldComponentUpdate(nextProps) {
        if (
            JSON.stringify(nextProps.row) !== JSON.stringify(this.props.row) ||
            nextProps.parentProps.visibleParents !== this.props.parentProps.visibleParents ||
            nextProps.parentProps.tableMetadata.page !== this.props.parentProps.tableMetadata.page
        ) {
            return true;
        }
        return false;
    }

    render() {
        const {
            columnConfig,
            row,
            rowIndex,
            colIndex,
            parentProps,
            style,
            onCellClick,
            onRowHover,
        } = this.props;

        this.sign = row.hasOwnProperty("parent")
            ? row.parent.index % 2 === 0
                ? "even"
                : "odd"
            : row.index % 2 === 0
            ? "even"
            : "odd";
        this.isChild = row.parent;
        this.cellClasses = classNames(
            columnConfig.cellClass,
            this.sign,
            {
                "child-row": this.isChild,
                "child-show-more":
                    this.isChild && row.isLast && row.index + 1 !== row.parent.childsCount,
            },
            row.rowClass,
        );
        return (
            <div
                className={this.cellClasses}
                style={style}
                onClick={onCellClick(columnConfig)}
                onMouseEnter={onRowHover}
                data-table-row={row.index}
                data-table-col={colIndex}
            >
                <columnConfig.CellComponent
                    rowIndex={rowIndex}
                    row={row}
                    value={row[columnConfig.field]}
                    onCellClick={onCellClick(columnConfig)}
                    {...columnConfig}
                    {...parentProps}
                />
            </div>
        );
    }
}

export const TableNoData: any = ({ messageTitle, messageSubtitle }) => {
    return (
        <SWReactTableNoDataWrapper>
            <NoDataLandscape title={messageTitle} subtitle={messageSubtitle} />
        </SWReactTableNoDataWrapper>
    );
};

const GridContainer = styled.div`
    display: flex;
    border-bottom: 1px solid ${colorsPalettes.carbon[100]};
    align-items: center;
    justify-content: space-between;
    padding: 0 20px 0 20px;
    box-sizing: border-box;
    .Loader--line {
        width: 75%;
        height: 10px;
        margin-bottom: 0px;
        margin-left: 20px;
    }
`;

export const LoaderContainer = styled.div`
    border-top: 1px solid ${colorsPalettes.carbon[100]};
`;

const ColLoader: any = styled.div`
    margin-right: ${({ isLast }: any) => (isLast ? "0px" : "30px")};
    padding-bottom: 10px;
    padding-top: 7px;
    box-sizing: border-box;
`;

export const TableLoader: any = ({ rowNum = 12 }) => {
    let rows = [],
        i = 0;
    while (++i <= rowNum) {
        rows.push(i);
    }
    return (
        <LoaderContainer>
            {rows.map((x, i) => {
                return (
                    <GridContainer key={i}>
                        <ColLoader style={{ width: "30%" }}>
                            <PixelPlaceholderLoader width={"100%"} height={6} />
                        </ColLoader>
                        <ColLoader style={{ width: "30%" }}>
                            <PixelPlaceholderLoader width={"100%"} height={6} />
                        </ColLoader>
                        <ColLoader style={{ width: "40%" }} isLast={true}>
                            <PixelPlaceholderLoader width={"100%"} height={6} />
                        </ColLoader>
                    </GridContainer>
                );
            })}
        </LoaderContainer>
    );
};

export const TableDropdownButton: any = ({ setRef }) => {
    return <div className="TableRowDropdownBtn" ref={(el) => setRef("rowDropdownEl", el)}></div>;
};
