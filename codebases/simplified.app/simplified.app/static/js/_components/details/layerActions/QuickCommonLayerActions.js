import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { ReactComponent as IconBottom } from "../../../assets/icons/icon_al_bottom.svg";
import { ReactComponent as IconCenter } from "../../../assets/icons/icon_al_h_middle.svg";
import { ReactComponent as IconLeft } from "../../../assets/icons/icon_al_left.svg";
import { ReactComponent as IconRight } from "../../../assets/icons/icon_al_right.svg";
import { ReactComponent as IconTop } from "../../../assets/icons/icon_al_top.svg";
import { ReactComponent as IconMiddle } from "../../../assets/icons/icon_al_v_middle.svg";
import { ReactComponent as IconBackward } from "../../../assets/icons/icon_backward.svg";
import { ReactComponent as IconFlipH } from "../../../assets/icons/icon_flip_h.svg";
import { ReactComponent as IconFlipV } from "../../../assets/icons/icon_flip_v.svg";
import { ReactComponent as IconForward } from "../../../assets/icons/icon_forward.svg";
import { ReactComponent as IconBack } from "../../../assets/icons/icon_to_back.svg";
import { ReactComponent as IconFront } from "../../../assets/icons/icon_to_front.svg";
import { wsMoveLayer } from "../../../_actions/webSocketAction";
import { alignObject } from "../../../_utils/common";
import { TldrCustomSidebarIconAction } from "../../common/statelessView";
import {
  StyledAdvEditorToolbarFormatGroup,
  StyledAdvEditorToolbarRow,
} from "../../styled/details/stylesDetails";
import { white } from "../../styled/variable";
import {
  ALIGN_BOTTOM,
  ALIGN_CENTER,
  ALIGN_LEFT,
  ALIGN_MIDDLE,
  ALIGN_RIGHT,
  ALIGN_TOP,
} from "../constants";

class QuickCommonLayerActions extends Component {
  move = (action) => {
    const { canvasRef } = this.props;
    canvasRef.handler.move(action);
    this.props.wsMoveLayer(action, this.props.editor.activeElement.id);
  };

  align = (action) => {
    const { activeElement, activeSelection } = this.props.editor;
    if (activeElement.mime) {
      alignObject(action, this.props.canvasRef);
    } else if (activeSelection.mime) {
      this.alignGroupedObject(action);
    }
  };

  alignGroupedObject = (direction) => {
    let group = this.props.canvasRef.handler.canvas.getActiveObject();
    if (!group) {
      return;
    }

    let groupWidth = group.getBoundingRect(true).width;
    let groupHeight = group.getBoundingRect(true).height;
    let scaleXFactor = group.scaleX;
    let scaleYFactor = group.scaleY;

    group.forEachObject((item) => {
      var itemWidth = item.getBoundingRect().width * scaleXFactor;
      var itemHeight = item.getBoundingRect().height * scaleYFactor;

      if (direction === "left") {
        item.set({
          left: -(groupWidth / 2),
          originX: "left",
          originY: "top",
        });
      } else if (direction === "center") {
        item.set({
          left: -itemWidth / 2,
          originX: "left",
          originY: "top",
        });
      } else if (direction === "middle") {
        item.set({
          top: -itemHeight / 2,
          left: -itemWidth / 2,
          originX: "left",
          originY: "top",
        });
      } else if (direction === "top") {
        item.set({
          top: -groupHeight / 2,
          originX: "left",
          originY: "top",
        });
      } else if (direction === "right") {
        item.set({
          left: groupWidth / 2 - itemWidth,
          originX: "left",
          originY: "top",
        });
      } else if (direction === "bottom") {
        item.set({
          top: groupHeight / 2 - itemHeight,
          originX: "left",
          originY: "top",
        });
      }
    });

    group.forEachObject((item) => {
      group.removeWithUpdate(item).addWithUpdate(item);
    });
    group.setCoords();
    this.props.canvasRef.handler.canvas.renderAll();
    this.props.canvasRef.handler.updatePositions(group);
  };

