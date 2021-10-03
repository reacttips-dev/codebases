import React, { Component } from "react";
import {
  GalleryTypeHeaderTitle,
  ShowNoContent,
  ImageItem,
} from "../../../common/statelessView";
import TLDRInfiniteGalleryGridLayout from "../../../common/TLDRInfiniteGalleryGridLayout";
import {
  fetchData,
  resetViewAll,
  search,
  closeSlider,
} from "../../../../_actions/sidebarSliderActions";
import {
  wsCopyFromTemplate,
  wsAddLayer,
} from "../../../../_actions/webSocketAction";
import { connect } from "react-redux";
import axios from "axios";
import { isMobileView, prepareIconPayload } from "../../../../_utils/common";
import { isEqual } from "lodash";

class TemplatesCategoryViewAll extends Component {
  signal = axios.CancelToken.source();
  abortController = new AbortController();

  render() {
    const {
      sidebarSlider,
      closeMore,
      isMyElement,
      templateType,
      categoryType,
      isIconSearched,
      viewAll,
    } = this.props;
    const { loaded, payload, hasMore } = sidebarSlider;
    let currentTypePayload = payload || [];
    let childElements = [];

    if (currentTypePayload) {
      childElements = currentTypePayload.map((image, index) => {
        return (
          <div
            key={`${image.id}_${index}`}
            className="item item-element"
            onClick={() => this.addLayerCallback(image)}
            data-groupkey={image.groupKey}
          >
            <ImageItem
              data={this.preparePayload(image)}
              key={`${image.id}_${Date.now()}`}
              url={
                templateType === "icons"
                  ? image.images?.png["512"]
                  : image.image
              }
              alt={image.description}
              itemWidth={80.656}
              width={templateType === "icons" ? 100 : image.image_width}
              height={templateType === "icons" ? 100 : image.image_width} // To make the square
              source={templateType === "icons" ? "Flaticon" : "TLDR"}
              type={"svg"}
              modalFor={
                sidebarSlider.sliderPanelType === "templates"
                  ? "template"
                  : "component"
              }
              showOverlayInfo={false}
              hasAction={viewAll ? false : true}
              index={index}
              isUsedInSwiper={false}
            />
          </div>
        );
      });
    }

    return (
      <>
        <>
          {!isMyElement && !isIconSearched && (
            <GalleryTypeHeaderTitle
              title={categoryType}
              moreOpened={true}
              toggleMore={closeMore}
            />
          )}

          <TLDRInfiniteGalleryGridLayout
            childElements={childElements}
            hasMore={hasMore}
            loadPage={this.loadPage}
            className={"element-gallary"}
            loaded={loaded}
          />
        </>

        {loaded &&
        childElements.length === 0 &&
        this.props.sidebarSlider.iconsSource === "Flaticon" ? (
          <ShowNoContent
            text={
              templateType === "template" && categoryType
                ? `No ${categoryType.toLowerCase()} templates found.`
                : templateType
                ? `No ${templateType.toLowerCase()} found.`
                : null
            }
          />
        ) : null}
      </>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(nextProps.sidebarSlider, this.props.sidebarSlider)) {
      return true;
    }
    return false;
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
    this.abortController.abort();
  }

  loadPage = (groupKey) => {
    const { searchText, templateType, categoryType } = this.props;
    if (searchText === "") {
      if (templateType === "icons") {
        this.props.fetchData(
          this.props.sidebarSlider.iconsSource,
          {
            ...this.props,
            viewAll: true,
            groupKey: groupKey,
            templateType,
            categoryType,
          },
          this.abortController.signal
        );
      } else {
        this.props.fetchData(
          "",
          {
            ...this.props,
            viewAll: true,
            groupKey: groupKey,
            templateType,
            categoryType,
          },
          this.signal.token
        );
      }
      return;
    } else {
      if (templateType === "icons") {
        this.props.search(
          this.props.sidebarSlider.iconsSource,
          searchText,
          {
            ...this.props,
            groupKey,
            viewAll: true,
            templateType,
            categoryType,
          },
          this.signal.token
        );
      } else {
        this.props.search(
          "",
          searchText,
          {
            ...this.props,
            groupKey,
            viewAll: true,
            templateType,
            categoryType,
          },
          this.signal.token
        );
      }
    }
  };

  preparePayload = (data) => {
    const { templateType } = this.props;

    const message = {
      mime: "shape",
      type: templateType === "icons" ? "icon" : "component",
      content: {
        meta: {
          ...data,
        },
      },
    };
    return message;
  };

  addLayer = (data) => {
    this.props.wsCopyFromTemplate(this.props.editor.activePage.id, data.id);
  };

  addLayerCallback = async (data) => {
    const { templateType } = this.props;
    if (templateType === "icons") {
      let payload = await prepareIconPayload(data);
      if (payload === null) {
        return;
      }
      this.props.wsAddLayer(this.props.editor.activePage.id, payload);
    } else {
      this.addLayer(data);
    }
    if (isMobileView()) {
      this.props.closeSlider();
    }
  };
}

TemplatesCategoryViewAll.propTypes = {};

TemplatesCategoryViewAll.defaultProps = {
  isMyElement: false,
  org: "",
};

const mapStateToProps = (state) => ({
  panelType: state.sidebarSlider.sliderPanelType,
  sidebarSlider: state.sidebarSlider,
  editor: state.editor,
  page: state.sidebarSlider.page,
  searchText: state.sidebarSlider.searchText,
  contentSize: state.story.contentSize,
  activePage: state.editor.activePage,
  story: state.story,
  pagestore: state.pagestore,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (source, props, token) =>
    dispatch(fetchData(source, props, token)),
  resetViewAll: () => dispatch(resetViewAll()),
  search: (source, searchTerm, props, token) =>
    dispatch(search(source, searchTerm, props, token)),
  wsCopyFromTemplate: (activePageId, payload) =>
    dispatch(wsCopyFromTemplate(activePageId, payload)),
  wsAddLayer: (activePageId, payload) =>
    dispatch(wsAddLayer(activePageId, payload)),
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplatesCategoryViewAll);
