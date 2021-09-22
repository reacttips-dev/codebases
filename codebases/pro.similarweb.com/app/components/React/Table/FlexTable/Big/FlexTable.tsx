/**
 * Created by Sahar.Rehani on 10/9/2016.
 */

import { colorsPalettes } from "@similarweb/styles";
import swLog from "@similarweb/sw-log";
import * as classNames from "classnames";
import { ComponentsUtils } from "components/ComponentsUtils";
import { TableDropdownComponent } from "components/React/Table/FlexTable/Big/TableDropdownComponentInner";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as _ from "lodash";
import * as PropTypes from "prop-types";
import * as React from "react";
import { Component } from "react";
import layoutConfiguration from "../../../../layout/layoutConfiguration";
import { getElementOffsetTop, setColumnWidth } from "../../SWReactTableUtils";
import {
    FixedFlexTable,
    FlexStickyTableHeaderCell,
    FlexTableCell,
    FlexTableColumn,
    FlexTableHeaderCell,
    RegularFlexTable,
    StickyFlexTable,
} from "./FlexTableStatelessComponents";

export const CLEAR_HIGHLIGHT_CLICKED_ROW_EVENT = "clearHighlightClickedRowEvent";
export const UPDATE_HIGHLIGHT_CLICKED_ROW_EVENT = "updateHighlightClickedRowEvent";

@SWReactRootComponent
export class FlexTable extends Component<any, any> {
    /**
     * all elements references (refs)
     */
    public pageScrollerEl: any;
    public tableWrapperEl: any;
    public scrollableEl: any;
    public resizeTimer: any;
    public tableEl: any;
    public headerEl: any;
    public scrollableStickyEl: any;
    public activeRowEl: any;
    public clickedRowEl: any;
    public rowDropdownEl: any;

    public dragged: any;
    public COL_MIN_WIDTH = 40;
    public isRegularTable: boolean;

    /**
     * if "true" -> activate javascript sticky header
     */
    public isStickyJsMode: boolean;

    /**
     * checks browser support for css position: sticky
     */
    public isCssStickySupported: boolean;

    public stickyPoint: number;
    public cssStickyCssClass = "css-sticky-header";
    public stickyPrefixes = ["sticky", "-webkit-sticky", "-moz-sticky", "-ms-sticky", "-o-sticky"];
    public appLayoutTopBarsHeight = 0;
    public onPageResizeDelta = 200;
    public passiveEventOptions: any;
    public headerHeight = 0;
    public rowActionsHeight = -1;
    public rowActionBgWidth = 40;
    public rowActionsIndex = -1; // this isn't in the component's `state` - for performance reasons.
    public lastValidRowActionsIndex = -1;
    public floatingActionsRowIndex = -1; // this isn't in the component's `state` - for performance reasons.
    public rowHighlightIndex = -1; // this isn't in the component's `state` - for performance reasons.
    public exposable: any;
    public selectedRowEl: any;
    public prevSelectedRowIndex: number;
    private columnsResizeEvent: Event;

    constructor(props, context) {
        super(props, context);
        this.passiveEventOptions = ComponentsUtils.getSupportForPassiveEvents()
            ? { passive: true }
            : false;
        // checks if position: sticky is supported in the browser & by the current PRO module layout | TODO: @oleg remove jQuery condition when Layout task is done | also: safari should support it, needs to be fixed.
        this.isCssStickySupported =
            $(`.${layoutConfiguration.pageScroller}`).hasClass("use-sticky-css-rendering") &&
            !ComponentsUtils.whichBrowser("safari") &&
            ComponentsUtils.cssPropertyValuesSupported("position", this.stickyPrefixes);
        this.isRegularTable = this.props.type === "regular";
        this.isStickyJsMode = this.props.type === "sticky" && !this.isCssStickySupported;
        this.exposable = {
            toggleRowAppearance: this.toggleRowAppearance,
        };
        this.dragged = {};
        this.state = {
            isResponsive: false,
            scrollArrowsContainerWidth: 0,
            tableColumns: this.props.tableColumns,
            clickedRowIndex: -1,
            activeRowIndex: -1,
        };
        this.columnsResizeEvent = new Event("swColumnsResize");
    }

