import React, { Component } from "react";
import { connect } from "react-redux";
import { StyledSettingsBaseDiv } from "../_components/styled/settings/stylesSettings";
import TldrSettingsBase from "../TldrSettings/TldrSettingsBase";
import Members from "../_components/settings/Members";
import TldrCollpasibleSectionSettings from "../_components/settings/TldrCollpasibleSectionSettings";
import UpdateWorkspaceName from "../_components/settings/UpdateWorkspaceName";

class TldrMyWorkspace extends Component {
  componentDidMount() {}

  render() {
    return (
      <>
        <StyledSettingsBaseDiv>
          <TldrSettingsBase>
            <TldrCollpasibleSectionSettings
              title="Update Workspace Name"
              collapse={false}
            >
              <UpdateWorkspaceName />
            </TldrCollpasibleSectionSettings>
          </TldrSettingsBase>

          <TldrSettingsBase>
            <TldrCollpasibleSectionSettings title="Members" collapse={false}>
              <Members />
            </TldrCollpasibleSectionSettings>
          </TldrSettingsBase>
        </StyledSettingsBaseDiv>
      </>
    );
  }
}

TldrMyWorkspace.propTypes = {};

const mapDispatchToProps = {};

export default connect(null, mapDispatchToProps)(TldrMyWorkspace);
