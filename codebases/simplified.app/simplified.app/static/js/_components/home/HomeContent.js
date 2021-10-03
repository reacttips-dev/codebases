import React, { Component } from "react";
import { connect } from "react-redux";
import StoryCard from "./StoryCard";
import { withRouter } from "react-router-dom";
import { TAB_MY_STORIES } from "../details/constants";
import { createStory } from "../../_actions/storiesActions";
import axios from "axios";
import { StyledMarketPlaceGallery } from "../styled/home/stylesHome";
import TLDRInfiniteScroll from "../common/TLDRInfiniteScroll";
import { MAIN_CONTAINER_SCROLLABLE_TARGET_ID } from "../../_utils/constants";

export class HomeContent extends Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);
    this.onCreateStory = this.onCreateStory.bind(this);
    this.state = {
      inProgress: false,
    };
  }

  onCreateStory = () => {
    this.setState({ inProgress: true });
    this.props.createStory(
      { status: "draft", title: "New story" },
      this.signal.token,
      this.props
    );
  };

  render() {
    const { loadMoreData, stories, data } = this.props;
    let listItems = stories.map((story, index) => (
      <StoryCard
        key={story.id}
        story={story}
        tab={TAB_MY_STORIES}
        template={story.template}
        enableCardSelection
      />
    ));

    return (
      <StyledMarketPlaceGallery>
        {/* {id === FILTER_IN_DRAFT && (
            <StyledStarterStoryCard onClick={this.onCreateStory}>
              <div className="story-image">
                <FontAwesomeIcon
                  icon="plus"
                  size="4x"
                  className="tldr-center"
                ></FontAwesomeIcon>
                }
                <ShowCenterSpinner loaded={!inProgress} />
              </div>
              <div className="story-title">Start from scratch</div>
            </StyledStarterStoryCard>
          )} */}
        <TLDRInfiniteScroll
          childrens={listItems}
          className={"my-design-infinite-scroll"}
          loadMoreData={loadMoreData}
          hasMore={data.loadMore}
          scrollableTarget={MAIN_CONTAINER_SCROLLABLE_TARGET_ID}
        />
      </StyledMarketPlaceGallery>
    );
  }
}

HomeContent.propTypes = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { createStory };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(HomeContent));
