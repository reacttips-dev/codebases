import React, { PureComponent } from "react";
import { GridLayout } from "@egjs/react-infinitegrid";
import { ShowCenterSpinner } from "./statelessView";

class TLDRInfiniteGalleryGridLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.groupKey = 0;
    this.gridRef = React.createRef();
    this.state = {
      show: false,
    };
    this.showTemplate();
  }

  showTemplate = () => {
    setTimeout(() => {
      this.setState({ show: true });
    }, 1);
  };

  render() {
    const { childElements, hasMore, className, loaded } = this.props;

    return (
      <>
        {this.state.show && (
          <div className={`grid-gallary ${className}`}>
            <GridLayout
              ref={(node) => (this.gridRef = node)}
              className={`gridlayout gridlayout-container ${this.props.className}`}
              groupBy={(item) => item.props["data-groupkey"]}
              loading={
                childElements.length !== 0 ? (
                  <div className="loading">
                    <ShowCenterSpinner loaded={!hasMore} />
                  </div>
                ) : (
                  <div className="loading"></div>
                )
              }
              options={{
                isOverflowScroll: true,
                useFit: true,
                useRecycle: true,
                horizontal: false,
                // isConstantSize: false,
                threshold: 500,
                // isEqualSize: false,
              }}
              layoutOptions={{
                margin: 15,
                align: "center",
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
                if (
                  e.currentTarget.isProcessing() ||
                  e.currentTarget.isLoading()
                ) {
                  return;
                }
                this.groupKey =
                  (typeof e.groupKey === "undefined" ? 0 : +e.groupKey || 0) +
                  1;
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
            </GridLayout>

            {childElements.length === 0 && hasMore && (
              <ShowCenterSpinner loaded={loaded}></ShowCenterSpinner>
            )}
          </div>
        )}
      </>
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

TLDRInfiniteGalleryGridLayout.propTypes = {};
TLDRInfiniteGalleryGridLayout.defaultProps = {
  className: "",
};

export default TLDRInfiniteGalleryGridLayout;
