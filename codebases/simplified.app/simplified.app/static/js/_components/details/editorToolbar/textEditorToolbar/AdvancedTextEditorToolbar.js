import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import TldrCollpasibleSection from "../../../common/TldrCollpasibleSection";
import TldrGradientCollapsibleSection from "../../../common/tldrGradients/TldrGradientCollapsibleSection";
import { StyledAdvEditorToolbarFormatGroup } from "../../../styled/details/stylesDetails";
import TLDRBold from "./TLDRBold";
import TLDRFontDropDown from "./TLDRFontDropDown";
import TLDRFontSize from "./TLDRFontSize";
import TLDRFontWeightDropDown from "./TLDRFontWeightDropDown";
import TLDRItalic from "./TLDRItalic";
import TLDRLineHeight from "./TLDRLineHeight";
import TLDRLineSpace from "./TLDRLineSpace";
import TLDRStrikethrough from "./TLDRStrikethrough";
import TLDRTextAlign from "./TLDRTextAlign";
import TLDRTextColor from "./TLDRTextColor";
import TLDRTextHighlightColor from "./TLDRTextHighlightColor";
import TLDRTextScript from "./TLDRTextScript";
import TLDRUnderline from "./TLDRUnderline";

class AdvancedTextEditorToolbar extends Component {
  constructor(props) {
    super(props);

    this.state = { collapse: false };
  }

  handleToggleChange = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  render() {
    const { editor, canvasRef, brandKit } = this.props;
    const { activeElement } = editor;

    return (
      <>
        <TldrCollpasibleSection
          title="Typography"
          collapse={this.state.collapse}
          onToggleCollapse={this.handleToggleChange}
        >
          <StyledAdvEditorToolbarFormatGroup className="mb-3">
            <div className="title">Font and Size</div>
            <div className="actions ml-0">
              <TLDRFontDropDown canvasRef={canvasRef} />
              <TLDRFontWeightDropDown canvasRef={canvasRef} />
            </div>
          </StyledAdvEditorToolbarFormatGroup>

          <StyledAdvEditorToolbarFormatGroup className="mb-3">
            <div className="actions ml-0">
              <TLDRFontSize canvasRef={canvasRef} />

              <TLDRBold canvasRef={canvasRef} />
              <TLDRItalic canvasRef={canvasRef} />
              <TLDRUnderline canvasRef={canvasRef} />
              <TLDRStrikethrough canvasRef={canvasRef} />
            </div>
          </StyledAdvEditorToolbarFormatGroup>

          <StyledAdvEditorToolbarFormatGroup className="mb-3">
            <div className="title">Color</div>
            <div className="actions ml-0">
              <TLDRTextColor
                canvasRef={canvasRef}
                top={40}
                right={brandKit.brandkitPayload.length > 0 ? -89 : -71}
                showHexCode={true}
              />
              <TLDRTextHighlightColor
                canvasRef={canvasRef}
                top={40}
                right={0}
                showHexCode={true}
              />
            </div>
          </StyledAdvEditorToolbarFormatGroup>

          <div className="d-inline-flex">
            <StyledAdvEditorToolbarFormatGroup className="mb-3">
              <div className="title">Text Align</div>
              <div className="actions">
                <TLDRTextAlign canvasRef={canvasRef} />
                <div className="tldr-vl" />
              </div>
            </StyledAdvEditorToolbarFormatGroup>

            <StyledAdvEditorToolbarFormatGroup className="mb-3">
              <div className="title">Extras</div>
              <div className="actions">
                {/* <TldrEditorAction
                action={"uppercase"}
                icon={<UppercaseIcon />}
                title={"Uppercase"}
                callback={this.callback}
                active={editorFormat["text-transform"] === "uppercase"}
              />

              <TldrEditorAction
                action={"lowercase"}
                icon={<LowercaseIcon />}
                title={"Lowercase"}
                callback={this.callback}
                active={editorFormat["text-transform"] === "lowercase"}
              />
              <div className="tldr-vl" /> */}
                <TLDRTextScript canvasRef={canvasRef} />
                {/* <div className="tldr-vl" />

              <TldrEditorAction
                action={"clean"}
                icon={faRemoveFormat}
                title={"Clear Formatting"}
                callback={this.callback}
              /> */}
              </div>
            </StyledAdvEditorToolbarFormatGroup>
          </div>
          <div className="actions mb-2">
            <TLDRLineHeight canvasRef={canvasRef} />
          </div>
          <div className="actions mb-2">
            <TLDRLineSpace canvasRef={canvasRef} />
          </div>
        </TldrCollpasibleSection>
        <TldrGradientCollapsibleSection
          canvasRef={canvasRef}
          mime={activeElement.mime}
        />
      </>
    );
  }

  componentDidMount() {
    // Do nothing
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}
}

AdvancedTextEditorToolbar.propTypes = {
  editor: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  brandKit: state.brandKit,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvancedTextEditorToolbar);