    //*******************
    //  Lifecycle events
    //*******************

    public static propTypes = {
        type: PropTypes.string.isRequired,
        tableHeight: PropTypes.number,
        tableData: PropTypes.array.isRequired,
        tableColumns: PropTypes.array.isRequired,
        tableOptions: PropTypes.object.isRequired,
        tableMetadata: PropTypes.object.isRequired,
        visibleParents: PropTypes.object.isRequired,
        toggleChildRows: PropTypes.func.isRequired,
        showMoreChildRows: PropTypes.func.isRequired,
        className: PropTypes.string,
        onSort: PropTypes.func.isRequired,
        onItemClick: PropTypes.func,
        onItemToggleSelection: PropTypes.func,
        toggleRowAppearance: PropTypes.func,
        onSelectAllRows: PropTypes.func,
        allRowsSelected: PropTypes.bool,
        getStableKey: PropTypes.func.isRequired,
    };

    public componentDidMount() {
        const enrichOnLoadRowNumber = this.props.tableOptions.enrichOnLoadRowNumber;
        const { initialActiveRow } = this.props.tableOptions;

        if (Number.isInteger(initialActiveRow)) {
            this.toggleSelectedRowElement(initialActiveRow + 1);
        }

        if (enrichOnLoadRowNumber) {
            this.setActiveRowElement(enrichOnLoadRowNumber);
            $(this.tableEl)
                .find(`.collapseControlCell.swReactTableCell:nth-child(${enrichOnLoadRowNumber})`)
                .click();
        }
        window.addEventListener("resize", this.onPageResize, { capture: true });
        ComponentsUtils.ensureRenderCompleted(this.checkResponsiveState);
        if (!this.isRegularTable) {
            this.scrollableEl.addEventListener("scroll", this.onHorizontalScroll, {
                ...this.passiveEventOptions,
                capture: true,
            });
        }
        if (this.isStickyJsMode) {
            ComponentsUtils.ensureRenderCompleted(this.initSticky);
        }
        this.headerHeight = this.headerEl && this.headerEl.offsetHeight;
        if (this.props.tableOptions.highlightClickedRow) {
            $("body")
                .on(CLEAR_HIGHLIGHT_CLICKED_ROW_EVENT, this.clearHighlightClickedRow)
                .on(UPDATE_HIGHLIGHT_CLICKED_ROW_EVENT, this.updateHighlightClickedRow);
        }
    }

