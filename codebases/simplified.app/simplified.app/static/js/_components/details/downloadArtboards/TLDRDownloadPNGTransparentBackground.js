import React, { Component } from "react";
import { StyledDropdownHeader } from "../../styled/details/styleDownloadOptions";
import { accent, white } from "../../styled/variable";
import Switch from "react-switch";

class TLDRDownloadPNGTransparentBackground extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  render() {
    return (
      <>
        <StyledDropdownHeader className={"transparent-bg-switch"}>
          <span>{"Transparent background"}</span>
          <Switch
            onChange={this.onSwitchChange}
            checked={this.state.checked}
            offColor={white}
            onColor={accent}
            offHandleColor={accent}
            checkedIcon={false}
            uncheckedIcon={false}
            height={15}
            width={40}
          />
        </StyledDropdownHeader>
      </>
    );
  }

  onSwitchChange = (checked, event, id) => {
    this.setState({ checked: checked });
    this.props.onTransparentBackgroundCheckBoxChange(checked);
  };
}

TLDRDownloadPNGTransparentBackground.propTypes = {};

export default TLDRDownloadPNGTransparentBackground;
