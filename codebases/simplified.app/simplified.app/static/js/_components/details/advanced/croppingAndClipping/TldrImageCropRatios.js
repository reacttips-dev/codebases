import React, { Component } from "react";
import { connect } from "react-redux";
import TldrCollpasibleSection from "../../../common/TldrCollpasibleSection";
import {
  StyledLayoutCollection,
  StyledSlideLayout,
} from "../../../styled/details/stylesDetails";
import { AVAILABLE_RATIOS_FOR_CROP } from "../../constants";
import {
  StyledSlideLayoutContent,
  StyledSlideSubtitle,
  StyledSlideTitle,
} from "../../../styled/details/stylesDetails";
import { TldrCollapsableAction } from "../../../common/statelessView";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { setCrop } from "../../../../_actions/textToolbarActions";
import { white } from "../../../styled/variable";

class TldrImageCropRatios extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: false,
      localRatio: "",
    };
  }

  render() {
    const { collapse, localRatio } = this.state;
    const { activeElement } = this.props.editor;
    const availableRatios = AVAILABLE_RATIOS_FOR_CROP.map((ratio, index) => {
      return (
        <StyledSlideLayout
          key={index}
          onClick={() => this.onChangeCropRatio(ratio)}
          className={localRatio === ratio.subtitle ? "active" : ""}
        >
          <StyledSlideLayoutContent
            ratio={ratio.subtitle}
          ></StyledSlideLayoutContent>
          <StyledSlideTitle>{ratio.title}</StyledSlideTitle>
          <StyledSlideSubtitle>{ratio.subtitle}</StyledSlideSubtitle>
        </StyledSlideLayout>
      );
    });
    const actionsView = (
      <>
        <TldrCollapsableAction
          icon={faCheck}
          action={activeElement.mime}
          callback={this.applyCrop}
          title="Apply Crop"
          iconColor={white}
          disabled={!this.props.canvasRef.handler.cropHandler.cropRect}
        ></TldrCollapsableAction>
        <TldrCollapsableAction
          icon={faTimes}
          action={activeElement.mime}
          callback={this.cancelCrop}
          title="Cancel Crop"
          iconColor={white}
        ></TldrCollapsableAction>
      </>
    );

    return (
      <TldrCollpasibleSection
        title="Crop Ratios"
        collapse={collapse}
        onToggleCollapse={this.handleToggleChange}
        toggleButton={actionsView}
      >
        <StyledLayoutCollection location="crop">
          {availableRatios}
        </StyledLayoutCollection>
      </TldrCollpasibleSection>
    );
  }

  onChangeCropRatio = (ratioData) => {
    const { canvasRef } = this.props;
    const { cropHandler } = canvasRef.handler;

    this.setState({ localRatio: ratioData.subtitle });
    cropHandler.changeCropArea(ratioData.subtitle);
  };

  handleToggleChange = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  applyCrop = (action) => {
    const { canvasRef } = this.props;
    const { cropHandler } = canvasRef.handler;

    if (cropHandler.cropRect) {
      cropHandler.finish();
    }
    this.props.setCrop(false);
  };

  cancelCrop = (action) => {
    const { canvasRef } = this.props;
    const { cropHandler } = canvasRef.handler;

    cropHandler.cancel(false);
    this.props.setCrop(false);
  };
}

TldrImageCropRatios.propTypes = {};

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  setCrop: (isEnable) => dispatch(setCrop(isEnable)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TldrImageCropRatios);
