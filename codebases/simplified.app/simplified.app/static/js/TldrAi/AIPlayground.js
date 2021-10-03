import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { MAGICAL, DOCUMENTS, FAVORITES } from "../_utils/routes";
import TldrSavedCopies from "./TldrSavedCopies";
import TldrFavoriteCopies from "./TldrFavoriteCopies";
import { Tab } from "react-bootstrap";
import {
  StyledAINavMainTab,
  StyledAIPlaygroundNav,
} from "../_components/styled/ai/styledAi";
import { AI_TABBAR } from "../_utils/constants";
import { lightInactive, primary } from "../_components/styled/variable";
import AutoGeneration from "./AutoGeneration";

const AIPlayground = (props) => {
  const [selectedTab, setSelectedTab] = useState(props.location.pathname);

  useEffect(() => {
    setSelectedTab(props.location.pathname);
    return () => {};
  }, [props]);

  let selectedView;
  switch (selectedTab) {
    case MAGICAL:
      selectedView = <AutoGeneration></AutoGeneration>;
      break;
    case DOCUMENTS:
      selectedView = <TldrSavedCopies></TldrSavedCopies>;
      break;
    case FAVORITES:
      selectedView = <TldrFavoriteCopies></TldrFavoriteCopies>;
      break;
    default:
      selectedView = <AutoGeneration></AutoGeneration>;
      break;
  }
  return (
    <>
      <Tab.Container
        id="left-tabs-ai"
        activeKey={selectedTab}
        onSelect={(k) => setSelectedTab(k)}
        defaultActiveKey={selectedTab}
      >
        <StyledAIPlaygroundNav className="flex-nowrap no-scrollbar">
          {AI_TABBAR.map((tab, index) => {
            return (
              <StyledAINavMainTab
                key={index}
                eventKey={tab.path}
                isactive={selectedTab === tab.path}
              >
                <p
                  className="label"
                  style={{
                    color: selectedTab === tab.path ? primary : lightInactive,
                  }}
                >
                  {tab.label}
                </p>
              </StyledAINavMainTab>
            );
          })}
        </StyledAIPlaygroundNav>

        <Tab.Content className="mt-3">
          <Tab.Pane eventKey={selectedTab}>{selectedView}</Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default withRouter(AIPlayground);
