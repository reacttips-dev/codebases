import React, { PureComponent } from "react";
import { JustifiedLayout } from "@egjs/react-infinitegrid";
import { RequestTemplateContent, ShowCenterSpinner } from "./statelessView";

class TLDRInfiniteGalleryJustifiedLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.groupKey = 0;
    this.gridRef = React.createRef();
  }

  render() {
    const { childElements, hasMore, loaded, className } = this.props;

    return (
      <div className={`grid-gallary ${className}`}>
        <JustifiedLayout
          ref={(node) => (this.gridRef = node)}
          className="justifiedlayout gridlayout-container"
          groupBy={(item) => item.props["data-groupkey"]}
          loading={
            <div className="loading">
              <ShowCenterSpinner loaded={!hasMore} />
            </div>
          }
          options={{
            isOverflowScroll: true,
            useFit: true,
            useRecycle: true,
            horizontal: false,
            threshold: 500,
          }}
          layoutOptions={{
            margin: 20,
            column: [1, 4],
            row: 0,
            minSize: 100, // [0, 300]
            maxSize: 300, // [0, 600]
          }}
          onLayoutComplete={(e) => {
            return !e.isLayout && e.endLoading();
          }}
          onChange={(e) => {}}
          onAppend={(e) => {
            if (!hasMore) {
              e.stop();
              return;
            }
            if (e.currentTarget.isProcessing() || e.currentTarget.isLoading()) {
              return;
            }
            this.groupKey =
              (typeof e.groupKey === "undefined" ? 0 : +e.groupKey || 0) + 1;
            e.startLoading();
            setTimeout(() => {
              this.loadNextPage(this.groupKey);
            }, 1000);
          }}
          onImageError={(error) => {
            console.error(error);
          }}
        >
          {childElements}
        </JustifiedLayout>

        {loaded && childElements.length === 0 && (
          <div className="no-content-container">
            <RequestTemplateContent text="No templates found"></RequestTemplateContent>
          </div>
        )}
      </div>
    );
  }

  componentWillUnmount() {}

  componentDidMount() {
    // Do nothing
    // this.loadNextPage(0);
  }

  componentDidUpdate(prevProps, prevState) {}

  loadNextPage = (groupKey) => {
    // Execute call from Parent components
    this.props.loadPage(groupKey);
  };
}

TLDRInfiniteGalleryJustifiedLayout.propTypes = {};
TLDRInfiniteGalleryJustifiedLayout.defaultProps = {
  className: "",
};

export default TLDRInfiniteGalleryJustifiedLayout;
