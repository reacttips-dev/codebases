import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  ShowCenterSpinner,
  ImageItemWithoutDrag,
  ShowNoContent,
} from "../_components/common/statelessView";
import {
  StyledMarketplaceContent,
  StyledMarketPlaceGallery,
  HomeComponent,
} from "../_components/styled/home/stylesHome";
import axios from "axios";
import { fetchData } from "../_actions/sidebarSliderActions";
import { ASSETS_SLIDER_PANEL } from "../_components/details/constants";
import { analyticsTrackEvent, getFabricTypeFromMime } from "../_utils/common";
import TLDRInfiniteScroll from "../_components/common/TLDRInfiniteScroll";
import AssetsCardView from "../_components/styled/home/AssetsCardView";
import TldrTitleRow from "../_components/styled/home/TldrTitleRow";
import { BACK_FROM_STUDIO } from "../_actions/types";
import { showToast } from "../_actions/toastActions";
import { ASSETS_ENDPOINT } from "../_actions/endpoints";
import { resetCardsSelection } from "../_actions/homepageCardActions";
import {
  EmptyStateScreen,
  TldrNewFolderDialog,
} from "../_components/styled/home/statelessView";
import { MAIN_CONTAINER_SCROLLABLE_TARGET_ID } from "../_utils/constants";
import { createNewFolder, moveToFolder } from "../_actions/folderActions";
import TldrDropzone from "../_components/common/TldrDropzone";
import { setCounter, uploadFile } from "../_actions/storiesActions";
import TLDRTitleSearch from "../_components/common/TLDRTitleSearch";

class MyAssets extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: "",
      showNewFolderPopup: false,
      inProgress: "false",
      selectedCards: [],
    };
  }

  componentDidMount() {
    this.props.resetCardsSelection();
    this.props.fetchData(
      this.props.sidebarSlider.source,
      { ...this.props, panelType: ASSETS_SLIDER_PANEL },
      this.signal.token
    );
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  loadPage = () => {
    // There is no searchText then fetch general images and add into InfiniteGrid
    this.props.fetchData(
      this.props.sidebarSlider.source,
      { ...this.props, panelType: ASSETS_SLIDER_PANEL },
      this.signal.token
    );
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

  handleSearch = (keyword) => {
    this.props.resetAssets();

    this.setState({ searchTerm: keyword }, () => {
      this.props.fetchData(
        this.props.sidebarSlider.source,
        {
          ...this.props,
          panelType: ASSETS_SLIDER_PANEL,
          titleSearchQuery: keyword,
        },
        this.signal.token
      );
    });
  };

  onEditNameHandler = (newName, payload) => {
    const { id, asset_type, bucket_name, region } = payload.content.meta;
    const reqPayload = {
      asset_type,
      bucket_name,
      region,
      asset_key: newName,
    };

    axios
      .put(`${ASSETS_ENDPOINT}/${id}`, reqPayload)
      .then((res) => {
        this.props.showToast({
          message: "Asset name updated successfully.",
          heading: "Success",
          type: "success",
        });
      })
      .catch((error) => {
        this.props.showToast({
          message:
            "Something went wrong while updating the name, please try again later.",
          heading: "Error",
          type: "error",
        });
      });
  };

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

  onAssetsDrop = (droppedFiles) => {
    if (droppedFiles.length > 0) {
      this.props.setCounter(droppedFiles.length);
    }
    droppedFiles.forEach((file) => {
      this.props.uploadFile(file, { ...this.props }, this.signal);
    });
    analyticsTrackEvent("dragNDropAssets");
  };

  render() {
    const { showNewFolderPopup, inProgress } = this.state;
    const { sidebarSlider } = this.props;
    let { loaded, payload, hasMore, counter } = sidebarSlider;

    const childElements = payload.map((asset, index) => {
      const payload = this.preparePayload(asset);
      return (
        <AssetsCardView
          key={index}
          payload={payload}
          hasAction={true}
          type={"asset"}
          modalFor={"asset"}
          showEditIcon
          onEditNameHandler={this.onEditNameHandler}
        >
          <ImageItemWithoutDrag
            data={payload}
            key={`${asset.id}_${Date.now()}`}
            url={
              asset.thumbnail_cover_image
                ? asset.thumbnail_cover_image
                : asset.thumbnail
            }
            alt={"asset"}
            width={asset.cover_image_width || 200}
            height={asset.cover_image_height || 200}
            source={"TLDR"}
            hasAction={false}
            type={"asset"}
            modalFor={"asset"}
            showOverlayInfo={false}
          />
        </AssetsCardView>
      );
    });

    return (
      <>
        <HomeComponent>
          <StyledMarketplaceContent>
            <TldrTitleRow
              type={"asset"}
              title="Assets"
              subTitle="Manage your assets."
              handleSearch={this.handleSearch}
              itemCount={payload.length}
              showNewFolderPopup={showNewFolderPopup}
              emptyScreenOnClickAction={() =>
                this.setState({ showNewFolderPopup: true })
              }
              classes={"d-none d-md-flex"}
            />

            <TLDRTitleSearch
              searchConfig={{
                handleSearch: this.handleSearch,
              }}
              title="Assets"
              classes={"d-flex d-sm-flex d-md-none"}
              style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
            ></TLDRTitleSearch>

            <TldrDropzone
              isUploading={counter > 0}
              hideTitle={false}
              btnTitle="Upload Assets"
              buttonWidth={25}
              onDrop={this.onAssetsDrop}
              className="dashboard-my-assets-dropzone"
              description="Just drag and drop your images, videos."
            />

            <StyledMarketPlaceGallery>
              {loaded && payload.length > 0 ? (
                <TLDRInfiniteScroll
                  childrens={childElements}
                  className={"my-assets-infinite-scroll"}
                  loadMoreData={this.loadPage}
                  hasMore={hasMore}
                  scrollableTarget={MAIN_CONTAINER_SCROLLABLE_TARGET_ID}
                />
              ) : loaded && payload.length === 0 ? (
                this.state.searchTerm.length === 0 ? (
                  <EmptyStateScreen
                    description="One place to manage all your assets across all your projects."
                    link={""}
                    linkPlaceholder="My Assets"
                  />
                ) : (
                  <ShowNoContent text="No assets found." />
                )
              ) : (
                <ShowCenterSpinner loaded={loaded} />
              )}
            </StyledMarketPlaceGallery>
          </StyledMarketplaceContent>
        </HomeComponent>

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

MyAssets.propTypes = {
  fetchData: PropTypes.func.isRequired,
  sidebarSlider: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  sidebarSlider: state.sidebarSlider,
  page: state.sidebarSlider.page,
  selectedCards: state.homePageCards.selectedCards,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (source, props, token) =>
    dispatch(fetchData(source, props, token)),
  resetAssets: () =>
    dispatch({
      type: BACK_FROM_STUDIO,
    }),
  showToast: (payload) => dispatch(showToast(payload)),
  resetCardsSelection: () => dispatch(resetCardsSelection()),
  createNewFolder: (name, token) => dispatch(createNewFolder(name, token)),
  moveToFolder: (folder, selectedCards, token) =>
    dispatch(moveToFolder(folder, selectedCards, token)),
  uploadFile: (file, props, signalToken) =>
    dispatch(uploadFile(file, props, signalToken)),
  setCounter: (counter) => dispatch(setCounter(counter)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyAssets);
