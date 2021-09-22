import { observer } from 'mobx-react-lite';
import LoadMoreDataZone, { LoadMoreDataComponentProps } from './LoadMoreDataZone';
import * as React from 'react';

export interface LoadMoreListViewProps extends LoadMoreDataComponentProps {
    itemIds: string[];
    onRenderRow: (itemId: string, itemIndex: number, listProps: any) => JSX.Element;

    // Gets a header element if needed to be rendered
    onRenderHeader?: (previousItemId: string, currentItemId: string) => JSX.Element;

    // Draws the loading component at the bottom while fetching more data
    loadingComponent?: JSX.Element;

    // Row wrapper div class
    rowWrapperClass?: string;

    // Draws a custom component before the rows of the list
    PreRowsComponent?: React.ComponentType<{}>;

    // Draws a custom component after the rows of the list
    PostRowsComponent?: React.ComponentType<{}>;

    // Props related to the list container, to be passed to each item on render
    listProps?: any;
}

export type LoadMoreListViewHandle = LoadMoreDataZone;

export default observer(
    function LoadMoreListView(
        props: LoadMoreListViewProps,
        ref: React.Ref<LoadMoreListViewHandle>
    ) {
        const { PreRowsComponent = () => null, PostRowsComponent = () => null } = props;
        const renderRows = (rowsToRender: number): JSX.Element => {
            let rows: JSX.Element[] = [];
            for (let i = 0; i < rowsToRender; i++) {
                if (props.onRenderHeader) {
                    const previousElementId = i > 0 ? props.itemIds[i - 1] : null;
                    const header = props.onRenderHeader(previousElementId, props.itemIds[i]);
                    if (header) {
                        rows.push(header);
                    }
                }
                rows.push(props.onRenderRow(props.itemIds[i], i, props.listProps));
            }
            let isLoadInProgress = props.isLoadRowsInProgress;
            return (
                <div className={props.rowWrapperClass}>
                    <PreRowsComponent />
                    {rows}
                    <PostRowsComponent />
                    {isLoadInProgress && props.loadingComponent}
                </div>
            );
        };
        return (
            <LoadMoreDataZone
                ref={ref as any}
                className={props.className}
                dataSourceId={props.dataSourceId}
                totalRows={props.itemIds.length}
                onScroll={props.onScroll}
                onRenderRows={renderRows}
                onLoadMoreRows={props.onLoadMoreRows}
                isLoadRowsInProgress={props.isLoadRowsInProgress}
                getCanLoadMore={props.getCanLoadMore}
                onWillUpdate={props.onWillUpdate}
                onDidUpdate={props.onDidUpdate}
                currentLoadedIndex={props.currentLoadedIndex}
                guardPageCount={props.guardPageCount}
            />
        );
    },
    { forwardRef: true }
);
