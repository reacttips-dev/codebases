import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import ImagesSliderPanel from "./ImagesSliderPanel";
import TemplateSliderPanel from "./TemplateSliderPanel";
import TextSliderPanel from "./textsPanel/TextSliderPanel";
import MediaSliderPanel from "./mediaPanel/MediaSliderPanel";
import AssetsSliderPanel from "./AssetsSliderPanel";
import {
  TEMPLATES_SLIDER_PANEL,
  ASSETS_SLIDER_PANEL,
  IMAGES_SLIDER_PANEL,
  GIPHY_SLIDER_PANEL,
  TEXT_SLIDER_PANEL,
  VIDEO_SLIDER_PANEL,
  ELEMENTS_SLIDER_PANEL,
  ACTION_SLIDER_PANEL,
  ICONS_SLIDER_PANEL,
  MUSIC_SLIDER_PANEL,
} from "../constants";
import { SidebarPanel } from "../../common/statelessView";
import ActionsSliderPanel from "./ActionsSliderPanel";
import ElementsSliderPanel from "./ElementsSliderPanel";
import IconsSliderPanel from "./IconsSliderPanel";
import Drawer from "react-bottom-drawer";
import { StyledFullDrawer } from "../../styled/styles";
import { closeSlider } from "../../../_actions/sidebarSliderActions";

export class StudioSidebarItemDetailSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSliderOpen: false,
      sliderPanelType: IMAGES_SLIDER_PANEL,
      visible: false,
      width: window.innerWidth,
    };
    this.content = <></>;
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (
      nextProps.sidebarSlider.isSliderOpen !== state.isSliderOpen ||
      nextProps.sidebarSlider.sliderPanelType !== state.sliderPanelType
    ) {
      return {
        ...state,
        isSliderOpen: nextProps.sidebarSlider.isSliderOpen,
        sliderPanelType: nextProps.sidebarSlider.sliderPanelType,
      };
    }
    return null;
  }

  componentDidMount = () => {
    window.addEventListener(
      "resize",
      _.debounce(() => {
        this.setWindowWidth();
      }, 100)
    );
  };

  componentDidUpdate = () => {
    const { isSliderOpen, sliderPanelType } = this.state;
    const showPanelContent = isSliderOpen === "open" ? true : false;

    if (showPanelContent && sliderPanelType) {
      this.setState({ visible: true });
    } else {
      this.setState({ visible: false });
    }
  };

  setWindowWidth = () => {
    this.setState({
      width: window.innerWidth,
    });
  };

  isMobileView = () => {
    if (this?.state?.width < 768) {
      return true;
    }
    return false;
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(this.state, nextState)) {
      return true;
    }
    return false;
  }

  handleAction = (action) => {
    if (action === "close") {
      this.props.closeAdvancedSettings();
    }
  };

  getPanel = () => {
    const { isSliderOpen, sliderPanelType } = this.state;
    const { artBoardHandler, canvasRef } = this.props;
    const showPanelContent = isSliderOpen === "open" ? true : false;

    let selectedPanel = null;

    if (showPanelContent) {
      switch (sliderPanelType) {
        case TEMPLATES_SLIDER_PANEL:
          selectedPanel = (
            <SidebarPanel childComp={<TemplateSliderPanel />}></SidebarPanel>
          );
          break;
        case ASSETS_SLIDER_PANEL:
          selectedPanel = (
            <SidebarPanel
              childComp={<AssetsSliderPanel canvasRef={canvasRef} />}
            ></SidebarPanel>
          );
          break;
        case IMAGES_SLIDER_PANEL:
          selectedPanel = (
            <SidebarPanel
              childComp={
                <ImagesSliderPanel
                  artBoardHandler={artBoardHandler}
                  canvasRef={canvasRef}
                />
              }
            ></SidebarPanel>
          );
          break;
        case ICONS_SLIDER_PANEL:
          selectedPanel = (
            <SidebarPanel
              childComp={<IconsSliderPanel artBoardHandler={artBoardHandler} />}
            ></SidebarPanel>
          );
          break;
        case TEXT_SLIDER_PANEL:
          selectedPanel = (
            <SidebarPanel
              childComp={<TextSliderPanel artBoardHandler={artBoardHandler} />}
            ></SidebarPanel>
          );
          break;
        case VIDEO_SLIDER_PANEL:
        case GIPHY_SLIDER_PANEL:
        case MUSIC_SLIDER_PANEL:
          selectedPanel = (
            <SidebarPanel
              childComp={<MediaSliderPanel canvasRef={canvasRef} />}
            ></SidebarPanel>
          );
          break;
        case ELEMENTS_SLIDER_PANEL:
          selectedPanel = (
            <SidebarPanel
              childComp={
                <ElementsSliderPanel artBoardHandler={artBoardHandler} />
              }
            ></SidebarPanel>
          );
          break;
        case ACTION_SLIDER_PANEL:
          selectedPanel = (
            <SidebarPanel childComp={<ActionsSliderPanel />}></SidebarPanel>
          );
          break;
        default:
          selectedPanel = (
            <SidebarPanel childComp={<TemplateSliderPanel />}></SidebarPanel>
          );
      }
    }
    return selectedPanel;
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.setWindowWidth);
  };

  render() {
    return (
      <>
        {this.isMobileView() ? (
          <StyledFullDrawer>
            <Drawer
              className="drawer"
              isVisible={this.state.visible}
              hideScrollbars={true}
              onClose={() => {
                this.setState({ visible: false });
                this.props.closeSlider();
              }}
            >
              {this.getPanel()}
            </Drawer>
          </StyledFullDrawer>
        ) : (
          this.getPanel()
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  sidebarSlider: state.sidebarSlider,
});

const mapDispatchToProps = (dispatch) => ({
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudioSidebarItemDetailSlider);
