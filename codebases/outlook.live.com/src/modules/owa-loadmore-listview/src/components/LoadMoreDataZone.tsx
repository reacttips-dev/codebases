import { observer } from 'mobx-react';
import * as React from 'react';

export interface LoadMoreDataComponentProps extends React.HTMLProps<HTMLDivElement> {
    dataSourceId: string;
    onLoadMoreRows: () => void;
    isLoadRowsInProgress: Boolean;
    getCanLoadMore: () => Boolean;
    onWillUpdate?: () => void;
    onDidUpdate?: () => void;

    // Indicates that loaded range from itemids list
    currentLoadedIndex: number;

    // Optional: Number of guard pages to use. If the amount of rendered content left is less than guard page buffer,
    // we'll render more items.
    guardPageCount?: number;

    // Optional: Number of items to render in a single async chunk. The LoadMoreDataZone does rendering async and render
    // only a specific number of items in one go so that the main UI is not blocked. The chunk size tells how many to
    // render in a go.
    itemsToRenderPerChunk?: number;
    onScroll?: (event: any, scrollTop?: number, offsetHeight?: number) => void;
}

export interface LoadMoreDataZoneProps extends LoadMoreDataComponentProps {
    totalRows: number;
    onRenderRows: (rowsToRender: number) => JSX.Element;
}

export interface LoadMoreDataZoneState {
    // Indicates the index up to which items should be rendered from the itemIds list
    itemsToRenderIndex: number;
}

const DEFAULT_GUARD_PAGE_COUNT = 2;
const DEFAULT_CHUNK_SIZE = 7;

@observer
export default class LoadMoreDataZone extends React.Component<
    LoadMoreDataZoneProps,
    LoadMoreDataZoneState
