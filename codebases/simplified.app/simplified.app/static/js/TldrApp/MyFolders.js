import React, { Component } from "react";
import {
  StyledMarketPlaceGallery,
  StyledMarketplaceContent,
  HomeComponent,
} from "../_components/styled/home/stylesHome";
import axios from "axios";
import TldrTitleRow from "../_components/styled/home/TldrTitleRow";
import FoldersPanel from "../_components/home/FoldersPanel";
import AssetsCardView from "../_components/styled/home/AssetsCardView";
import {
  ImageItemWithoutDrag,
  ShowCenterSpinner,
} from "../_components/common/statelessView";
import TLDRInfiniteScroll from "../_components/common/TLDRInfiniteScroll";
import { EmptyStateScreen } from "../_components/styled/home/statelessView";
import { PROJECTS } from "../_utils/routes";
import { getFabricTypeFromMime } from "../_utils/common";
import { connect } from "react-redux";
import { TAB_MY_STORIES } from "../_components/details/constants";
import StoryCard from "../_components/home/StoryCard";
import { withRouter } from "react-router-dom";
import { FOLDERS_SEARCH_ENDPOINT } from "../_actions/endpoints";
import { MAIN_CONTAINER_SCROLLABLE_TARGET_ID } from "../_utils/constants";

class MyFolders extends Component {
  signal = axios.CancelToken.source();

  state = {
    folderSpecificData: undefined,
    selectedFolder: undefined,
    showNewFolderPopup: false,
    nextPage: null,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props !== prevProps &&
      this.state.folderSpecificData !== undefined &&
      this.state.selectedFolder !== undefined
    ) {
      let selectedFolder = this.props.folders.folders.find(
        (folder) => folder.id === this.state.selectedFolder.id
      );

      if (selectedFolder) {
        selectedFolder["total_contents"] =
          selectedFolder.story_contents &&
          selectedFolder.story_contents.length +
            selectedFolder.asset_contents.length +
            selectedFolder.template_contents.length +
            selectedFolder.component_contents.length;

        axios
          .get(
            FOLDERS_SEARCH_ENDPOINT +
              `/${selectedFolder.id}?org=${selectedFolder.organization}`
          )
          .then((res) => {
            this.setState({
              folderSpecificData: res.data.results,
              selectedFolder: selectedFolder,
              nextPage: res.data.next,
            });
          });
      }
    }
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  onFolderClick = (selectedFolder) => {
    selectedFolder["total_contents"] =
      selectedFolder.story_contents &&
      selectedFolder.story_contents.length +
        selectedFolder.asset_contents.length +
        selectedFolder.template_contents.length +
        selectedFolder.component_contents.length;

    axios
      .get(
        FOLDERS_SEARCH_ENDPOINT +
          `/${selectedFolder.id}?org=${selectedFolder.organization}`
      )
      .then((res) => {
        this.setState({
          folderSpecificData: res.data.results,
          selectedFolder: selectedFolder,
          nextPage: res.data.next,
        });
      });
  };

  loadMoreData = () => {
    if (this.state.nextPage) {
      axios.get(`${this.state.nextPage}`).then((res) => {
        this.setState({
          folderSpecificData: this.state.folderSpecificData.concat(
            res.data.results
          ),
          nextPage: res.data.next,
        });
      });
    }
  };

  preparePayload = (asset) => {
    asset.thumbnail_width = asset.thumbnail_width || 200;
    asset.thumbnail_height = asset.thumbnail_height || 200;

    const message = {
      mime: asset.asset_type,
      type: asset.asset_type === "shape" ? "icon" : asset.asset_type,
      payload: {
        name: asset.asset_key || "New Asset",
        src: asset.thumbnail,
        type: getFabricTypeFromMime(asset.asset_type),
        height: asset.thumbnail_height,
        width: asset.thumbnail_width,
      },
      content: {
        meta: asset,
        url: asset.thumbnail,
      },
    };
    return message;
  };

  handleFolderLinkClick = (folder) => {
    if (folder.id === "root") {
      this.setState({
        folderSpecificData: undefined,
        selectedFolder: undefined,
      });
    }
  };

