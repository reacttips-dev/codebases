import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Tab } from "react-bootstrap";
import {
  StyledTldrTabContainer,
  StyledTldrTabPane,
} from "../_components/styled/home/stylesHome";
import StartFromScratch from "./StartFromScratch";
import MyDesigns from "./MyDesigns";
import MyAssets from "./MyAssets";
import MyTemplatesScreen from "./MyTemplatesScreen";
import QuickStart from "./QuickStart";
import MyFolders from "./MyFolders";
import AllFormatsTemplate from "./AllFormatsTemplate";
import ViewAllTemplates from "./ViewAllTemplates";
import AIPlayground from "../TldrAi/AIPlayground";
import { connect } from "react-redux";
import TldrTrialEndedModal from "../TldrSettings/TldrBillingAndPayments/Modals/TldrTrialEndedModal";
import { getSubscription } from "../_actions/subscriptionActions";
import AutoGeneration from "../TldrAi/AutoGeneration";

const Marketplace = (props) => {
  const [selectedTab] = useState(props.path);
  const [showTrialPeriodEndedModal, setShowTrialPeriodEndedModal] =
    useState(false);

  useEffect(() => {
    props.getSubscription().then(() => {
      if (props.subscription.subscribedPlan?.trial_remaining_days < 0) {
        setShowTrialPeriodEndedModal(true);
      }
    });
  }, []);

  return (
    <div className="tldr-content-wrap" style={{ width: "100%" }}>
      <StyledTldrTabContainer id="marketplace" defaultActiveKey={selectedTab}>
        <Tab.Content className={"dashboard-tab-content"}>
          {selectedTab === "projects" ? (
            <StyledTldrTabPane eventKey="projects" className="mt-4">
              <MyDesigns />
            </StyledTldrTabPane>
          ) : selectedTab === "quick_start" ? (
            <StyledTldrTabPane eventKey="quick_start">
              <QuickStart />
            </StyledTldrTabPane>
          ) : selectedTab === "assets" ? (
            <StyledTldrTabPane eventKey="assets">
              <MyAssets />
            </StyledTldrTabPane>
          ) : selectedTab === "my_templates" ? (
            <StyledTldrTabPane eventKey="my_templates">
              <MyTemplatesScreen templateType="" />
            </StyledTldrTabPane>
          ) : selectedTab === "my_components" ? (
            <StyledTldrTabPane eventKey="my_components">
              <MyTemplatesScreen templateType="shape" />
            </StyledTldrTabPane>
          ) : selectedTab === "templates_screen" ? (
            <StyledTldrTabPane eventKey="templates_screen">
              <AllFormatsTemplate />
            </StyledTldrTabPane>
          ) : selectedTab === "templates_by_format" ? (
            <StyledTldrTabPane eventKey="templates_by_format">
              <ViewAllTemplates />
            </StyledTldrTabPane>
          ) : selectedTab === "layouts" ? (
            <StyledTldrTabPane eventKey="layouts">
              <StartFromScratch />
            </StyledTldrTabPane>
          ) : selectedTab === "my_folders" ? (
            <StyledTldrTabPane eventKey="my_folders">
              <MyFolders />
            </StyledTldrTabPane>
          ) : selectedTab === "ai" ? (
            <Tab.Pane eventKey="ai">
              <AIPlayground />
            </Tab.Pane>
          ) : selectedTab === "ai_new" ? (
            <Tab.Pane eventKey="ai_new">
              <AutoGeneration />
            </Tab.Pane>
          ) : (
            <></>
          )}
        </Tab.Content>
      </StyledTldrTabContainer>
      <TldrTrialEndedModal show={showTrialPeriodEndedModal} />
    </div>
  );
};

Marketplace.propTypes = {
  path: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  subscription: state.subscription,
});

const mapDispatchToProps = (dispatch) => ({
  getSubscription: () => dispatch(getSubscription()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Marketplace);