    public componentDidUpdate(prevProps, prevState, prevContext) {
        if (this.props.tableOptions.isSideBarClosed) {
            this.removeSelectedRowElement();
        }

        if (this.isStickyJsMode && this.pageScrollerEl) {
            ComponentsUtils.ensureRenderCompleted(() =>
                this.checkStickyHeader(this.pageScrollerEl),
            );
        }
        this.checkResponsiveState();
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.onPageResize, { capture: true });
        if (this.isStickyJsMode && this.pageScrollerEl) {
            this.pageScrollerEl.removeEventListener("scroll", this.onPageScroll, {
                ...this.passiveEventOptions,
                capture: true,
            });
        }
        if (!this.isRegularTable) {
            this.scrollableEl.removeEventListener("scroll", this.onHorizontalScroll, {
                ...this.passiveEventOptions,
                capture: true,
            });
        }
        $("body").off("mousemove").off("mouseup");
        if (this.props.tableOptions.highlightClickedRow) {
            $("body")
                .off(CLEAR_HIGHLIGHT_CLICKED_ROW_EVENT, this.clearHighlightClickedRow)
                .off(UPDATE_HIGHLIGHT_CLICKED_ROW_EVENT, this.updateHighlightClickedRow);
        }
    }

    public render() {
        const columns = this.getColumns(),
            { type, tableHeight } = this.props,
            tableModeProps = {
                columns,
                scrollArrowsContainerWidth: this.state.scrollArrowsContainerWidth,
                scrollBy: this.scrollBy,
                setRef: this.setRef,
                onMouseEnterHeader: this.onTableWrapperMouseLeave,
            },
            tableComponent = {
                sticky: (
                    <StickyFlexTable
                        {...tableModeProps}
                        stickyClass={this.isCssStickySupported ? this.cssStickyCssClass : ""}
                        aboveHeaderComponents={this.props.tableOptions.aboveHeaderComponents}
                    />
                ),
                regular: <RegularFlexTable {...tableModeProps} />,
                fixed: <FixedFlexTable {...tableModeProps} tableHeight={tableHeight} />,
            };

        return (
            <div
                className={this.getTableClasses()}
                onMouseLeave={this.onTableWrapperMouseLeave}
                ref={(el) => this.setRef("tableWrapperEl", el)}
            >
                {tableComponent[type]}
                <TableDropdownComponent
                    tableOptions={this.props.tableOptions}
                    onDropdownToggle={this.onDropdownToggle}
                    setRef={this.setRef}
                    tableData={this.props.tableData}
                    clickedRowIndex={this.state.clickedRowIndex}
                />
                {this.getRowActionsMarkup(false)}
                {this.getRowActionsMarkup(true)}
            </div>
        );
    }

    //****************
    //  Class methods
    //****************

    public setRef = (elName, el) => {
        this[elName] = el;
    };

    public scrollBy = (el, pixels) => {
        $(this.scrollableEl).animate({ scrollLeft: "+=" + pixels }, 150);
        if (!this.isRegularTable) {
            $(this.scrollableStickyEl).animate({ scrollLeft: "+=" + pixels }, 150);
        }
    };

    public getColumns() {
        let pinnedWidth = 0;
        const pinnedSticky = [],
            pinned = [],
            scrollableSticky = [],
            scrollable = [],
            {
                tableData,
                tableColumns,
                tableMetadata,
                onSort,
                tableOptions,
                getStableKey,
            } = this.props;

        const expandStyle =
            tableOptions.EnrichedRowComponent && tableOptions.shouldApplyEnrichedRowHeightToCell
                ? { height: tableOptions.enrichedRowComponentHeight }
                : null;

        tableColumns.forEach((col, colIndex, arr) => {
            const pinnedCol = [],
                scrollableCol = [],
                isLast = colIndex === arr.length - 1,
                style = setColumnWidth(true, col, isLast);

            if (col.fixed) {
                pinnedWidth = isLast ? "100%" : pinnedWidth + col.width;
                if (_.isNaN(pinnedWidth)) {
                    swLog.error(`FlexTable: calculated pinnedWidth is NaN`);
                }
                if (!this.isRegularTable) {
                    pinnedSticky.push(
                        <FlexStickyTableHeaderCell
                            key={`${getStableKey(colIndex, col)}_header`}
                            index={colIndex}
                            columnConfig={col}
                            tableMetadata={tableMetadata}
                            isLast={isLast}
                            onSort={onSort}
                            style={style}
                            onDragStart={this.dragStart}
                            colMinWidth={this.COL_MIN_WIDTH}
                            onSelectAllRows={this.props.onSelectAllRows}
                            allRowsSelected={this.props.allRowsSelected}
                        />,
                    );
                } else {
                    pinnedCol.push(
                        <FlexTableHeaderCell
                            key={`${getStableKey(colIndex, col)}_header`}
                            index={colIndex}
                            columnConfig={col}
                            tableMetadata={tableMetadata}
                            onSort={onSort}
                            onSelectAllRows={this.props.onSelectAllRows}
                            allRowsSelected={this.props.allRowsSelected}
                        />,
                    );
                }
                tableData.forEach((row, rowIndex) => {
                    const cellStyle = rowIndex === this.state.clickedRowIndex ? expandStyle : null;
                    const cellKey = `${getStableKey(rowIndex, col, row)}_field_${col.field}`;
                    pinnedCol.push(
                        <FlexTableCell
                            key={cellKey}
                            cellKey={cellKey}
                            columnConfig={{ ...col }}
                            row={{ ...row }}
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            parentProps={this.props}
                            style={cellStyle}
                            onCellClick={this.onCellClickEvent}
                            onRowHover={this.onRowHover}
                        />,
                    );
                });
                pinned.push(
                    <FlexTableColumn
                        key={`${getStableKey(colIndex, col)}_col`}
                        columnConfig={col}
                        columnCells={pinnedCol}
                        style={style}
                        colMinWidth={this.COL_MIN_WIDTH}
                        onDragStart={this.dragStart}
                    />,
                );
            } else {
                if (!this.isRegularTable) {
                    scrollableSticky.push(
                        <FlexStickyTableHeaderCell
                            key={`${getStableKey(colIndex, col)}_header`}
                            index={colIndex}
                            columnConfig={col}
                            tableMetadata={tableMetadata}
                            isLast={isLast}
                            onSort={onSort}
                            style={style}
                            onDragStart={this.dragStart}
                            colMinWidth={this.COL_MIN_WIDTH}
                        />,
                    );
                } else {
                    scrollableCol.push(
                        <FlexTableHeaderCell
                            key={`${getStableKey(colIndex, col)}_header`}
                            index={colIndex}
                            columnConfig={col}
                            tableMetadata={tableMetadata}
                            onSort={onSort}
                        />,
                    );
                }
                tableData.forEach((row, rowIndex) => {
                    const cellStyle = rowIndex === this.state.clickedRowIndex ? expandStyle : null;
                    const clickableCls =
                        tableOptions.EnrichedRowComponent &&
                        tableOptions.shouldEnrichRow(this.props, rowIndex)
                            ? " clickable"
                            : "";
                    const cellKey = `${getStableKey(rowIndex, col, row)}_field_${col.field}`;
                    scrollableCol.push(
                        <FlexTableCell
                            key={cellKey}
                            cellKey={cellKey}
                            columnConfig={{ ...col, cellClass: col.cellClass + clickableCls }}
                            row={row}
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            parentProps={this.props}
                            style={cellStyle}
                            onCellClick={this.onCellClickEvent}
                            onRowHover={this.onRowHover}
                        />,
                    );
                });
                scrollable.push(
                    <FlexTableColumn
                        key={`${getStableKey(colIndex, col)}_col`}
                        columnConfig={col}
                        columnCells={scrollableCol}
                        style={style}
                        colMinWidth={this.COL_MIN_WIDTH}
                        isLast={isLast}
                        onDragStart={this.dragStart}
                    />,
                );
            }
        });

        return {
            pinnedWidth,
            pinnedSticky,
            pinned,
            scrollableSticky,
            scrollable,
        };
    }

    public checkResponsiveState = _.debounce((trials = 3) => {
        const executeCheck = () => {
            if (this.scrollableEl) {
                const isResponsive = this.scrollableEl.clientWidth < this.scrollableEl.scrollWidth;
                const scrollArrowsContainerWidth = this.scrollableEl.clientWidth;
                if (
                    isResponsive !== this.state.isResponsive ||
                    scrollArrowsContainerWidth !== this.state.scrollArrowsContainerWidth
                ) {
                    this.setState({
                        isResponsive,
                        scrollArrowsContainerWidth,
                    });
                } else {
                    if (trials > 0) {
                        trials--;
                        setTimeout(executeCheck, 100);
                    }
                }
            }
        };
        executeCheck();
    }, 100);

    public initSticky = () => {
        if (this.tableEl && this.tableEl.clientWidth > 0) {
            this.registerStickyScrollEvent();
            this.calcStickyPoint();
        } else {
            this.isRegularTable = true;
            this.isStickyJsMode = false;
        }
    };

    public registerStickyScrollEvent = () => {
        // '.page-scroller' is currently on all PRO layouts, all layouts should be merged into one source so scroller wouldn't be sometimes on 'document' & sometimes on another element (TODO: @olegg)
        this.pageScrollerEl =
            document.querySelector(`.${layoutConfiguration.pageScroller}`) || document;
        this.pageScrollerEl.addEventListener("scroll", this.onPageScroll, {
            ...this.passiveEventOptions,
            capture: true,
        });
    };

    public calcStickyPoint = () => {
        // Calculates the coordinate where the header should start being sticky & then initializes the sticky header process
        this.appLayoutTopBarsHeight = 0;
        this.stickyPoint = getElementOffsetTop(this.tableWrapperEl) - this.appLayoutTopBarsHeight;
        if (this.stickyPoint > 0) {
            $(this.headerEl).width(this.tableEl.clientWidth);
            this.checkStickyHeader(this.pageScrollerEl); // in case which the page has been started scrolled from the beginning
        } else {
            const offsetTop = this.tableWrapperEl ? this.tableWrapperEl.offsetTop : null;
            swLog.serverLogger(
                `Table sticky point incorrect calculation: (${this.stickyPoint},${this.tableEl.clientWidth},${offsetTop}) `,
                null,
                "Warn",
            );
        }
    };

    public checkStickyHeader = (el) => {
        if (!this.tableEl) {
            return;
        }
        const stopMargin = 46,
            scrollTop = window.pageYOffset || el.scrollTop,
            // header should be sticky when we passed the sticky point and yet to reach the end of the table
            headerShouldBeSticky =
                scrollTop + stopMargin < this.stickyPoint + this.tableEl.clientHeight &&
                scrollTop > this.stickyPoint;
    };

    public dragStart = (col, e) => {
        const el = $(e.currentTarget),
            tableEl = $(this.tableEl),
            body: any = document.body;

        this.dragged = {
            x: {
                start: e.pageX,
                min: el.parent().offset().left + this.COL_MIN_WIDTH,
                max: tableEl.offset().left + tableEl.width(),
                currentConstrained: e.pageX,
            },
            y: el.offset().top,
            el: $(document.createElement("div")).attr("class", "resizeable-border-ghost"),
            anchorEl: $(document.createElement("div")).attr("class", "resizeable-anchor-border"),
            column: col,
            originalWidth: el.parent().width(),
        };
        tableEl.append(this.dragged.el);
        el.parent().prepend(this.dragged.anchorEl);
        this.dragged.el.offset({ top: this.dragged.y, left: this.dragged.x.start });
        body.addEventListener("mousemove", this.dragging, this.passiveEventOptions, {
            capture: true,
        });
        body.addEventListener("mouseup", this.dragEnd, this.passiveEventOptions, { capture: true });
    };

    public dragging = (e) => {
        if (this.dragged.el) {
            this.dragged.x.currentConstrained =
                e.pageX < this.dragged.x.min
                    ? this.dragged.x.min
                    : e.pageX > this.dragged.x.max
                    ? this.dragged.x.max
                    : e.pageX;
            this.dragged.el.offset({
                top: this.dragged.y,
                left: this.dragged.x.currentConstrained,
            });
        }
    };

    public dragEnd = (e) => {
        if (this.dragged.el) {
            const dragged = this.dragged,
                diff = dragged.x.currentConstrained - dragged.x.start,
                width = dragged.originalWidth + diff,
                body: any = document.body;

            dragged.el.remove();
            dragged.anchorEl.remove();
            this.props.onColumnResize(dragged.column, width);
            this.dragged = {};
            body.removeEventListener("mousemove", this.dragging, {
                ...this.passiveEventOptions,
                capture: true,
            });
            body.removeEventListener("mouseup", this.dragEnd, {
                ...this.passiveEventOptions,
                capture: true,
            });
        }
        window.dispatchEvent(this.columnsResizeEvent);
    };

    public onRowHover = (e) => {
        if (!this.dragged.el) {
            // do not highlight row when resizing/dragging column
            const targetEl = e.currentTarget;
            const hoveredRowIndex = $(targetEl).index();
            if (this.activeRowEl) {
                this.activeRowEl.removeClass("active-row active-actions-row");
            }
            this.setActiveRowElement(hoveredRowIndex + 1);

            if (this.props.tableOptions.rowActionsComponents) {
                const tableRowActionsEl = this.tableWrapperEl.querySelector(".tableRowActions");
                if (this.rowActionsHeight === -1) {
                    // set rowActions' height & background for the first time
                    const gray = colorsPalettes.carbon[25];
                    const white = colorsPalettes.carbon[0];
                    const actionsWidth =
                        this.rowActionBgWidth * this.props.tableOptions.rowActionsComponents.length;
                    const background1 = `linear-gradient(to left, ${gray} 0px, ${gray} ${
                        actionsWidth + 20
                    }px, transparent ${actionsWidth + 50}px, transparent 100%)`;
                    const background2 = `linear-gradient(to left, ${white} 0px, ${white} ${
                        actionsWidth + 20
                    }px, transparent ${actionsWidth + 50}px, transparent 100%)`;
                    const floatingRowActionsEl = this.tableWrapperEl.querySelector(
                        ".tableRowActions--floating",
                    );
                    this.rowActionsHeight = targetEl.offsetHeight;
                    tableRowActionsEl.style.height = this.rowActionsHeight + "px";
                    floatingRowActionsEl.style.height = this.rowActionsHeight + "px";
                    tableRowActionsEl.style.background = background1;
                    floatingRowActionsEl.style.background = background2;
                }
                this.rowActionsIndex = hoveredRowIndex;
                tableRowActionsEl.style.top = this.getTableRowActionTop(targetEl) + "px";
                this.activeRowEl && this.activeRowEl.addClass("active-actions-row");
                tableRowActionsEl.style.opacity = 1;
            } else {
                this.activeRowEl && this.activeRowEl.addClass("active-row");
            }
        }
    };

    public setActiveRowElement = (row) => {
        this.activeRowEl = $(this.tableEl).find(`.swReactTableCell:nth-child(${row})`);
        this.setState({ activeRowIndex: row });
    };

    public getTableRowActionTop = (cellOnHover) => {
        return $(cellOnHover).offset().top - $(cellOnHover).closest(".flex-table").offset().top;
    };

    public setSelectedRowElement = (row) => {
        this.selectedRowEl = $(this.tableEl).find(`.swReactTableCell:nth-child(${row})`);
        this.selectedRowEl && this.selectedRowEl.addClass("selected");
    };

    public removeSelectedRowElement = () => {
        this.selectedRowEl && this.selectedRowEl.removeClass("selected");
    };

    public toggleSelectedRowElement = (clickedRowIndex) => {
        if (this.prevSelectedRowIndex && clickedRowIndex === this.prevSelectedRowIndex) {
            if (this.selectedRowEl && this.selectedRowEl.hasClass("selected")) {
                this.removeSelectedRowElement();
            } else {
                this.selectedRowEl && this.selectedRowEl.addClass("selected");
            }
        } else {
            this.removeSelectedRowElement();
            this.setSelectedRowElement(clickedRowIndex);
        }
        this.prevSelectedRowIndex = clickedRowIndex;
    };

    public onTableWrapperMouseLeave = () => {
        $(this.tableWrapperEl)
            .find(".swReactTableCell")
            .removeClass("active-row active-actions-row");
        if (this.props.tableOptions.rowActionsComponents) {
            // do not highlight row when resizing/dragging column
            const tableRowActionsEl = this.tableWrapperEl.querySelector(".tableRowActions");
            this.rowActionsIndex = -1;
            tableRowActionsEl.style.opacity = 0;
            tableRowActionsEl.style.top = "-1000px";
            this.setState({ activeRowIndex: -1 });
            // this.activeRowEl && this.activeRowEl.removeClass('active-row active-actions-row');
        }
    };

    public onCellClickEvent = (columnConfig) => (e, index?: number) => {
        const clickedRowIndex = index ?? $(e.currentTarget).index();
        const { tableOptions, tableData } = this.props;
        const collapseRow = (rowIndex, row) => {
            this.removeClickedRowClass();
            this.setState({
                clickedRowIndex: -1,
            });
            tableOptions.onEnrichedRowClick(false, rowIndex, row);
        };

        if (tableOptions.onCellClick) {
            tableOptions.onCellClick(e, clickedRowIndex, tableData[clickedRowIndex], columnConfig);
            if (tableOptions.activeSelectedRow) {
                this.toggleSelectedRowElement(clickedRowIndex + 1);
            }
        }

        if (tableOptions.EnrichedRowComponent) {
            try {
                // not sure how visibleParents are built, thus try catch.
                if (this.props.visibleParents[clickedRowIndex]?.expanded) {
                    this.props.toggleChildRows(tableData[clickedRowIndex], "");
                }
            } catch (e) {}
            if (
                tableOptions.shouldEnrichRow &&
                tableOptions.shouldEnrichRow(this.props, clickedRowIndex, e)
            ) {
                if (clickedRowIndex === this.state.clickedRowIndex) {
                    collapseRow(clickedRowIndex, tableData[clickedRowIndex]);
                } else {
                    // change the dropdown's button position according to current clicked row
                    this.removeClickedRowClass();
                    this.activeRowEl && this.activeRowEl.addClass("active-row-clicked");
                    this.setState(
                        {
                            clickedRowIndex,
                        },
                        () => {
                            setTimeout(() => {
                                // timeout to allow height animation to finish
                                this.rowDropdownEl.parentNode.style.position = "absolute";
                                this.rowDropdownEl.parentNode.style.top =
                                    4 +
                                    this.headerHeight +
                                    this.tableEl.querySelector(
                                        `.swReactTableCell:nth-child(${
                                            this.state.clickedRowIndex + 1
                                        })`,
                                    ).offsetTop +
                                    "px";
                                this.rowDropdownEl.click();
                            }, this.props.tableOptions.enrichedRowComponentTimeout || 500);
                        },
                    );
                    tableOptions.onEnrichedRowClick(
                        true,
                        clickedRowIndex,
                        tableData[clickedRowIndex],
                    );
                }
            } else {
                collapseRow(clickedRowIndex, tableData[clickedRowIndex]);
            }
        }
    };
    public onDropdownToggle = (isOpen, isOutsideClick, e) => {
        if (isOutsideClick && e && !$(e.target).closest(".swReactTableCell").length) {
            this.removeClickedRowClass();
            const currRow = this.state.clickedRowIndex;
            this.setState({
                clickedRowIndex: -1,
            });
            this.props.tableOptions.onEnrichedRowClick(
                false,
                currRow,
                this.props.tableData[currRow],
            );
        }
    };

    public removeClickedRowClass = () => {
        $(this.tableEl)
            .find(`.swReactTableCell:nth-child(${this.state.clickedRowIndex + 1})`)
            .removeClass("active-row-clicked");
    };

    public toggleRowAppearance = (isHidden) => {
        return new Promise((resolve, reject) => {
            const activeRowEl = this.activeRowEl;
            if (isHidden) {
                activeRowEl.addClass("swReactTableCell--disappear");
                activeRowEl.one("transitionend", () => {
                    activeRowEl.hide();
                    resolve(() => activeRowEl.removeClass("swReactTableCell--disappear").show());
                });
            }
        });
    };

    public onHorizontalScroll = (e) => {
        const scrollableElem = e.currentTarget;
        $(this.scrollableStickyEl).scrollLeft(scrollableElem.scrollLeft);
        $(".swTable-scroll").removeClass("end-of-scroll");
        if (scrollableElem.scrollLeft !== 0) {
            $(".swReactTable-pinned").addClass("shadow-delimiter");
        }
        if (scrollableElem.scrollLeft === 0) {
            $(".swTable-scroll--left").addClass("end-of-scroll");
            $(".swReactTable-pinned").removeClass("shadow-delimiter");
        } else if (
            scrollableElem.scrollLeft ===
            scrollableElem.scrollWidth - scrollableElem.offsetWidth
        ) {
            $(".swTable-scroll--right").addClass("end-of-scroll");
        }
    };

    public onPageScroll = (e) => {
        if (!this.tableEl || !this.headerEl || !this.scrollableEl) {
            return;
        }
        this.checkStickyHeader(e.target);
    };

    public onPageResize = () => {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            // Resize event(s) ended, execute this code only now (Debounce)
            this.checkResponsiveState();
            if (this.isStickyJsMode && this.tableEl) {
                this.calcStickyPoint();
            }
        }, this.onPageResizeDelta);
    };

    public onRowActionClick = (e) => {
        if (this.props.tableOptions.highlightClickedRow) {
            if (this.rowHighlightIndex !== this.rowActionsIndex) {
                this.clearHighlightClickedRow();
                this.highlightClickedRow(this.rowActionsIndex);
            } else {
                this.clickedRowEl.toggleClass("highlight-clicked-row");
            }
        }

        this.lastValidRowActionsIndex = this.rowActionsIndex;
    };

    public clearHighlightClickedRow = () => {
        this.clickedRowEl && this.clickedRowEl.removeClass("highlight-clicked-row");
    };

    public updateHighlightClickedRow = () => {
        if (this.clickedRowEl) {
            const index = this.clickedRowEl.index();
            this.highlightClickedRow(index);
        }
    };

    public highlightClickedRow = (index) => {
        this.rowHighlightIndex = index;
        this.clickedRowEl = $(this.tableEl).find(
            `.swReactTableCell:nth-child(${this.rowHighlightIndex + 1})`,
        );
        this.clickedRowEl.addClass("highlight-clicked-row");
    };

    public toggleFloatingActionsRow = () => {
        const floatingRowActionsEl = this.tableWrapperEl.querySelector(
            ".tableRowActions--floating",
        );
        if (this.floatingActionsRowIndex > -1) {
            floatingRowActionsEl.style.top =
                $(this.tableWrapperEl.querySelector(".tableRowActions")).position().top + "px";
            floatingRowActionsEl.style.opacity = 1;
        } else {
            floatingRowActionsEl.style.top = -1000 + "px";
            floatingRowActionsEl.style.opacity = 0;
        }
    };

    public getTableClasses = () => {
        return classNames(
            "flex-table",
            {
                responsive: this.state.isResponsive,
                "flex-table--expandable":
                    this.props.tableOptions.EnrichedRowComponent &&
                    this.props.tableOptions.enrichedRowComponentHeight > 0,
            },
            this.props.className,
        );
    };

    public getRowActionsMarkup = (isSelectionRow) => {
        const { tableOptions, tableData, tableMetadata } = this.props;
        return (
            tableOptions.rowActionsComponents && (
                <div
                    className={classNames("tableRowActions", {
                        "tableRowActions--floating": isSelectionRow,
                    })}
                    onClickCapture={this.onRowActionClick}
                >
                    {tableOptions.rowActionsComponents.map((component, idx) => {
                        const injectProps = {
                            rowIndex: this.state.activeRowIndex,
                            row: tableData[this.state.activeRowIndex - 1],
                            onClick: (props) => {
                                return component.props.onClick(
                                    props,
                                    tableData[this.lastValidRowActionsIndex],
                                    tableMetadata.totalCount,
                                    this.activeRowEl,
                                    this.exposable,
                                );
                            },
                            onToggle: (isOpen, isOutsideClick, e) => {
                                // only in cases where the action Component is a dropdown
                                component.props.onToggle(isOpen);
                                if (!isOpen || isOutsideClick) {
                                    this.floatingActionsRowIndex = -1;
                                    this.toggleFloatingActionsRow();
                                } else if (isOpen) {
                                    this.floatingActionsRowIndex = this.rowActionsIndex;
                                    this.toggleFloatingActionsRow();
                                }
                            },
                        };
                        if (typeof component === "function") {
                            return component(injectProps);
                        }
                        return {
                            ...component,
                            key: `ra${idx}`,
                            props: {
                                ...component.props,
                                ...injectProps,
                            },
                        };
                    })}
                </div>
            )
        );
    };
}
