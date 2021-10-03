import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyledAdvancedTab,
  StyledSidebarTabNav,
  StyledSidebarTabNavLink,
} from "../../../styled/details/styleAdvancedPanel";
import { Tab, Nav } from "react-bootstrap";
import { ICONS_SLIDER_PANEL, TEMPLATES_SLIDER_PANEL } from "../../constants";
import MyTemplates from "./MyTemplates";
import StockTemplates from "./StockTemplates";
import { resetViewAll } from "../../../../_actions/sidebarSliderActions";
import Brandfetch from "./Brandfetch";

class Templates extends Component {
  constructor(props) {
    super(props);

    this.panelType = this.props.panelType;
    this.filterBy = this.props.filterBy;
    this.allTemplate = `all${this.panelType}`;
    this.myTemplate = `my${this.panelType}`;
    this.allTemplateTitle = `All ${this.panelType}`;
    this.myTemplateTitle = `My ${this.panelType}`;

    this.state = {
      selectedTab: this.allTemplate,
    };
  }

  render() {
    const { artBoardHandler } = this.props;
    const { selectedTab } = this.state;

    let templateType = this.getTemplateType();

    return (
      <StyledAdvancedTab
        id={`${this.panelType}-tab`}
        defaultActiveKey={this.allTemplate}
      >
        <Tab.Content>
          <StyledSidebarTabNav className="flex-row mb-3">
            <Nav.Item>
              <StyledSidebarTabNavLink
                onSelect={this.onSelectTabChange}
                eventKey={this.allTemplate}
                tldrbtn={selectedTab === this.allTemplate ? "primary" : ""}
              >
                {this.allTemplateTitle}
              </StyledSidebarTabNavLink>
            </Nav.Item>
            {templateType === "icons" ? (
              <Nav.Item>
                <StyledSidebarTabNavLink
                  onSelect={this.onSelectTabChange}
                  eventKey={this.myTemplate}
                  tldrbtn={selectedTab === this.myTemplate ? "primary" : ""}
                  className="ml-2"
                >
                  Brand Logos
                </StyledSidebarTabNavLink>
              </Nav.Item>
            ) : (
              <Nav.Item>
                <StyledSidebarTabNavLink
                  onSelect={this.onSelectTabChange}
                  eventKey={this.myTemplate}
                  tldrbtn={selectedTab === this.myTemplate ? "primary" : ""}
                  className="ml-2"
                >
                  {this.myTemplateTitle}
                </StyledSidebarTabNavLink>
              </Nav.Item>
            )}
          </StyledSidebarTabNav>

          <Tab.Pane eventKey={this.allTemplate}>
            {selectedTab === this.allTemplate && (
              <StockTemplates
                templateType={templateType}
                panelType={
                  templateType === "icons"
                    ? ICONS_SLIDER_PANEL
                    : TEMPLATES_SLIDER_PANEL
                }
                artBoardHandler={artBoardHandler}
              />
            )}
          </Tab.Pane>
          {templateType === "icons" ? (
            <Tab.Pane eventKey={this.myTemplate}>
              {selectedTab === this.myTemplate && (
                <Brandfetch props={this.props} />
              )}
            </Tab.Pane>
          ) : (
            <Tab.Pane eventKey={this.myTemplate}>
              {selectedTab === this.myTemplate && (
                <MyTemplates
                  templateType={templateType}
                  panelType={
                    templateType === "icons"
                      ? ICONS_SLIDER_PANEL
                      : TEMPLATES_SLIDER_PANEL
                  }
                />
              )}
            </Tab.Pane>
          )}
        </Tab.Content>
      </StyledAdvancedTab>
    );
  }

  getTemplateType = () => {
    switch (this.panelType) {
      case "templates":
        return "template";
      case "components":
      case "elements":
        return "shape";
      case "icons":
        return "icons";
      default:
        return "template";
    }
  };

  onSelectTabChange = (k) => {
    const { selectedTab } = this.state;

    if (k !== selectedTab) {
      this.props.resetViewAll();
    }

    this.setState({ selectedTab: k });
  };
}

Templates.propTypes = {};

Templates.defaultProps = {
  panelType: "templates",
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  resetViewAll: () => dispatch(resetViewAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Templates);
