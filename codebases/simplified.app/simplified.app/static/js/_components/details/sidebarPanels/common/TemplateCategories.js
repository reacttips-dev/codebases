import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  fetchData,
  resetViewAll,
  search,
} from "../../../../_actions/sidebarSliderActions";
import { connect } from "react-redux";
import axios from "axios";
import {
  RequestTemplateContent,
  ShowCenterSpinner,
} from "../../../common/statelessView";
import TemplateCategorySlider from "./TemplateCategorySlider";
import TemplatesCategoryViewAll from "./TemplatesCategoryViewAll";
import { isEmpty } from "lodash";
import TLDRInfiniteScroll from "../../../common/TLDRInfiniteScroll";

class TemplateCategories extends Component {
  signal = axios.CancelToken.source();
  abortController = new AbortController();

  render() {
    const {
      sidebarSlider,
      openMore,
      templateType,
      searchText,
      artBoardHandler,
    } = this.props;
    const { payload, loaded, hasMore } = sidebarSlider;
    let elementTypeSliders = [];

    if (payload.length > 0) {
      elementTypeSliders = payload.map((item, index) => {
        return (
          <TemplateCategorySlider
            categoryType={
              templateType === "icons" ? item.name : item.category?.display_name
            }
            title={
              templateType === "icons"
                ? item.name
                : item?.category?.display_name
            }
            openMore={openMore}
            data={this.preparePayload(item)}
            key={index}
            templateType={templateType}
            categoryId={templateType === "icons" ? item?.id : item.category?.id}
            // loadPage={this.loadPage}
            // hasMore={true}
            artBoardHandler={artBoardHandler}
          />
        );
      });
    }

    return (
      <div
        id="template-gallery-scrollable-wrapper"
        className={"tab-template-gallery"}
      >
        {templateType === "icons" ? (
          searchText === "" ? (
            elementTypeSliders
          ) : (
            <TemplatesCategoryViewAll
              title={templateType}
              templateType={templateType}
              isIconSearched={true}
              viewAll={true}
              artBoardHandler={artBoardHandler}
            />
          )
        ) : (
          <TLDRInfiniteScroll
            childrens={elementTypeSliders}
            hasMore={hasMore}
            loadMoreData={this.loadPage}
            scrollableTarget="template-gallery-scrollable-wrapper"
            loaded={loaded}
          />
        )}
        {/* Show for first time loading */}
        {!loaded && <ShowCenterSpinner loaded={loaded} />}

        {loaded &&
        elementTypeSliders.length === 0 &&
        this.props.sidebarSlider.iconsSource === "Flaticon" ? (
          <RequestTemplateContent text={`No ${templateType} found`} />
        ) : null}
      </div>
    );
  }

  componentDidMount() {
    this.loadPage();
  }

  loadPage = () => {
    const { searchText, templateType } = this.props;
    if (templateType === "icons") {
      if (searchText === "") {
        this.props.fetchData(
          "Flaticon",
          { ...this.props },
          this.abortController.signal
        );
      } else {
        this.props.search(
          "Flaticon",
          searchText,
          { ...this.props },
          this.abortController.signal
        );
      }
    } else {
      if (searchText === "") {
        this.props.fetchData("", { ...this.props }, this.signal.token);
      } else {
        this.props.search("", searchText, { ...this.props }, this.signal.token);
      }
    }
  };

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
    this.abortController.abort();
  }

  preparePayload = (data) => {
    const { templateType, searchText } = this.props;

    if (templateType === "icons") {
      const payload = [
        {
          category: data.name,
          description: null,
          id: data.id,
          image:
            searchText === ""
              ? data?.sprites?.general
              : data.images.svg || "Loading icons ... ",
          title: "",
          template: "icon",
          image_width: 0,
          image_height: 10,
          source: "Flaticon",
          type: "png",
        },
      ];

      return payload;
    } else {
      if (isEmpty(data.payload)) {
        data.payload = {};
      }
      data.payload["source"] = "TLDR";
      data.payload["type"] = "svg";
      return data.payload;
    }
  };
}

TemplateCategories.propTypes = {
  panelType: PropTypes.string.isRequired,
  editor: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  openMore: PropTypes.func.isRequired,
};

TemplateCategories.defaultProps = {};

const mapStateToProps = (state) => ({
  panelType: state.sidebarSlider.sliderPanelType,
  sidebarSlider: state.sidebarSlider,
  editor: state.editor,
  page: state.sidebarSlider.page,
  searchText: state.sidebarSlider.searchText,
  story: state.story,
  pagestore: state.pagestore,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (source, props, token) =>
    dispatch(fetchData(source, props, token)),
  resetViewAll: () => dispatch(resetViewAll()),
  search: (source, searchTerm, props, token) =>
    dispatch(search(source, searchTerm, props, token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TemplateCategories);
