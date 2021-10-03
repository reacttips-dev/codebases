import React, { Component } from "react";
import PropTypes from "prop-types";
import { ShowCenterSpinner } from "./statelessView";
import InfiniteScroll from "react-infinite-scroll-component";
import { StyledViewAllTemplatesInfiniteScrollGrid } from "../styled/home/stylesHome";

class TLDRInfiniteScroll extends Component {
  render() {
    const {
      childrens,
      className,
      loaded,
      hasMore,
      loadMoreData,
      scrollableTarget,
      wrapChildrenInCustomGrid,
      templatesPerRow,
    } = this.props;
    return (
      <InfiniteScroll
        loader={
          <div className="loading">
            <ShowCenterSpinner loaded={loaded} />
          </div>
        }
        className={className}
        dataLength={childrens.length}
        next={loadMoreData}
        hasMore={hasMore}
        scrollableTarget={scrollableTarget}
      >
        {wrapChildrenInCustomGrid ? (
          <StyledViewAllTemplatesInfiniteScrollGrid
            templatesPerRow={templatesPerRow}
          >
            {childrens}
          </StyledViewAllTemplatesInfiniteScrollGrid>
        ) : (
          <>{childrens}</>
        )}
      </InfiniteScroll>
    );
  }
}

TLDRInfiniteScroll.propTypes = {
  childrens: PropTypes.array.isRequired,
  loadMoreData: PropTypes.func.isRequired,
};

TLDRInfiniteScroll.defaultProps = {
  className: "",
  hasMore: false,
  loaded: false,
  wrapChildrenInCustomGrid: false,
  templatesPerRow: 2,
};

export default TLDRInfiniteScroll;