> {
    private guardPageCount: number;
    private viewportHeight: number;
    private currentScrollTop: number = 0;
    private scrollHeight: number;

    // setTimout handler for trigger load more if not scrollable task
    private triggerLoadMoreIfNotScrollableTimeoutTask;

    // setTimout handler for scroll task
    private onScrollTimeoutTask;

    // setTimout handler for initializeAsync task
    private initalizeAsyncTimeoutTask;

    // setTimout handler for renderChunk task
    private renderChunkAsyncTimeoutTask;

    // Indicates that items up to this index are already rendered
    private itemsRenderedIndex: number = 0;

    private scrollRegion?: HTMLDivElement;

    public constructor(props: LoadMoreDataZoneProps) {
        super(props);

        // TODO: Task 398: Render only visible items on first load
        // For now, render all available items on first load
        this.state = { itemsToRenderIndex: props.totalRows };
    }

    public componentDidMount() {
        this.initalizeAsyncTimeoutTask = setTimeout(() => {
            // Init done async to not block first render
            this.initializeAsync();
        }, 25);
        this.loadMoreIfNotScrollable();
    }

    public componentWillUnmount() {
        clearTimeout(this.triggerLoadMoreIfNotScrollableTimeoutTask);
        clearTimeout(this.onScrollTimeoutTask);
        clearTimeout(this.initalizeAsyncTimeoutTask);
        clearTimeout(this.renderChunkAsyncTimeoutTask);
        this.detachEventListeners();
    }

    //tslint:disable-next-line:react-strict-mode  Tracked by WI 78453
    public UNSAFE_componentWillReceiveProps(nextProps: LoadMoreDataZoneProps) {
        const isDataSourceSwitch = this.props.dataSourceId != nextProps.dataSourceId;
        if (isDataSourceSwitch) {
            // Always update itemsToRenderIndex to current value when the items are loading due to dataSource switch,
            // where the currentLoadedIndex gets reset to an initial value.
            this.setState({ itemsToRenderIndex: nextProps.currentLoadedIndex });
            if (this.currentScrollTop != 0) {
                // Reset scroll position if we're not currently scrolled to the top
                this.resetScrollPosition();
            }
        }
    }

    public componentDidUpdate() {
        if (this.itemsRenderedIndex < this.props.currentLoadedIndex) {
            // if we rendered all the current loaded items, render another chunk
            this.renderChunkAsyncTimeoutTask = setTimeout(this.renderChunkAsyncHandler, 75);
        } else {
            this.loadMoreIfNotScrollable();
        }
    }

    public setFocus() {
        if (!this.scrollRegion) {
            throw new Error('setFocus should never be called before scrollRegion is rendered');
        }

        this.scrollRegion.focus();
    }

    private resetScrollPosition() {
        if (!this.scrollRegion) {
            throw new Error(
                'resetScrollPosition should never be called before scrollRegion is rendered'
            );
        }

        this.scrollRegion.scrollTop = 0;
    }

    private isNotScrollable() {
        // The scroll region is not scrollable only when the scroll height is less than or equal to the view port height
        // and the scrollHeight is > zero. When a component is hidden the scroll height is 0 and the component
        // can still undergo updates in which case we do not want to load more.
        return this.scrollHeight > 0 && this.scrollHeight <= this.viewportHeight;
    }

    private initializeAsync() {
        this.attachEventListeners();
        this.guardPageCount = this.props.guardPageCount
            ? this.props.guardPageCount
            : DEFAULT_GUARD_PAGE_COUNT;
    }

    private attachEventListeners() {
        this.scrollRegion.addEventListener('scroll', this.onScrollHandler);
    }

    private detachEventListeners() {
        this.scrollRegion.removeEventListener('scroll', this.onScrollHandler);
    }

    private fetchViewportHeightFromDOM() {
        // TODO: Re-fetch this on window resize
        this.viewportHeight = this.scrollRegion.offsetHeight;
    }

    private fetchScrollTopFromDOM() {
        this.currentScrollTop = this.scrollRegion.scrollTop;
    }

    private fetchScrollHeightFromDOM() {
        this.scrollHeight = this.scrollRegion.scrollHeight;
    }

    private loadMoreIfNotScrollable() {
        // Load more rows if:
        // 1) the data layer has more data, and is not loading (canDataLayerLoadMore)
        // 2) chunking is complete (isViewChunkingComplete)
        // 3) the view is not scrollable (isNotScrollable)
        // Checking if the view is not scrollable requires DOM reflow, so we check 1 and 2 before checking 3 async
        if (this.canDataLayerLoadMore() && this.isViewChunkingComplete()) {
            if (!this.triggerLoadMoreIfNotScrollableTimeoutTask) {
                this.triggerLoadMoreIfNotScrollableTimeoutTask = setTimeout(() => {
                    this.triggerLoadMoreIfNotScrollableTimeoutTask = null;
                    this.loadMoreIfNotScrollableAsync();
                }, 25);
            }
        }
    }

    private loadMoreIfNotScrollableAsync = () => {
        // we check canDataLayerLoadMore and isViewChunkingComplete again because their values may have changed since the timeout was set
        if (this.canDataLayerLoadMore() && this.isViewChunkingComplete()) {
            this.fetchScrollHeightFromDOM();
            this.fetchViewportHeightFromDOM();
            if (this.isNotScrollable()) {
                // if the view is not scrollable, load more
                this.props.onLoadMoreRows();
            }
        }
    };

    private onScrollHandler = ev => {
        // Execute any loading / rendering needed async to not block user scroll
        if (!this.onScrollTimeoutTask) {
            this.onScrollTimeoutTask = setTimeout(() => {
                this.onScrollTimeoutTask = null;
                this.onScrollAsyncHandler(ev);
            }, 25);
        }
    };

    private onScrollAsyncHandler = ev => {
        this.fetchScrollTopFromDOM();
        this.triggerLoadMoreRowsIfNecessary();
        if (this.props.onScroll) {
            if (this.viewportHeight === undefined) {
                this.fetchViewportHeightFromDOM();
            }
            this.props.onScroll(ev, this.currentScrollTop, this.viewportHeight);
        }
    };

    private canDataLayerLoadMore = () => {
        // If the consumer can load more, and a load is not in progress, the data layer can load more
        return this.props.getCanLoadMore() && !this.props.isLoadRowsInProgress;
    };

    private isViewChunkingComplete = () => {
        return this.itemsRenderedIndex == this.props.currentLoadedIndex;
    };

    private triggerLoadMoreRowsIfNecessary() {
        // Do not try to load more if we haven't finished rendering our current range yet,
        // or if datasource can't load more or loading is in progress.
        if (!this.canDataLayerLoadMore() || !this.isViewChunkingComplete()) {
            return;
        }

        // Batch DOM reflow lookups together
        this.fetchScrollHeightFromDOM();
        this.fetchViewportHeightFromDOM();

        const remainingScrollSpace =
            this.scrollHeight - this.currentScrollTop - this.viewportHeight;
        const guardPageBuffer = this.guardPageCount * this.viewportHeight;
        if (remainingScrollSpace < guardPageBuffer) {
            // Trigger load more if remaining scroll space is less than the number of guard pages specified
            this.props.onLoadMoreRows();
        }
    }

    private getRenderChunkSize = () => {
        return this.props.itemsToRenderPerChunk || DEFAULT_CHUNK_SIZE;
    };

    private renderChunkAsyncHandler = () => {
        // Set state to render next chunk
        this.setState({
            itemsToRenderIndex: Math.min(
                this.itemsRenderedIndex + this.getRenderChunkSize(),
                this.props.currentLoadedIndex,
                this.props.totalRows
            ),
        });
    };

    /*
     * Get the number of items to render for the current render
     */
    private getItemsToRenderIndex(): number {
        let renderIndex;
        // Make sure we don't try to render more than the loaded range
        renderIndex = Math.min(
            this.state.itemsToRenderIndex,
            this.props.currentLoadedIndex,
            this.props.totalRows
        );
        return renderIndex;
    }

    private onScrollRegionRefs = (element: HTMLDivElement) => {
        this.scrollRegion = element;
    };

    render() {
        this.itemsRenderedIndex = this.getItemsToRenderIndex();

        return (
            <div
                className={this.props.className}
                ref={this.onScrollRegionRefs}
                data-is-scrollable={true}>
                {this.props.onRenderRows(this.itemsRenderedIndex)}
            </div>
        );
    }
}
