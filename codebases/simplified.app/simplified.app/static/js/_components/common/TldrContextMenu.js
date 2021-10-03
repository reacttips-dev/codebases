import React from "react";
import { Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import "antd/dist/antd.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as IconForward } from "../../assets/icons/icon_forward.svg";
import { ReactComponent as IconFront } from "../../assets/icons/icon_to_front.svg";
import { ReactComponent as IconBackward } from "../../assets/icons/icon_backward.svg";
import { ReactComponent as IconBack } from "../../assets/icons/icon_to_back.svg";
import { ReactComponent as IconTop } from "../../assets/icons/icon_al_top.svg";
import { ReactComponent as IconMiddle } from "../../assets/icons/icon_al_v_middle.svg";
import { ReactComponent as IconBottom } from "../../assets/icons/icon_al_bottom.svg";
import { ReactComponent as IconRight } from "../../assets/icons/icon_al_right.svg";
import { ReactComponent as IconCenter } from "../../assets/icons/icon_al_h_middle.svg";
import { ReactComponent as IconLeft } from "../../assets/icons/icon_al_left.svg";
import { ReactComponent as IconFlipH } from "../../assets/icons/icon_flip_h.svg";
import { ReactComponent as IconFlipV } from "../../assets/icons/icon_flip_v.svg";
import { white } from "../styled/variable";
import { takeSnapshopAndCreateTemplate } from "../../_actions/storiesActions";
import {
  ALIGN_LEFT,
  ALIGN_MIDDLE,
  ALIGN_RIGHT,
  ALIGN_TOP,
  ALIGN_CENTER,
  ALIGN_BOTTOM,
  FLIPH,
  FLIPV,
} from "../details/constants";
import { alignObject, onClickSetAsBackground } from "../../_utils/common";
import { StyledContextMenuDivider } from "../styled/details/stylesDetails";

const onClick = (action, props) => {
  if (action === "add_new_slide") {
    props.parentProps.wsAddPage();
  } else if (action === "set_as_background") {
    onClickSetAsBackground(props.canvasRef);
  } else if (action.startsWith("move")) {
    props.canvasRef.handler.move(action);
    props.parentProps.wsMoveLayer(
      action,
      props.parentProps.editor.activeElement.id
    );
  } else if (action === "save_as_component") {
    takeSnapshopAndCreateTemplate(
      "component",
      { canvasRef: props.canvasRef, props: props.parentProps },
      props.signal
    );
  }

  if (props.canvasRef) {
    props.canvasRef.handler.contextmenuHandler.hide();
  }
};

const transform = (action, props) => {
  const { editor } = props.parentProps;
  let editorFormat = editor.activeElement.format;
  switch (action) {
    case FLIPH:
      props.canvasRef.handler.objectHandler.flipX(!editorFormat?.flipX);
      break;
    case FLIPV:
      props.canvasRef.handler.objectHandler.flipY(!editorFormat?.flipY);
      break;
    default:
      return;
  }
};

const PageMenu = (props) => {
  return (
    <Menu theme="dark">
      <Menu.Item
        icon={<FontAwesomeIcon icon="plus" className="mr-2"></FontAwesomeIcon>}
        onClick={() => onClick("add_new_slide", props)}
      >
        Add New Slide
      </Menu.Item>
    </Menu>
  );
};

const LayerMenu = (props) => {
  const { target, parentProps } = props;
  const { editor, layerstore, pagestore } = parentProps;
  const activePageId = editor.activePage.id;
  const activeElementId = editor.activeElement.id;
  if (!activePageId || !activeElementId) {
    return <></>;
  }
  let totalLayersInPage = pagestore.pages[activePageId]?.layers.length - 1;
  let selectedLayer = layerstore.layers[activeElementId];
  return (
    <Menu theme="dark">
      {target.type === "image" && (
        <>
          <Menu.Item
            icon={<FontAwesomeIcon icon="expand-arrows-alt" />}
            onClick={() => onClick("set_as_background", props)}
          >
            Set as Background
          </Menu.Item>
          <StyledContextMenuDivider />
        </>
      )}
      {selectedLayer && (
        <>
          <Menu.Item
            disabled={selectedLayer.order === totalLayersInPage}
            icon={<IconFront fill={white} className="mr-2" />}
            onClick={() => onClick("move_to_front", props)}
          >
            Bring to front
          </Menu.Item>
          <Menu.Item
            disabled={selectedLayer.order === totalLayersInPage}
            icon={<IconForward fill={white} className="mr-2" />}
            onClick={() => onClick("move_forward", props)}
          >
            Bring forward
          </Menu.Item>
          <Menu.Item
            disabled={selectedLayer.order === 0}
            icon={<IconBack fill={white} className="mr-2" />}
            onClick={() => onClick("move_backward", props)}
          >
            Send backward
          </Menu.Item>
          <Menu.Item
            disabled={selectedLayer.order === 0}
            icon={<IconBackward fill={white} className="mr-2" />}
            onClick={() => onClick("move_to_back", props)}
          >
            Send to back
          </Menu.Item>
        </>
      )}
      <Menu.Item
        icon={
          <FontAwesomeIcon icon="shapes" className="mr-2"></FontAwesomeIcon>
        }
        onClick={() => onClick("save_as_component", props)}
      >
        Save as Component
      </Menu.Item>
      <StyledContextMenuDivider />

      <SubMenu title="Align" popupClassName="custom">
        <Menu.Item
          onClick={() => alignObject(ALIGN_TOP, props.canvasRef)}
          icon={<IconTop fill={white} className="mr-2" />}
        >
          Top
        </Menu.Item>
        <Menu.Item
          onClick={() => alignObject(ALIGN_MIDDLE, props.canvasRef)}
          icon={<IconMiddle fill={white} className="mr-2" />}
        >
          Middle
        </Menu.Item>
        <Menu.Item
          onClick={() => alignObject(ALIGN_BOTTOM, props.canvasRef)}
          icon={<IconBottom fill={white} className="mr-2" />}
        >
          Bottom
        </Menu.Item>
        <Menu.Item
          onClick={() => alignObject(ALIGN_LEFT, props.canvasRef)}
          icon={<IconLeft fill={white} className="mr-2" />}
        >
          Left
        </Menu.Item>
        <Menu.Item
          onClick={() => alignObject(ALIGN_CENTER, props.canvasRef)}
          icon={<IconCenter fill={white} className="mr-2" />}
        >
          Center
        </Menu.Item>
        <Menu.Item
          onClick={() => alignObject(ALIGN_RIGHT, props.canvasRef)}
          icon={<IconRight fill={white} className="mr-2" />}
        >
          Right
        </Menu.Item>
      </SubMenu>

      <SubMenu title="Flip" popupClassName="custom">
        <Menu.Item
          onClick={() => transform(FLIPH, props)}
          icon={<IconFlipH fill={white} className="mr-2" />}
        >
          Horizontally
        </Menu.Item>
        <Menu.Item
          onClick={() => transform(FLIPV, props)}
          icon={<IconFlipV fill={white} className="mr-2" />}
        >
          Vertically
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
};

const TldrContextMenu = (props) => {
  const { target, canvasRef, parentProps, signal } = props;

  return (target && target.id === "workarea") || !target ? (
    <PageMenu
      canvasRef={canvasRef}
      parentProps={parentProps}
      signal={signal}
    ></PageMenu>
  ) : (
    <LayerMenu
      target={target}
      canvasRef={canvasRef}
      parentProps={parentProps}
      signal={signal}
    ></LayerMenu>
  );
};

export default TldrContextMenu;
