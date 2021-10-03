import React from "react";
import { connect, batch } from "react-redux";
import axios from "axios";
import styled from "styled-components";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

import SearchForm from "../../../../common/SearchForm";
import {
  GalleryTypeHeaderTitle,
  ShowCenterSpinner,
  ShowNoContent,
} from "../../../../common/statelessView";
import {
  wsAddLayer,
  wsUpdateStory,
} from "../../../../../_actions/webSocketAction";
import { updateStoryMusic } from "../../../../../_actions/storiesActions";
import {
  fetchData,
  search,
  resetViewAll,
  closeSlider,
} from "../../../../../_actions/sidebarSliderActions";
import { lightGrey, accent } from "../../../../styled/variable";
import { MusicSources } from "../../../../../_actions/types";
import MusicItem from "./MusicItem";
import { getMusicPayload } from "../../../../../_utils/common";

const NavigatorWrapper = styled.div`
  padding: 16px 0;
  position: relative;
  z-index: 50;
`;

const StyledScrollWrapper = styled.div`
  height: calc(100% + 60px);
  overflow-y: scroll;
  margin: -40px;
  padding: 40px;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const StyledInfiniteScroll = styled(InfiniteScroll)`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(2, 1fr);
  margin: -40px;
  padding: 40px;
`;

const ContentWrapper = styled.div`
  height: calc(100vh - 208px);
  margin-top: 8px;

  overflow-y: overlay;

  margin: 0px -40px -40px -40px;
  padding: 20px 40px 40px 40px;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const MainCategoryWrapper = styled.div`
  margin: 16px 0 8px 0;
  .main-category {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 20px;
      font-weight: 500;
      color: ${lightGrey};
      text-transform: capitalize;
    }

    .action {
      color: ${accent};
      text-decoration: underline;
      cursor: pointer;
      font-size: 12px;
    }
  }
`;

const ViewMode = {
  ALL: "all",
  CATEGORIES: "categories",
  LIST: "list",
};

const CategoryGridWrapper = styled.div`
  margin-top: 8px;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(2, 1fr);
`;

const CategoryWrapper = styled.div`
  height: 75px;
  background-color: #424242;
  color: ${lightGrey};
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s;

  :hover {
    transform: scale(1.1);
    box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.5);
  }
`;

function CategoryComponent({ categoryName, onClick }) {
  return <CategoryWrapper onClick={onClick}>{categoryName}</CategoryWrapper>;
}

