import React from "react";
import { Tab } from "react-bootstrap";
import {
  StyledAINavMainTab,
  StyledAIPlaygroundNav,
} from "../_components/styled/ai/styledAi";
import { lightInactive, primary } from "../_components/styled/variable";
import { SETTINGS_TABBAR } from "../_utils/constants";

function TldrSettingsSecondaryNavbar(props) {
  return (
    <>
      <Tab.Container
        id="left-tabs-example"
        onSelect={(k) => {
          props.onTabChanged(k);
        }}
      >
        <StyledAIPlaygroundNav className="flex-nowrap no-scrollbar">
          {SETTINGS_TABBAR.map((tab, index) => {
            return (
              <StyledAINavMainTab
                key={index}
                eventKey={tab.path}
                isactive={props.selectedTab === tab.path}
              >
                <p
                  className="label"
                  style={{
                    color:
                      props.selectedTab === tab.path ? primary : lightInactive,
                  }}
                >
                  {tab.label}
                </p>
              </StyledAINavMainTab>
            );
          })}
        </StyledAIPlaygroundNav>
      </Tab.Container>
    </>
  );
}

TldrSettingsSecondaryNavbar.propTypes = {};

export default TldrSettingsSecondaryNavbar;
