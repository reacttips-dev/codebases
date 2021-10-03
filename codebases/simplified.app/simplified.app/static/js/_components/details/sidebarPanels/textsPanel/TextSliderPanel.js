import React, { Component } from "react";
import SearchForm from "../../../common/SearchForm";
import { connect } from "react-redux";

import TextBlockList from "./TextBlockList";
import TextBasicList from "./TextBasicList";
import TextMyFontsList from "./TextMyFontsList";
import { Tab, Nav } from "react-bootstrap";
import axios from "axios";

import {
  StyledAdvancedTab,
  StyledSidebarTabNav,
  StyledSidebarTabNavLink,
} from "../../../styled/details/styleAdvancedPanel";
import { closeSlider } from "../../../../_actions/sidebarSliderActions";

class TextSliderPanel extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "basic",
      visible: true,
    };
  }

  componentDidMount() {
    // Do nothing
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  render() {
    const { selectedTab } = this.state;

    return (
      <>
        <StyledAdvancedTab id="text-tab" defaultActiveKey={selectedTab}>
          <Tab.Content>
            <StyledSidebarTabNav className="flex-row mb-3">
              <Nav.Item>
                <StyledSidebarTabNavLink
                  onSelect={(k) => this.setState({ selectedTab: k })}
                  eventKey="basic"
                  tldrbtn={selectedTab === "basic" ? "primary" : ""}
                >
                  Basic
                </StyledSidebarTabNavLink>
              </Nav.Item>
              <Nav.Item>
                <StyledSidebarTabNavLink
                  onSelect={(k) => this.setState({ selectedTab: k })}
                  eventKey="combinations"
                  tldrbtn={selectedTab === "combinations" ? "primary" : ""}
                  className="ml-2"
                >
                  All Variations
                </StyledSidebarTabNavLink>
              </Nav.Item>
            </StyledSidebarTabNav>

            <Tab.Pane eventKey="basic">
              {selectedTab === "basic" && (
                <>
                  <TextBasicList handler={this.props.artBoardHandler.handler} />
                  <TextMyFontsList />
                </>
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="combinations">
              {selectedTab === "combinations" && (
                <>
                  <SearchForm
                    signalToken={this.signal.token}
                    autoFocus={true}
                  />
                  <TextBlockList />
                </>
              )}
            </Tab.Pane>
            <Tab.Pane eventKey="mytext">
              {selectedTab === "mytext" && (
                <>
                  <SearchForm
                    signalToken={this.signal.token}
                    autoFocus={true}
                  />
                  <TextBlockList />
                </>
              )}
            </Tab.Pane>
          </Tab.Content>
        </StyledAdvancedTab>
      </>
    );
  }
}

TextSliderPanel.propTypes = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextSliderPanel);