CategoryComponent.propTypes = {
  categoryName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

class AudioList extends React.Component {
  signal = axios.CancelToken.source();
  abortController = new AbortController();

  state = {
    categoryId: null, // Sub category id
    categoryType: null, // Sub category Label
    expandedId: null, // Expanded primary category
    viewMode: ViewMode.ALL,
    currentAudioRef: null,
  };

  componentDidMount() {
    this.loadPage();
  }

  prepareCategoryPayload = (source, musicCategory) => {
    let categoryData = {
      id: null,
      name: null,
      subcategoryType: null,
      subcategoryLabel: null,
    };

    switch (source) {
      case MusicSources.STORYBLOCKS:
        categoryData.id = musicCategory.id;
        categoryData.name = musicCategory.name;
        categoryData.subcategoryType = musicCategory.category_group;
        categoryData.subcategoryLabel = musicCategory.category_group;
        return categoryData;
      default:
        return categoryData;
    }
  };

  loadPage = (viewAll = null, resetData = true) => {
    const { categoryId, categoryType } = this.state;
    batch(() => {
      if (resetData) {
        this.props.resetViewAll();
      }
      this.props.fetchData(
        this.props.sidebarSlider.musicSource,
        { ...this.props, categoryId, viewAll, categoryType },
        this.abortController.signal
      );
    });
  };

  resetCategories = () => {
    this.setState({
      categoryId: null,
      viewAll: false,
      categoryType: null,
    });
  };

  navigateToViewAllCategories = (mainCategory) => {
    this.setState({
      expandedId: mainCategory,
      viewMode: ViewMode.CATEGORIES,
      categoryId: null,
      categoryType: null,
    });
  };

  navigateBackFromViewAllCategories = () => {
    this.setState({
      expandedId: null,
      viewMode: ViewMode.ALL,
      categoryId: null,
      categoryType: null,
    });
  };

  navigateToMusicList = (id, name) => {
    this.setState(
      {
        viewMode: ViewMode.LIST,
        categoryId: id,
        categoryType: name,
      },
      () => {
        this.loadPage(true);
      }
    );
  };

  navigateBackFromMusicList = () => {
    const { expandedId } = this.state;
    const { searchText } = this.props;
    let viewMode = expandedId ? ViewMode.CATEGORIES : ViewMode.ALL;
    if (searchText) {
      this.loadPage(true);
    } else {
      this.loadPage(false);
    }
    this.setState({
      viewMode,
      expandedId: expandedId ?? null,
      categoryId: null,
      categoryType: null,
    });
  };

  onAddToStory = (data) => {
    const { story } = this.props;

    const payload = {
      ...data,
      action: "add",
    };
    batch(() => {
      this.props.wsUpdateStory({ ...story?.payload?.payload, music: payload });
      this.props.closeSlider(); // close slider once music added
      this.props.updateStoryMusic(payload);
    });
  };

  onPlayMusicItem = (audioEl) => {
    const { currentAudioRef } = this.state;
    if (currentAudioRef) {
      currentAudioRef.stop();
    }
    this.setState({
      currentAudioRef: audioEl.current,
    });
  };

  render() {
    const { sidebarSlider, searchText } = this.props;
    const { categoryId, categoryType, expandedId, viewMode } = this.state;

    const { loaded, payload, hasMore } = sidebarSlider;

    let renderContent = null;
    let renderNavigator = null;

    if (loaded) {
      // If the data is loaded
      if (searchText || viewMode === ViewMode.LIST) {
        renderNavigator = categoryType ? (
          <GalleryTypeHeaderTitle
            className="my-2"
            title={categoryType}
            moreOpened={true}
            toggleMore={this.navigateBackFromMusicList}
          />
        ) : null;
        if (payload.length) {
          renderContent = (
            <StyledScrollWrapper id="music-gallery">
              <StyledInfiniteScroll
                dataLength={payload.length}
                hasMore={hasMore}
                next={() => {
                  this.loadPage(true, false);
                }}
                scrollableTarget="music-gallery"
                loaded={loaded}
                loader={
                  <div
                    style={{
                      gridColumn: "1/3",
                      position: "relative",
                      height: "50px",
                    }}
                  >
                    <ShowCenterSpinner loaded={false} />
                  </div>
                }
              >
                {payload.map((data, idx) => {
                  const musicData = getMusicPayload(
                    MusicSources.STORYBLOCKS,
                    data
                  );

                  return (
                    <MusicItem
                      key={idx}
                      data={musicData}
                      onClick={() => {
                        this.onAddToStory(musicData);
                      }}
                      onPlay={this.onPlayMusicItem}
                    ></MusicItem>
                  );
                })}
              </StyledInfiniteScroll>
            </StyledScrollWrapper>
          );
        } else {
          renderContent = (
            <ShowNoContent text="No music found."></ShowNoContent>
          );
        }
      } else if (viewMode === ViewMode.ALL) {
        let categoriesData = {}; // This consists of Categories data grouped by its primary categories

        if (payload) {
          categoriesData = payload.reduce(
            (acc, { category_group }) => ((acc[category_group] = null), acc),
            {}
          );
          Object.keys(categoriesData).forEach((catGroup) => {
            const filteredDataForCategory = payload
              .filter((o) => o.category_group === catGroup)
              .map((o) => ({ ...o }))
              .slice(0, 4);
            categoriesData[catGroup] = filteredDataForCategory;
          });
        }

        renderContent = (
          <div>
            {Object.keys(categoriesData).map((mainCategory) => {
              const categories = categoriesData[mainCategory];
              return (
                <MainCategoryWrapper key={mainCategory}>
                  <div className="main-category">
                    <div className="title">{mainCategory}</div>
                    <div
                      className="action"
                      onClick={() => {
                        this.navigateToViewAllCategories(mainCategory);
                      }}
                    >
                      View all
                    </div>
                  </div>
                  <CategoryGridWrapper>
                    {categories.map((c) => (
                      <CategoryComponent
                        key={c.id}
                        categoryName={c.name}
                        onClick={() => {
                          this.navigateToMusicList(c.id, c.name);
                        }}
                      ></CategoryComponent>
                    ))}
                  </CategoryGridWrapper>
                </MainCategoryWrapper>
              );
            })}
          </div>
        );
      } else if (viewMode === ViewMode.CATEGORIES) {
        const categories = payload.filter(
          (o) => o.category_group === expandedId
        );

        renderNavigator = (
          <GalleryTypeHeaderTitle
            className="my-2"
            title={expandedId}
            moreOpened={true}
            toggleMore={this.navigateBackFromViewAllCategories}
          />
        );

        renderContent = (
          <CategoryGridWrapper>
            {categories.map((c) => (
              <CategoryComponent
                key={c.id}
                categoryName={c.name}
                onClick={() => {
                  this.navigateToMusicList(c.id, c.name);
                }}
              ></CategoryComponent>
            ))}
          </CategoryGridWrapper>
        );
      }
    } else {
      renderContent = <ShowCenterSpinner loaded={loaded}></ShowCenterSpinner>;
    }

    return (
      <>
        <SearchForm
          type="Music"
          signalToken={this.abortController.signal}
          autoFocus={true}
          categoryType={categoryType}
          categoryId={categoryId}
        />
        {renderNavigator && (
          <NavigatorWrapper>{renderNavigator}</NavigatorWrapper>
        )}
        <ContentWrapper>{renderContent}</ContentWrapper>
      </>
    );
  }
}

AudioList.propTypes = {};

const mapStateToProps = (state) => ({
  sidebarSlider: state.sidebarSlider,
  errors: state.errors,
  editor: state.editor,
  panelType: state.sidebarSlider.sliderPanelType,
  searchText: state.sidebarSlider.searchText,
  story: state.story,
  page: state.sidebarSlider.page,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  wsAddLayer: (activePageId, payload) =>
    dispatch(wsAddLayer(activePageId, payload)),
  wsUpdateStory: (payload) => dispatch(wsUpdateStory(payload)),
  closeSlider: () => dispatch(closeSlider()),
  fetchData: (source, props, token) =>
    dispatch(fetchData(source, props, token)),
  search: (source, searchTerm, props, token) =>
    dispatch(search(source, searchTerm, props, token)),
  resetViewAll: () => dispatch(resetViewAll()),
  updateStoryMusic: (musicData) => dispatch(updateStoryMusic(musicData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioList);
