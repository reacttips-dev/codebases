import React, { Component } from "react";
import PropTypes from "prop-types";
import { batch, connect } from "react-redux";
import { Tab, Nav } from "react-bootstrap";
import axios from "axios";
import {
  StyledAdvancedTab,
  StyledSidebarTabNav,
  StyledSidebarTabNavLink,
} from "../../../styled/details/styleAdvancedPanel";
import VideoList from "./VideoList";
import GiphyList from "./GiphyList";
import AudioList from "./AudioList";
import {
  resetViewAll,
  switchMediaTab,
} from "../../../../_actions/sidebarSliderActions";
import {
  MUSIC_SLIDER_PANEL,
  GIPHY_SLIDER_PANEL,
  VIDEO_SLIDER_PANEL,
} from "../../constants";
import { closeSlider } from "../../../../_actions/sidebarSliderActions";

class MediaSliderPanel extends Component {
  signal = axios.CancelToken.source();
  abortController = new AbortController();

  constructor(props) {
    super(props);

    this.state = {
      selectedTab: props.sidebarSlider.sliderPanelType
        ? props.sidebarSlider.sliderPanelType
        : VIDEO_SLIDER_PANEL,
    };
  }

  componentDidMount() {
    // Do nothing
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  render() {
    const { canvasRef } = this.props;
    const { selectedTab } = this.state;

    return (
      <>
        <StyledAdvancedTab id="media-tab" defaultActiveKey={selectedTab}>
          <Tab.Content>
            <StyledSidebarTabNav className="flex-row mb-3">
              <Nav.Item>
                <StyledSidebarTabNavLink
                  onSelect={this.onSelectTabChange}
                  eventKey={VIDEO_SLIDER_PANEL}
                  tldrbtn={selectedTab === VIDEO_SLIDER_PANEL ? "primary" : ""}
                >
                  Videos
                </StyledSidebarTabNavLink>
              </Nav.Item>
              <Nav.Item>
                <StyledSidebarTabNavLink
                  onSelect={this.onSelectTabChange}
                  eventKey={GIPHY_SLIDER_PANEL}
                  tldrbtn={selectedTab === GIPHY_SLIDER_PANEL ? "primary" : ""}
                  className="ml-2"
                >
                  GIFs
                </StyledSidebarTabNavLink>
              </Nav.Item>
              <Nav.Item>
                <StyledSidebarTabNavLink
                  onSelect={this.onSelectTabChange}
                  eventKey={MUSIC_SLIDER_PANEL}
                  tldrbtn={selectedTab === MUSIC_SLIDER_PANEL ? "primary" : ""}
                  className="ml-2"
                >
                  Audio
                </StyledSidebarTabNavLink>
              </Nav.Item>
            </StyledSidebarTabNav>

            <Tab.Pane eventKey={VIDEO_SLIDER_PANEL}>
              {selectedTab === VIDEO_SLIDER_PANEL && (
                <VideoList canvasRef={canvasRef} />
              )}
            </Tab.Pane>
            <Tab.Pane eventKey={GIPHY_SLIDER_PANEL}>
              {selectedTab === GIPHY_SLIDER_PANEL && (
                <GiphyList canvasRef={canvasRef} />
              )}
            </Tab.Pane>
            <Tab.Pane eventKey={MUSIC_SLIDER_PANEL}>
              {selectedTab === MUSIC_SLIDER_PANEL && (
                <AudioList canvasRef={canvasRef} />
              )}
            </Tab.Pane>
          </Tab.Content>
        </StyledAdvancedTab>
      </>
    );
  }

  onSelectTabChange = (k) => {
    const { selectedTab } = this.state;

    if (k !== selectedTab) {
      batch(() => {
        this.props.resetViewAll();
        this.props.switchMediaTab(k);
      });
    }
    this.setState({ selectedTab: k });
  };
}

MediaSliderPanel.propTypes = {
  sidebarSlider: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  sidebarSlider: state.sidebarSlider,
});

const mapDispatchToProps = (dispatch) => ({
  resetViewAll: () => dispatch(resetViewAll()),
  switchMediaTab: (sliderPanelType) =>
    dispatch(switchMediaTab(sliderPanelType)),
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MediaSliderPanel);
