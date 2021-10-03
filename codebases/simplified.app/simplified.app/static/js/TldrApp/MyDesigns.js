import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchStories, resetStories } from "../_actions/storiesActions";
import {
  ShowCenterSpinner,
  ShowNoContent,
} from "../_components/common/statelessView";
import { HomeContent } from "../_components/home/HomeContent";
import {
  EmptyStateScreen,
  TldrNewFolderDialog,
} from "../_components/styled/home/statelessView";
import { StyledMarketplaceContent } from "../_components/styled/home/stylesHome";
import TldrTitleRow from "../_components/styled/home/TldrTitleRow";
import { LAYOUTS } from "../_utils/routes";
import { createNewFolder, moveToFolder } from "../_actions/folderActions";
import { resetCardsSelection } from "../_actions/homepageCardActions";
import axios from "axios";
import { syncWorkSpaces } from "../_actions/authActions";
import TLDRTitleSearch from "../_components/common/TLDRTitleSearch";

export class MyDesigns extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      selected: "All",
      searchTerm: "",
      showNewFolderPopup: false,
      inProgress: "false",
    };
  }

  componentDidMount() {
    this.props.resetStories();
    this.props.fetchStories("", "", 1, { ...this.props });
    this.props.syncWorkSpaces(() => {});
  }

  handleSearch = (searchPhrase) => {
    this.setState({ searchTerm: searchPhrase });
    let catergory = this.state.selected;
    this.props.resetStories();
    setTimeout(() => {
      this.props.fetchStories(
        catergory === "All" ? "" : catergory.id,
        searchPhrase,
        this.props.stories.page,
        {
          ...this.props,
        }
      );
    }, 300);
  };

  loadMoreData = () => {
    this.props.fetchStories("", "", this.props.stories.page, { ...this.props });
  };

  onSelect = (data) => {};

  createNewFolder = (name) => {
    this.props.createNewFolder(name, this.signal.token).then((folder) => {
      this.setState({
        showNewFolderPopup: false,
        inProgress: "false",
      });
      this.props.moveToFolder(
        folder,
        this.props.selectedCards,
        this.signal.token
      );
      this.props.resetCardsSelection();
    });
  };

  render() {
    const { showNewFolderPopup, inProgress } = this.state;
    const { stories } = this.props;
    const { payload } = stories;

    const loaded = this.props.stories.loaded;
    let results = [];
    if (loaded && this.props.stories.payload.results) {
      results = this.props.stories.payload.results;
    }

    return (
      <>
        <StyledMarketplaceContent>
          <TldrTitleRow
            type="story"
            displayType="story"
            displayNamePluralForm="stories"
            title="Projects"
            subTitle="Search, edit, or clone projects and keep things moving."
            handleSearch={this.handleSearch}
            itemCount={payload.count}
            showNewFolderPopup={showNewFolderPopup}
            searchBoxWidth={"auto"}
            emptyScreenOnClickAction={() =>
              this.setState({ showNewFolderPopup: true })
            }
            classes={"d-none d-md-flex"}
          />
          <TLDRTitleSearch
            searchConfig={{
              handleSearch: this.handleSearch,
            }}
            title="Projects"
            classes={"d-flex d-sm-flex d-md-none"}
            style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
          ></TLDRTitleSearch>
          {loaded && results.length > 0 ? (
            <HomeContent
              data={stories}
              totalRowCount={payload.count}
              loadMoreData={this.loadMoreData}
              stories={results}
              metaData={this.state.selected}
            />
          ) : loaded && results.length === 0 ? (
            this.state.searchTerm.length === 0 ? (
              <EmptyStateScreen
                title="The start of something new!"
                description="You haven't designed anything yet, but it just takes a click. "
                link={LAYOUTS}
                linkPlaceholder="Start Creating"
              />
            ) : (
              <ShowNoContent text="No projects found." />
            )
          ) : (
            <ShowCenterSpinner loaded={loaded} />
          )}
        </StyledMarketplaceContent>

        <TldrNewFolderDialog
          inProgress={inProgress}
          show={showNewFolderPopup}
          onHide={(e) => {
            this.setState({ showNewFolderPopup: false });
          }}
          onYes={(name) => {
            this.setState(
              {
                inProgress: "true",
              },
              () => this.createNewFolder(name)
            );
          }}
        />
      </>
    );
  }
}

MyDesigns.propTypes = {
  fetchStories: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  stories: state.stories,
  errors: state.errors,
  selectedCards: state.homePageCards.selectedCards,
});

const mapDispatchToProps = {
  resetStories,
  fetchStories,
  createNewFolder,
  resetCardsSelection,
  moveToFolder,
  syncWorkSpaces,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyDesigns);
