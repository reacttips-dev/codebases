import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import TldrSettingsBase from "../TldrSettings/TldrSettingsBase";
import ChangePassword from "../_components/settings/ChangePassword";
import TldrCollpasibleSectionSettings from "../_components/settings/TldrCollpasibleSectionSettings";
import UpdatePersonalInfo from "../_components/settings/UpdatePersonalInfo";
import { StyledSettingsBaseDiv } from "../_components/styled/settings/stylesSettings";

class TldrMyAccount extends Component {
  componentWillMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    this.setState({ startSpinner: false });
  }

  render() {
    return (
      <>
        <StyledSettingsBaseDiv>
          <div className="tldr-settings">
            <TldrSettingsBase>
              <TldrCollpasibleSectionSettings
                title="Account Information"
                collapse={false}
              >
                <UpdatePersonalInfo />
              </TldrCollpasibleSectionSettings>
            </TldrSettingsBase>
          </div>

          <div className="tldr-settings">
            <TldrSettingsBase>
              <TldrCollpasibleSectionSettings
                title="Change Password"
                collapse={false}
                showHL={false}
              >
                <ChangePassword />
              </TldrCollpasibleSectionSettings>
            </TldrSettingsBase>
          </div>
        </StyledSettingsBaseDiv>
      </>
    );
  }
}

TldrMyAccount.propTypes = {
  errors: PropTypes.object.isRequired,
  story: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  story: state.story,
});

export default connect(mapStateToProps, null)(TldrMyAccount);
