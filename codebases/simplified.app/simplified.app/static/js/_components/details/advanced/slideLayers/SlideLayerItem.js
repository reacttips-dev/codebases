import React, { Component } from "react";
import {
  StyledLayerItem,
  StyledLayerItemIcon,
  StyledLayerItemDescription,
  StyledLayerItemDragGrip,
  StyledLayerImageIcon,
  StyledLayerSVGIcon,
  StyledAppliedAnimationsListContainer,
  StyledAnimationTimeContainer,
  StyledLayerHeaderAndAnimationContainer,
  StyledLayerItemColumn,
} from "../../../styled/details/styleSlideLayers";
import { ReactComponent as TextNormal } from "../../../../assets/icons/text-normal.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getMIMETypeFromFabricObject, isURL } from "../../../../_utils/common";

const LayerImageIcon = ({ mime, layer, name }) => {
  let url;
  let alt;
  if (mime === "image") {
    url = layer.src;
  } else if (mime === "giphy") {
    url = layer.src;
    alt = name;
  } else if (mime === "video") {
    url = layer.cover;
  } else if (mime === "shape") {
    if (isURL(layer.svg)) {
      return (
        <StyledLayerImageIcon src={layer.svg} alt={alt}></StyledLayerImageIcon>
      );
    }
    return <StyledLayerSVGIcon src={layer.svg} />;
  }

  return <StyledLayerImageIcon src={url} alt={alt}></StyledLayerImageIcon>;
};

const LayerTextIcon = () => {
  return <TextNormal />;
};

class SlideLayerItem extends Component {
  render() {
    const { layer, location, isActive, layerTitle } = this.props;
    const mime = getMIMETypeFromFabricObject(layer.type);

    const locked = !layer.selectable && layer.selectable === false;
    return (
      <>
        <StyledLayerItem onClick={this.selectElement} className={isActive}>
          <StyledLayerItemIcon>
            {mime !== "text" ? (
              <LayerImageIcon layer={layer} mime={mime} />
            ) : (
              <LayerTextIcon />
            )}
          </StyledLayerItemIcon>

          {location === "edit" ? (
            <StyledLayerItemColumn>
              <StyledLayerItemDescription location={location}>
                {mime === "text"
                  ? layer.text
                  : `${mime[0].toUpperCase()}${mime.slice(1)}`}
              </StyledLayerItemDescription>
              <p className="layer-title">{layerTitle}</p>
            </StyledLayerItemColumn>
          ) : (
            <StyledLayerHeaderAndAnimationContainer>
              <StyledLayerItemDescription location={location}>
                {mime === "text"
                  ? layer.text
                  : `${mime[0].toUpperCase()}${mime.slice(1)}`}
              </StyledLayerItemDescription>
              <StyledAppliedAnimationsListContainer>
                {/* {listOfAnimations} */}
              </StyledAppliedAnimationsListContainer>
            </StyledLayerHeaderAndAnimationContainer>
          )}

          {locked ? (
            <FontAwesomeIcon icon={"lock"} className="mr-2"></FontAwesomeIcon>
          ) : location === "edit" ? (
            <StyledLayerItemDragGrip
              className="mr-2"
              icon="angle-right"
            ></StyledLayerItemDragGrip>
          ) : (
            <StyledAnimationTimeContainer>
              {/* {totalLayerAnimationTime} */}
            </StyledAnimationTimeContainer>
          )}
        </StyledLayerItem>
      </>
    );
  }

  getAnimationsList = () => {
    var appliedAnimationNames = [];
    this.props.layer.animation.forEach((element) => {
      appliedAnimationNames.push(element.type);
    });
    appliedAnimationNames = [...new Set(appliedAnimationNames)];

    let animationList = appliedAnimationNames.map((name, index) => {
      return <React.Fragment key={index}>{name}, </React.Fragment>;
    });

    return animationList;
  };

  getLayerAnimationTime = () => {
    var finalEndTime = 0;
    this.props.layer.animation.forEach((element) => {
      finalEndTime += element.end_time;
    });

    return finalEndTime;
  };

  selectElement = (event) => {
    const { layer } = this.props;
    let locked = !layer.selectable && layer.selectable === false;
    if (!locked) {
      this.props.onSelect(layer.id, "select");
    } else {
      this.props.onSelect(layer.id, "unlock");
    }
  };
}

export default SlideLayerItem;
