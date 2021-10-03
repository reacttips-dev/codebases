import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Col, Nav, Tab } from "react-bootstrap";
import { withRouter } from "react-router";
import AITemplates from "./AITemplates";
import { StyledAITabNav } from "../_components/styled/ai/styledAi";
import TldrAiBase from "./TldrAiBase";
import AIInputForm from "./AIInputForm";
import { resetDocument } from "../_actions/aiDocumentActions";

export const AutoGeneration = (props) => {
  const [selectedTab, setSelectedTab] = useState("goals");
  const [wizardData, setWizardData] = useState({});

  function onComplete(step, data, extra) {
    if (step === "welcome") {
      setSelectedTab("info");
    } else if (step === "goals") {
      setWizardData({ ...wizardData, goals: data });
      setSelectedTab("info");
    }
  }

  useEffect(() => {
    props.resetDocument();
    return () => {};
  }, []);

  return (
    <TldrAiBase className="ai-box">
      <Tab.Container
        id="left-tabs-example"
        activeKey={selectedTab}
        onSelect={(k) => setSelectedTab(k)}
      >
        <Nav className="justify-content-center">
          <Nav.Item>
            <StyledAITabNav
              tldrbtn={selectedTab === "goals" ? "primary" : ""}
              eventKey="goals"
            >
              1. Select an objective
            </StyledAITabNav>
          </Nav.Item>
          <Nav.Item>
            <StyledAITabNav
              tldrbtn={selectedTab === "info" ? "primary" : ""}
              disabled={!wizardData?.goals}
              eventKey="info"
            >
              2. Tell us more
            </StyledAITabNav>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          {selectedTab === "welcome" ? (
            <></>
          ) : // <Tab.Pane eventKey="welcome">
          //     <DomainNameForm onComplete={onComplete}></DomainNameForm>
          // </Tab.Pane>
          selectedTab === "info" ? (
            <Tab.Pane eventKey="info">
              <Col md={{ span: 6, offset: 3 }}>
                <AIInputForm prompt={wizardData.goals}></AIInputForm>
              </Col>
            </Tab.Pane>
          ) : selectedTab === "goals" ? (
            <Tab.Pane eventKey="goals">
              <AITemplates onComplete={onComplete}></AITemplates>
            </Tab.Pane>
          ) : (
            <></>
          )}
        </Tab.Content>
      </Tab.Container>
    </TldrAiBase>
  );
};

AutoGeneration.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => {
  return {
    resetDocument: () => dispatch(resetDocument()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AutoGeneration));
