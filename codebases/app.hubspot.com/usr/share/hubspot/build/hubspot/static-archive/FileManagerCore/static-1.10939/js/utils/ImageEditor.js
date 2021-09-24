'use es6';

import * as AspectRatioRoundingModes from '../constants/AspectRatioRoundingModes';
import I18n from 'I18n';
export function getCenterPixelValue(containerDimension, cropBoxDimension) {
  return containerDimension === cropBoxDimension ? 0 : (containerDimension - cropBoxDimension) / 2;
}
export function getCropBoxDataObjWithSmallerWidth(cropBoxData, containerData, newWidth, resizeRatio) {
  var resizedWidth = newWidth * resizeRatio;
  return Object.assign({}, cropBoxData, {
    width: resizedWidth,
    left: getCenterPixelValue(containerData.width, resizedWidth)
  });
}
export function getCropBoxDataObjWithSmallerHeight(cropBoxData, containerData, newHeight, resizeRatio) {
  var resizedHeight = newHeight * resizeRatio;
  return Object.assign({}, cropBoxData, {
    height: resizedHeight,
    top: getCenterPixelValue(containerData.height, resizedHeight)
  });
} // TODO: Maybe instead of using cropper directly just pass in all the data you get from it? That way we can test it

export function getCropBoxDataObjForSquareImage(cropBoxData, containerData, canvasData, height, width) {
  if (height > width) {
    // Width would be the new size of everything, center height
    var resizedWidth = width * (canvasData.width / canvasData.naturalWidth);
    return Object.assign({}, cropBoxData, {
      height: resizedWidth,
      width: resizedWidth,
      top: getCenterPixelValue(containerData.height, resizedWidth)
    });
  } else {
    // Height would be the new size of everything, center width
    var resizedHeight = height * (canvasData.height / canvasData.naturalHeight);
    return Object.assign({}, cropBoxData, {
      height: resizedHeight,
      width: resizedHeight,
      left: getCenterPixelValue(containerData.width, resizedHeight)
    });
  }
}

function isRespectingAspectRatio(width, height, targetAspectRatio, mode) {
  var potentialNewAspectRatio = width / height;

  switch (mode) {
    case AspectRatioRoundingModes.ABOVE:
      return potentialNewAspectRatio >= targetAspectRatio;

    case AspectRatioRoundingModes.BELOW:
      return potentialNewAspectRatio <= targetAspectRatio;

    default:
      return true;
  }
}

export function getRectangularAdjustCropBoxParams(imgWidth, imgHeight, horizontal, vertical) {
  var mode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : AspectRatioRoundingModes.DEFAULT;
  var potentialNewWidth = Math.round(imgHeight / vertical * horizontal);
  var potentialNewHeight = Math.round(imgWidth / horizontal * vertical);
  var targetAspectRatio = horizontal / vertical;

  while (!isRespectingAspectRatio(imgWidth, potentialNewHeight, targetAspectRatio, mode)) {
    if (mode === AspectRatioRoundingModes.ABOVE) {
      if (potentialNewHeight <= 1) {
        break;
      }

      potentialNewHeight--;
    }

    if (mode === AspectRatioRoundingModes.BELOW) {
      if (potentialNewHeight >= imgHeight) {
        break;
      }

      potentialNewHeight++;
    }
  }

  while (!isRespectingAspectRatio(potentialNewWidth, imgHeight, targetAspectRatio, mode)) {
    if (mode === AspectRatioRoundingModes.ABOVE) {
      if (potentialNewWidth >= imgWidth) {
        break;
      }

      potentialNewWidth++;
    }

    if (mode === AspectRatioRoundingModes.BELOW) {
      if (potentialNewWidth <= 1) {
        break;
      }

      potentialNewWidth--;
    }
  }

  return {
    imgWidth: imgWidth,
    imgHeight: imgHeight,
    potentialNewWidth: potentialNewWidth,
    potentialNewHeight: potentialNewHeight
  };
}
export function getCanvasBlobAndSaveFileForUnsupportedBrowsers(cropper, fileName, encoding, fileFolderId, onCropSave) {
  var quality = 1;
  var type = "image/" + encoding;
  var dataURL = cropper.getCroppedCanvas().toDataURL(type, quality).split(',')[1];
  setTimeout(function () {
    var binStr = atob(dataURL);
    var len = binStr.length;
    var arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }

    var blob = new Blob([arr], {
      type: type
    });
    onCropSave(blob, fileName, fileFolderId);
  });
}
export var getIsCanvasToBlobSupported = function getIsCanvasToBlobSupported() {
  return HTMLCanvasElement.prototype.toBlob;
};
export function getNewCanvasAndBoxDataAfterRotation(containerData, cropBoxData, canvasData) {
  var containerHeight = containerData.height;
  var containerWidth = containerData.width;
  var canvasHeight = canvasData.height;
  var canvasWidth = canvasData.width;
  var newHeight = 0;
  var newWidth = 0; // Use math round to compare integers instead of floats

  if (Math.round(canvasHeight) > Math.round(canvasWidth)) {
    var ratio = containerHeight / canvasHeight;
    newWidth = ratio * canvasWidth;

    if (newWidth >= containerWidth) {
      newWidth = containerWidth;
      newHeight = containerWidth / canvasWidth * canvasHeight;
      var newTop = (containerHeight - newHeight) / 2;
      canvasData.top = newTop;
      cropBoxData.top = newTop;
      canvasData.left = 0;
      cropBoxData.left = 0;
    } else {
      newHeight = containerHeight;
      var newLeft = (containerWidth - newWidth) / 2;
      canvasData.top = 0;
      canvasData.left = newLeft;
      cropBoxData.left = newLeft;
    }
  } else {
    var _ratio = containerWidth / canvasWidth;

    newHeight = _ratio * canvasHeight;

    if (newHeight >= containerHeight) {
      newHeight = containerHeight;
      newWidth = containerHeight / canvasHeight * canvasWidth;

      var _newLeft = (containerWidth - newWidth) / 2;

      canvasData.left = _newLeft;
      cropBoxData.left = _newLeft;
      canvasData.top = 0;
      cropBoxData.top = 0;
    } else {
      newWidth = containerWidth;

      var _newTop = (containerHeight - newHeight) / 2;

      canvasData.left = 0;
      canvasData.top = _newTop;
      cropBoxData.top = _newTop;
    }
  }

  canvasData.height = newHeight;
  canvasData.width = newWidth;
  cropBoxData.height = newHeight;
  cropBoxData.width = newWidth;
  return {
    canvasData: canvasData,
    cropBoxData: cropBoxData
  };
}
export function getCropBoxDataForDimensionAndPositionReset(containerData, canvasData) {
  var containerHeight = containerData.height,
      containerWidth = containerData.width;
  var canvasHeight = canvasData.height,
      canvasWidth = canvasData.width;
  var top = canvasHeight === containerHeight ? 0 : (containerHeight - canvasHeight) / 2;
  var left = canvasWidth === containerWidth ? 0 : (containerWidth - canvasWidth) / 2;
  return {
    top: top,
    left: left,
    height: canvasHeight,
    width: canvasWidth
  };
}
export var getDefaultEditedImageName = function getDefaultEditedImageName() {
  return I18n.text('FileManagerCore.imageEditor.defaultFileName');
};