  render() {
    let payload = [];
    let links = undefined;
    const { selectedFolder, folderSpecificData, showNewFolderPopup } =
      this.state;

    const { loaded, folders } = this.props.folders;

    if (folderSpecificData) {
      payload = folderSpecificData;
    }

    if (selectedFolder) {
      links = [
        { name: "Folders", id: "root" },
        { name: selectedFolder.name, id: selectedFolder.id },
      ];
    }

    const childElements = payload.map((dataObj, index) => {
      if (dataObj.hasOwnProperty("asset_type")) {
        // Asset
        const payload = this.preparePayload(dataObj);
        return (
          <AssetsCardView
            key={index}
            payload={payload}
            hasAction={true}
            type={"asset"}
            modalFor={"asset"}
            showEditIcon
            onEditNameHandler={this.onEditNameHandler}
            selectedFolder={selectedFolder}
          >
            <ImageItemWithoutDrag
              data={payload}
              key={`${dataObj.id}_${Date.now()}`}
              url={
                dataObj.thumbnail_cover_image
                  ? dataObj.thumbnail_cover_image
                  : dataObj.thumbnail
              }
              alt={"asset"}
              width={dataObj.cover_image_width || 200}
              height={dataObj.cover_image_height || 200}
              source={"TLDR"}
              hasAction={false}
              type={"asset"}
              modalFor={"asset"}
              showOverlayInfo={false}
            />
          </AssetsCardView>
        );
      } else if (dataObj.hasOwnProperty("publish")) {
        const payload = this.preparePayload(dataObj);
        return (
          <AssetsCardView
            key={index}
            payload={payload}
            hasAction={true}
            type={"svg"}
            modalFor={"template"}
            templateActionMenu={dataObj.template !== "shape"}
          >
            <ImageItemWithoutDrag
              data={payload}
              key={`${dataObj.id}_${Date.now()}`}
              url={dataObj.image}
              alt={"asset"}
              width={200}
              height={200}
              source={"Simplified"}
              hasAction={false}
              type={"svg"}
              modalFor={"template"}
              showOverlayInfo={false}
            />
          </AssetsCardView>
        );
      } else {
        // Story
        return (
          <StoryCard
            key={index}
            story={dataObj}
            tab={TAB_MY_STORIES}
            template={dataObj.template}
            enableCardSelection
            selectedFolder={selectedFolder}
          />
        );
      }
    });

    return (
      <HomeComponent>
        <StyledMarketplaceContent>
          <TldrTitleRow
            displayType="item"
            title={this.state.folderSpecificData ? undefined : "Folders"}
            subTitle={
              this.state.folderSpecificData ? undefined : "Organize everything"
            }
            links={links}
            handleLinkOnClick={this.handleFolderLinkClick}
            disableSearch
            enableCreateNewFolderOption={
              this.state.folderSpecificData === undefined
            }
            showNewFolderPopup={showNewFolderPopup}
            hideNewFolderPopup={() =>
              this.setState({ showNewFolderPopup: false })
            }
            selectedFolder={selectedFolder}
            itemCount={payload.length}
            emptyScreenOnClickAction={() =>
              this.setState({ showNewFolderPopup: true })
            }
          />

          {selectedFolder === undefined ? (
            <FoldersPanel
              onFolderClick={this.onFolderClick}
              parentFolder={this.state.selectedFolder}
            />
          ) : null}

          {loaded && folders.length === 0 ? (
            <EmptyStateScreen
              title="A clean slate!"
              description="There's nothing here yet but organization is a click away."
              actionButtonOnClick={() =>
                this.setState({ showNewFolderPopup: true })
              }
              actionButtonPlaceholder="Create a Folder"
            />
          ) : (
            <ShowCenterSpinner loaded={loaded} />
          )}

          {payload.length > 0 ? (
            <StyledMarketPlaceGallery>
              <TLDRInfiniteScroll
                childrens={childElements}
                className="view-folder-content-infinite-scroll"
                loadMoreData={this.loadMoreData}
                hasMore={
                  selectedFolder["total_contents"] !== folderSpecificData.length
                }
                scrollableTarget={MAIN_CONTAINER_SCROLLABLE_TARGET_ID}
              />
            </StyledMarketPlaceGallery>
          ) : payload.length === 0 &&
            this.state.folderSpecificData !== undefined ? (
            <StyledMarketPlaceGallery>
              <EmptyStateScreen
                title="No projects here yet!"
                description="Add projects to your folder"
                link={PROJECTS}
                linkPlaceholder="Go to Projects"
              />
            </StyledMarketPlaceGallery>
          ) : null}
        </StyledMarketplaceContent>
      </HomeComponent>
    );
  }
}

const mapStateToProps = (state) => ({
  folders: state.folders,
});

export default connect(mapStateToProps)(withRouter(MyFolders));
