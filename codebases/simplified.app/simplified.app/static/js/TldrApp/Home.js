import React, { Component } from "react";
import Marketplace from "./Marketplace";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  PROJECTS,
  LAYOUTS,
  MY_ASSETS,
  MY_TEMPLATES,
  MY_COMPONENTS,
  QUICK_START,
  MY_FOLDERS,
  TEMPLATES_SCREEN,
  MY_COPIES,
  MAGICAL,
  AI_TEMPLATE_PATH,
  AI_NEW_DOCUMENT,
  TEMPLATES_BY_FORMAT_SCREEN_PATH,
  DOCUMENTS,
  TEMPLATES_BY_CATEGORY_SCREEN_PATH,
} from "../_utils/routes";
import TldrHomeBase from "./TldrHomeBase";

export class Home extends Component {
  getSelectedTab() {
    const { path } = this.props.match;
    let selectedTab = "quick_start";
    switch (path) {
      case PROJECTS:
        selectedTab = "projects";
        break;
      case QUICK_START:
        selectedTab = "quick_start";
        break;
      case LAYOUTS:
        selectedTab = "layouts";
        break;
      case MY_ASSETS:
        selectedTab = "assets";
        break;
      case MY_TEMPLATES:
        selectedTab = "my_templates";
        break;
      case MY_COMPONENTS:
        selectedTab = "my_components";
        break;
      case MY_FOLDERS:
        selectedTab = "my_folders";
        break;
      case TEMPLATES_SCREEN:
        selectedTab = "templates_screen";
        break;
      case TEMPLATES_BY_CATEGORY_SCREEN_PATH:
      case TEMPLATES_BY_FORMAT_SCREEN_PATH:
        selectedTab = "templates_by_format";
        break;
      case MY_COPIES:
        selectedTab = "saved_copies";
        break;
      case MAGICAL:
        selectedTab = "ai";
        break;
      case AI_TEMPLATE_PATH:
        selectedTab = "ai_document";
        break;
      case AI_NEW_DOCUMENT:
        selectedTab = "ai_new";
        break;
      case DOCUMENTS:
        selectedTab = "documents";
        break;
      default:
        selectedTab = "quick_start";
        break;
    }
    return selectedTab;
  }

  render() {
    let selectedTab = this.getSelectedTab();
    let selectedView = "";
    switch (selectedTab) {
      case "ai_document":
        const {
          params: { promptId },
        } = this.props.match;
        selectedView = (
          <Marketplace
            path={selectedTab}
            key={promptId}
            extras={promptId}
          ></Marketplace>
        );
        break;
      default:
        selectedView = (
          <Marketplace path={selectedTab} key={selectedTab}></Marketplace>
        );
        break;
    }

    return <TldrHomeBase {...this.props}>{selectedView}</TldrHomeBase>;
  }
}

Home.propTypes = {
  errors: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({});

const mapStateToProps = (state) => ({
  errors: state.errors,
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
