import axios from "axios";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { createNewFolder, moveToFolder } from "../_actions/folderActions";
import { resetCardsSelection } from "../_actions/homepageCardActions";
import { fetchData, search } from "../_actions/sidebarSliderActions";
import { BACK_FROM_STUDIO } from "../_actions/types";
import {
  ImageItemWithoutDrag,
  ShowCenterSpinner,
  ShowNoContent,
} from "../_components/common/statelessView";
import TLDRInfiniteScroll from "../_components/common/TLDRInfiniteScroll";
import TLDRTitleSearch from "../_components/common/TLDRTitleSearch";
import { TEMPLATES_SLIDER_PANEL } from "../_components/details/constants";
import AssetsCardView from "../_components/styled/home/AssetsCardView";
import {
  EmptyStateScreen,
  TldrNewFolderDialog,
} from "../_components/styled/home/statelessView";
import {
  HomeComponent,
  StyledMarketplaceContent,
  StyledMarketPlaceGallery,
} from "../_components/styled/home/stylesHome";
import TldrTitleRow from "../_components/styled/home/TldrTitleRow";
import { MAIN_CONTAINER_SCROLLABLE_TARGET_ID } from "../_utils/constants";
import { LAYOUTS, TEMPLATES_SCREEN } from "../_utils/routes";

class MyTemplatesScreen extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      searchTerm: "",
      showNewFolderPopup: false,
      inProgress: "false",
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    this.props.fetchData(
      this.props.sidebarSlider.source,
      {
        ...this.props,
        panelType: TEMPLATES_SLIDER_PANEL,
        viewAll: true,
        templateType: this.props.templateType,
        page: 1,
        org: this.props.selectedOrg,
      },
      this.signal.token
    );
  };

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  loadPage = (groupKey) => {
    this.props.fetchData(
      this.props.sidebarSlider.iconsSource,
      {
        ...this.props,
        panelType: TEMPLATES_SLIDER_PANEL,
        viewAll: true,
        groupKey: groupKey,
        templateType: this.props.templateType,
        org: this.props.selectedOrg,
      },
      this.signal.token
    );
  };

  preparePayload = (data) => {
    const { templateType } = this.props;

    const message = {
      mime: "shape",
      type: templateType === "icons" ? "icon" : "component",
      payload: {
        name: data.title || "New Template",
        type: data.template,
        height: data.image_height,
        width: data.image_width,
        publish: data?.publish ? "published" : "draft",
      },
      content: {
        meta: {
          ...data,
        },
      },
    };
    return message;
  };

  handleSearch = (keyword) => {
    this.props.resetAssets();

    this.setState({ searchTerm: keyword }, () => {
      if (keyword.trim().length > 0) {
        this.props.search(
          this.props.sidebarSlider.iconsSource,
          keyword,
          {
            ...this.props,
            panelType: TEMPLATES_SLIDER_PANEL,
            viewAll: true,
            templateType: this.props.templateType,
            page: 1,
            org: this.props.selectedOrg,
          },
          this.signal.token
        );
      } else {
        this.loadData();
      }
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

  render() {
    const { showNewFolderPopup, inProgress } = this.state;
    const { sidebarSlider } = this.props;
    const { loaded, payload, hasMore } = sidebarSlider;

    const childElements = payload.map((asset, index) => {
      const payload = this.preparePayload(asset);
      return (
        <AssetsCardView
          key={index}
          payload={payload}
          hasAction={true}
          type={"svg"}
          modalFor={"template"}
          templateActionMenu={this.props.templateType !== "shape"}
        >
          <ImageItemWithoutDrag
            data={payload}
            key={`${asset.id}_${Date.now()}`}
            url={asset.image}
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
    });

    return (
      <>
        <HomeComponent>
          <StyledMarketplaceContent>
            <TldrTitleRow
              type="svg"
              displayType={
                this.props.templateType === "shape" ? "component" : "component"
              }
              title={
                this.props.templateType === "shape" ? "Component" : "Templates"
              }
              subTitle={
                this.props.templateType === "shape"
                  ? "Explore your saved components."
                  : "Explore your saved templates."
              }
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
              title={
                this.props.templateType === "shape" ? "Component" : "Templates"
              }
              classes={"d-flex d-sm-flex d-md-none"}
              style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
            ></TLDRTitleSearch>

            <StyledMarketPlaceGallery>
              {loaded && payload.length > 0 ? (
                <TLDRInfiniteScroll
                  childrens={childElements}
                  className={"my-templates-components-infinite-scroll"}
                  loadMoreData={this.loadPage}
                  hasMore={hasMore}
                  scrollableTarget={MAIN_CONTAINER_SCROLLABLE_TARGET_ID}
                />
              ) : loaded && payload.length === 0 ? (
                this.state.searchTerm.length === 0 ? (
                  <EmptyStateScreen
                    description={
                      this.props.templateType === "shape" ? (
                        "Did you know? You can create a component once and use it anywhere!"
                      ) : (
                        <>
                          Your saved templates will appear here.
                          <br />
                          Need some inspiration?
                        </>
                      )
                    }
                    link={
                      this.props.templateType === "shape"
                        ? LAYOUTS
                        : TEMPLATES_SCREEN
                    }
                    linkPlaceholder={
                      this.props.templateType === "shape"
                        ? "Quick Start"
                        : "Browse Templates"
                    }
                  />
                ) : (
                  <ShowNoContent text="No data found." />
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

MyTemplatesScreen.propTypes = {
  fetchData: PropTypes.func.isRequired,
  sidebarSlider: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  sidebarSlider: state.sidebarSlider,
  page: state.sidebarSlider.page,
  selectedOrg: state.auth.payload.selectedOrg,
  selectedCards: state.homePageCards.selectedCards,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (source, props, token) =>
    dispatch(fetchData(source, props, token)),
  resetAssets: () =>
    dispatch({
      type: BACK_FROM_STUDIO,
    }),
  search: (source, searchTerm, props, token) =>
    dispatch(search(source, searchTerm, props, token)),
  resetCardsSelection: () => dispatch(resetCardsSelection()),
  createNewFolder: (name, token) => dispatch(createNewFolder(name, token)),
  moveToFolder: (folder, selectedCards, token) =>
    dispatch(moveToFolder(folder, selectedCards, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyTemplatesScreen);
