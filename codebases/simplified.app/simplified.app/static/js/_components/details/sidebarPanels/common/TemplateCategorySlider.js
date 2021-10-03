import React, { Component } from "react";
import {
  GalleryTypeHeaderTitle,
  ImageItem,
} from "../../../common/statelessView";
import { connect } from "react-redux";
import {
  fetchData,
  closeSlider,
} from "../../../../_actions/sidebarSliderActions";
import { wsCopyFromTemplate } from "../../../../_actions/webSocketAction";
import TLDRSwiper from "../../../common/TLDRSwiper";
import { isEmpty } from "lodash";
import { isMobileView } from "../../../../_utils/common";

class TemplateCategorySlider extends Component {
  render() {
    const { title, data = [], templateType, artBoardHandler } = this.props;

    let childElements = [];

    if (!isEmpty(data) && Array.isArray(data)) {
      childElements = data.map((image) => {
        return (
          <div
            key={image.id}
            className={
              templateType === "icons"
                ? "item item-element element-slider-icon"
                : "item item-element element-slider-item"
            }
            onClick={() => this.handleClick(image)}
          >
            <ImageItem
              data={this.preparePayload(image)}
              key={image.id}
              url={image.image}
              alt={image.description}
              width={image.image_width}
              height={
                templateType === "icons"
                  ? image.image_height
                  : image.image_width
              } // To make the square
              source={image.source}
              type={image.type}
              itemWidth={80.656}
              showOverlayInfo={false}
              isUsedInSwiper={true}
            />
          </div>
        );
      });
    }

    const swiperParams = {
      spaceBetween: 15,
      slidesPerView: 3,
      noSwiping: true,
      freeMode: true,
      shouldSwiperUpdate: true,
      runCallbacksOnInit: true,
      containerClass: "element-swiper-container",
      mousewheel: true,
      lazy: true,
      preloadImages: false,
    };

    return (
      <>
        <GalleryTypeHeaderTitle title={title} toggleMore={this.toggleMore} />
        <TLDRSwiper
          swiperParams={swiperParams}
          artBoardHandler={artBoardHandler}
        >
          {childElements}
        </TLDRSwiper>
      </>
    );
  }

  componentDidMount() {}

  componentWillUnmount() {}

  preparePayload = (data) => {
    let imageWidth = data.image_width;
    let imageHeight = data.image_height;
    const { templateType } = this.props;

    if (imageWidth <= 0 || imageHeight <= 0) {
    }

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

  toggleMore = (event) => {
    this.props.openMore(event, this.props.categoryType, this.props.categoryId);
  };

  handleClick = (data) => {
    const { templateType } = this.props;
    if (templateType === "icons") {
      this.toggleMore();
    } else {
      this.addLayer(data);
      if (isMobileView()) {
        this.props.closeSlider();
      }
    }
  };
}

TemplateCategorySlider.propTypes = {};

const mapStateToProps = (state) => ({
  panelType: state.sidebarSlider.sliderPanelType,
  sidebarSlider: state.sidebarSlider,
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (props, token) => dispatch(fetchData(props, token)),
  wsCopyFromTemplate: (activePageId, payload) =>
    dispatch(wsCopyFromTemplate(activePageId, payload)),
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateCategorySlider);