  render() {
    const { editor, layers, pages, showOrderOptions, showFlipOptions } =
      this.props;
    const { activeElement, activePage, activeSelection } = editor;
    const editorFormat = activeElement.format;
    const { id: activePageId } = activePage;
    const { id: activeElementId } = activeElement;
    const { selectedElements } = activeSelection;
    if ((!activePageId || !activeElementId) && !(selectedElements.length > 0)) {
      return <></>;
    }
    const totalLayersInPage = pages[activePageId].layers.length - 1;
    const selectedLayer = layers[activeElementId];

    return (
      <>
        <StyledAdvEditorToolbarRow>
          {showOrderOptions && (
            <StyledAdvEditorToolbarFormatGroup className="mb-3">
              <div className="title">Order</div>
              <div className="actions">
                <TldrCustomSidebarIconAction
                  disabled={selectedLayer?.order === totalLayersInPage}
                  action="move_to_front"
                  icon={<IconFront fill={white} />}
                  title="Bring to front"
                  callback={this.move}
                />

                <TldrCustomSidebarIconAction
                  disabled={selectedLayer?.order === totalLayersInPage}
                  action="move_forward"
                  icon={<IconForward fill={white} />}
                  title="Bring forward"
                  callback={this.move}
                />

                <TldrCustomSidebarIconAction
                  disabled={selectedLayer?.order === 0}
                  action="move_backward"
                  icon={<IconBackward fill={white} />}
                  title="Send backward"
                  callback={this.move}
                />

                <TldrCustomSidebarIconAction
                  disabled={selectedLayer?.order === 0}
                  action="move_to_back"
                  icon={<IconBack fill={white} />}
                  title="Send to back"
                  callback={this.move}
                />
              </div>
            </StyledAdvEditorToolbarFormatGroup>
          )}

          {showFlipOptions && (
            <StyledAdvEditorToolbarFormatGroup className="mb-3">
              <div className="title">Flip</div>
              <div className="actions">
                <TldrCustomSidebarIconAction
                  action="flipX"
                  icon={
                    <IconFlipH
                      fill={white}
                      className={editorFormat?.flipX ? "active" : ""}
                    />
                  }
                  title="Flip Horizontally"
                  callback={this.transform}
                />

                <TldrCustomSidebarIconAction
                  action="flipY"
                  icon={
                    <IconFlipV
                      fill={white}
                      className={editorFormat?.flipY ? "active" : ""}
                    />
                  }
                  title="Flip Vertically"
                  callback={this.transform}
                />
              </div>
            </StyledAdvEditorToolbarFormatGroup>
          )}
        </StyledAdvEditorToolbarRow>

        <StyledAdvEditorToolbarFormatGroup className="mb-3">
          <div className="title">Align</div>
          <div className="actions">
            <TldrCustomSidebarIconAction
              action={ALIGN_TOP}
              icon={<IconTop fill={white} />}
              title="Top"
              callback={this.align}
            />

            <TldrCustomSidebarIconAction
              action={ALIGN_MIDDLE}
              icon={<IconMiddle fill={white} />}
              title="Middle"
              callback={this.align}
            />

            <TldrCustomSidebarIconAction
              action={ALIGN_BOTTOM}
              icon={<IconBottom fill={white} />}
              title="Bottom"
              callback={this.align}
            />

            <TldrCustomSidebarIconAction
              action={ALIGN_LEFT}
              icon={<IconLeft fill={white} />}
              title="Left"
              callback={this.align}
            />

            <TldrCustomSidebarIconAction
              action={ALIGN_CENTER}
              icon={<IconCenter fill={white} />}
              title="Center"
              callback={this.align}
            />

            <TldrCustomSidebarIconAction
              action={ALIGN_RIGHT}
              icon={<IconRight fill={white} />}
              title="Right"
              callback={this.align}
            />
          </div>
        </StyledAdvEditorToolbarFormatGroup>
      </>
    );
  }

  transform = (action) => {
    const { editor, canvasRef } = this.props;
    const editorFormat = editor.activeElement.format;
    switch (action) {
      case "flipX":
        canvasRef.handler.objectHandler.flipX(!editorFormat.flipX);
        break;
      case "flipY":
        canvasRef.handler.objectHandler.flipY(!editorFormat.flipY);
        break;
      default:
        return;
    }
  };
}

QuickCommonLayerActions.propTypes = {
  editor: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  layers: state.layerstore.layers,
  pages: state.pagestore.pages,
});

const mapDispatchToProps = (dispatch) => ({
  wsMoveLayer: (action, payload) => dispatch(wsMoveLayer(action, payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuickCommonLayerActions);
