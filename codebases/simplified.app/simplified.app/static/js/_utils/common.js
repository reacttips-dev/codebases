import axios from "axios";
import { find, forOwn, inRange, isEmpty } from "lodash";
import { setCurrentUser } from "../_actions/authActions";
import {
  CHECK_TASK_STATAUS,
  GENERIC_IMAGE_DOWNLOAD,
  PIXABAY_VIDEO_COVER_ENDPOINT,
} from "../_actions/endpoints";
import {
  ImageSources,
  VideoSources,
  ImageAppSources,
  SourceTypes,
  MusicSources,
} from "../_actions/types";
import {
  FABRIC_CIRCLE_ELEMENT,
  FABRIC_ELLIPSE_ELEMENT,
  FABRIC_GIF_ELEMENT,
  FABRIC_GROUP_ELEMENT,
  FABRIC_IMAGE_ELEMENT,
  FABRIC_ITEXT_ELEMENT,
  FABRIC_POLYGON_ELEMENT,
  FABRIC_RECT_ELEMENT,
  FABRIC_SVG_ELEMENT,
  FABRIC_TEXTBOX_ELEMENT,
  FABRIC_TEXT_ELEMENT,
  FABRIC_TRIANGLE_ELEMENT,
  FABRIC_VIDEO_ELEMENT,
} from "../_components/details/constants";
import transparent from "./../assets/icons/transparent.png";
import {
  LAYOUTS,
  MAGICAL,
  MY_APPS,
  PROJECTS,
  QUICK_START,
  ROOT,
  TEMPLATES_SCREEN,
} from "./routes";
import Analytics from "analytics";
import googleTagManager from "@analytics/google-tag-manager";
import Format from "string-format";
import invert from "invert-color";
import { STILL_ANIMATION } from "../_components/details/advanced/animations/defaultSlideTransitions";
import { defaultMusicPayload } from "../_components/canvas/constants/defaults";

const format = require("string-format");

export function pointToPixel(point) {
  // 1px = 0.75 point
  return point / 0.75;
}

export function pixelToPoint(pixel) {
  // 1px = 0.75 point
  return pixel * 0.75;
}

export const getPageDetails = (store, pageId) => {
  let currentPagePayload = null;
  store.results.results.forEach((page, index) => {
    if (pageId === page.id) {
      currentPagePayload = page;
      return;
    }
  });
  return currentPagePayload;
};

export const getLayerDetails = (store, pageId, layerId) => {
  let currentLayer = null;
  store.results.results.forEach((page, index) => {
    if (pageId === page.id) {
      var layerIndex = page.layers.findIndex((layer) => layer.id === layerId);
      return (currentLayer = page.layers[layerIndex]);
    }
  });
  return currentLayer;
};

export const fontHeadingBase = 0.09; // 9% of content size in px
export const fontSubHeadingBase = 0.06;
export const fontNormalBase = 0.04;

export const getMinSideBase = (contentSize) => {
  return Math.min(contentSize.width, contentSize.height);
};

export const getNormalFontSize = (contentSize) => {
  return fontNormalBase * getMinSideBase(contentSize);
};

export const convertCanvasObjectToDataURL = (canvasRef) => {
  return new Promise(function (resolve, reject) {
    let dataUrl = canvasRef.handler.getObjectImageDataUrl();
    if (dataUrl) {
      resolve(dataUrl);
    } else {
      reject("failed to convert object to image");
    }
  });
};

export const downloadFile = (dataUrl, fileName) => {
  var link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  link.click();
};

export const convertPixelToFloat = (pixelString) => {
  if (!pixelString) {
    return 0;
  }
  if (typeof pixelString === "number") {
    return pixelString;
  }
  return parseFloat(pixelString.slice(0, -2));
};

export const convertNumberToPixel = (string) => {
  return string + "px";
};

export const getAlignPosition = (
  elementSize,
  elementCurrentPosition,
  alignType,
  contentSize
) => {
  let x = elementCurrentPosition.x;
  let y = elementCurrentPosition.y;

  elementSize = {
    height: convertPixelToFloat(elementSize.height),
    width: convertPixelToFloat(elementSize.width),
  };

  switch (alignType) {
    case "top":
      y = 0;
      break;
    case "middle":
      y = (contentSize.height - elementSize.height) / 2;
      break;
    case "bottom":
      y = contentSize.height - elementSize.height;
      break;
    case "left":
      x = 0;
      break;
    case "middle-center":
      x = (contentSize.width - elementSize.width) / 2;
      y = (contentSize.height - elementSize.height) / 2;
      break;
    case "center":
      x = (contentSize.width - elementSize.width) / 2;
      break;
    case "right":
      x = contentSize.width - elementSize.width;
      break;
    default:
      x = elementCurrentPosition.x;
      y = elementCurrentPosition.y;
  }

  return { x: x, y: y };
};

export const getTextWidthHeight = (text, style) => {
  let element = document.createElement("p");
  document.body.appendChild(element);

  for (let styleAttribute in style) {
    if (style.hasOwnProperty(styleAttribute)) {
      element.style[styleAttribute] = style[styleAttribute];
    }
  }
  element.innerHTML = text;

  let width = Math.ceil(element.offsetWidth) * 1.1; // Add extra 10%
  let formattedWidth = width;

  let height = Math.ceil(element.offsetHeight) * 1.15;
  let formattedHeight = height;

  document.body.removeChild(element);

  return { width: formattedWidth, height: formattedHeight };
};

export const getAddHeadingTextPayload = (contentSize, text) => {
  const fontSize = getMinSideBase(contentSize) * fontHeadingBase;
  const HEADING_TEXT = text || "Hello world";
  const headingTextStyle = {
    font: "Rubik",
    fontSize: `${fontSize}px`,
    height: "auto",
    width: "auto",
    position: "absolute",
    fontWeight: "bold",
    whiteSpace: "no-wrap",
  };
  const headingSize = getTextWidthHeight(HEADING_TEXT, headingTextStyle);

  let position = getAlignPosition(
    headingSize,
    { x: 0, y: 0 },
    "center",
    contentSize
  );
  position = getAlignPosition(headingSize, position, "middle", contentSize);

  const addHeading = {
    mime: "text",
    payload: {
      size: headingSize,
      position: position,
    },
    content: {
      editorHTML: `<p><span style="color: rgb(0,0,0); font-family: Rubik; font-weight: bold; font-size: ${fontSize}px;">${HEADING_TEXT}</span></p>`,
    },
  };

  return addHeading;
};

export const getAddSubHeadingTextPayload = (contentSize) => {
  const fontSize = getMinSideBase(contentSize) * fontSubHeadingBase;
  const SUBHEADING_TEXT = "Hello world";
  const headingTextStyle = {
    font: "Rubik",
    fontSize: `${fontSize}px`,
    height: "auto",
    width: "auto",
    position: "absolute",
    fontWeight: 500,
    whiteSpace: "no-wrap",
  };
  const headingSize = getTextWidthHeight(SUBHEADING_TEXT, headingTextStyle);

  let position = getAlignPosition(
    headingSize,
    { x: 0, y: 0 },
    "center",
    contentSize
  );
  position = getAlignPosition(headingSize, position, "middle", contentSize);

  const addSubHeading = {
    mime: "text",
    payload: {
      size: headingSize,
      position: position,
    },
    content: {
      editorHTML: `<p><span style="color: rgb(0,0,0); font-family: Rubik; font-weight: bold; font-size: ${fontSize}px;">${SUBHEADING_TEXT}</span></p>`,
    },
  };

  return addSubHeading;
};

export const getAddBodyTextPayload = (contentSize) => {
  const fontSize = getMinSideBase(contentSize) * fontNormalBase;
  const BODY_TEXT = "Hello world";
  const headingTextStyle = {
    font: "Rubik",
    fontSize: `${fontSize}px`,
    height: "auto",
    width: "auto",
    position: "absolute",
    whiteSpace: "no-wrap",
  };
  const headingSize = getTextWidthHeight(BODY_TEXT, headingTextStyle);

  let position = getAlignPosition(
    headingSize,
    { x: 0, y: 0 },
    "center",
    contentSize
  );
  position = getAlignPosition(headingSize, position, "middle", contentSize);

  const addBodyText = {
    mime: "text",
    payload: {
      size: headingSize,
      position: position,
    },
    content: {
      editorHTML: `<p><span style="color: rgb(0,0,0); font-family: Rubik; font-size: ${fontSize}px;">${BODY_TEXT}</span></p>`,
    },
  };

  return addBodyText;
};

/*
It helps to convert JPEG/PNG dataURI into blob
*/
export const dataURItoBlob = (dataURI) => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};

/**
 *
 * @param {String} color
 */
export const getColorPickerButtonStyle = (color) => {
  if (color === "transparent" || color === "") {
    return {
      backgroundImage: `url(${transparent})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "32px 32px",
      backgroundPosition: "center",
    };
  }
  return { backgroundColor: color };
};

export const getImagePayload = (url, size) => {
  let defaultImageWidth = 600; // 200px
  let imageAspectRatio = size.width / size.height;
  let imageHeight = defaultImageWidth / imageAspectRatio;

  // const message = {
  //   mime: "image",
  //   payload: {
  //     size: { width: defaultImageWidth + "px", height: imageHeight + "px" },
  //     position: { x: 0, y: 0 },
  //   },
  //   content: {
  //     url: url,
  //   },
  // };
  const message = {
    mime: "image",
    payload: {
      name: "New Image",
      src: url,
      type: "image",
      height: imageHeight,
      width: defaultImageWidth,
    },
    content: {
      url: url,
    },
  };

  return message;
};

const imageMimeTypes = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
];

export const getHeightAndWidth = (file) => {
  return new Promise(function (resolve, reject) {
    if (!imageMimeTypes.includes(file.type)) {
      resolve({ width: 300, height: 300 });
    }

    const image = new Image();
    image.onload = () => {
      resolve({ width: image.width, height: image.height });
    };

    image.onerror = (error) => {
      reject(error);
    };
    image.src = URL.createObjectURL(file);
  });
};

/**
 * @param {HTMLImageElement} image - Image File Object
 * @param {Object} crop - crop Object
 * @param {String} fileName - Name of the returned file in Promise
 */
export const getCroppedImg = (image, crop, fileName) => {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  // As Base64 string
  // const base64Image = canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        blob.name = fileName;
        resolve(blob);
      },
      "image/jpeg",
      1
    );
  });
};

/**
 *
 * @param {String} textElementId - id of text element
 */
export const getTextElementQuillEditor = (textElementId) => {
  return document.querySelector(`#quill_${textElementId} .ql-container`)[
    "__quill"
  ];
};

export const getTextElementFormat = (textElementId) => {
  let quillEditor = getTextElementQuillEditor(textElementId);
  if (quillEditor === null) {
    return {};
  }
  return quillEditor.getFormat();
};

/// Auth actions
export const setAuthToken = (key, orgID) => {
  if (key && orgID) {
    axios.defaults.headers.common = {
      Authorization: "Token " + key,
      Organization: orgID,
    };
  } else if (key && orgID == null) {
    axios.defaults.headers.common = {
      Authorization: "Token " + key,
    };
    delete axios.defaults.headers.common["Organization"];
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
    delete axios.defaults.headers.common["Organization"];
  }
};

export const setAuthTokenInLocalStorage =
  (key, orgID, orgs, props) => (dispatch) => {
    setAuthToken(key, orgID);
    localStorage.setItem("Orgs", JSON.stringify(orgs));
    localStorage.setItem("SelectedOrgID", orgID);

    const payload = {
      key: key,
      user: JSON.parse(localStorage.getItem("User")),
      orgs: JSON.parse(localStorage.getItem("Orgs")),
      selectedOrg: Number(orgID),
    };
    //Set current user
    dispatch(setCurrentUser(payload));
  };

export const switchTeamId = (orgID) => {
  if (orgID) {
    axios.defaults.headers.common = {
      ...axios.defaults.headers.common,
      Organization: orgID,
    };
  }
};

export const getRootElementIdOfGroup = (layers, layerId) => {
  if (layers[layerId].parent === null) {
    return layerId;
  } else {
    return getRootElementIdOfGroup(layers, layers[layerId].parent);
  }
};

export const modifyQuillCursorStyling = (cursorId) => {
  let cursorSelectionBlocks = document.querySelectorAll(
    `#ql-cursor-${cursorId} .ql-cursor-selection-block`
  );
  if (cursorSelectionBlocks) {
    Array.from(cursorSelectionBlocks).forEach((block, index) => {
      block.style.setProperty(
        "transform-origin",
        `-${block.style.left} -${block.style.top} 0`
      );
    });
    let cursorCaretContainer = document.querySelector(
      `#ql-cursor-${cursorId} .ql-cursor-caret-container`
    );
    cursorCaretContainer.style.setProperty(
      "transform-origin",
      `-${cursorCaretContainer.style.left} -${cursorCaretContainer.style.top} 0`
    );

    let cursorFlag = document.querySelector(
      `#ql-cursor-${cursorId} .ql-cursor-flag`
    );
    cursorFlag.style.setProperty(
      "transform-origin",
      `-${cursorFlag.style.left} -${cursorFlag.style.top} 0`
    );
    cursorFlag.style.setProperty(
      "top",
      `${convertNumberToPixel(convertPixelToFloat(cursorFlag.style.top) + 20)}`
    );
  }
};

export const addBroadCastedCursor = (
  userCursorInfo,
  broadCastedCursor,
  layerId
) => {
  for (let userPk in userCursorInfo) {
    if (userCursorInfo.hasOwnProperty(userPk)) {
      let cursorColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      let cursorId = `${userPk}_${layerId}`;
      broadCastedCursor.createCursor(
        cursorId,
        userCursorInfo[userPk].user?.full_name
          ? userCursorInfo[userPk].user?.full_name
          : userCursorInfo[userPk].user?.username,
        cursorColor
      );

      if (userCursorInfo[userPk].cursor !== null) {
        broadCastedCursor.moveCursor(cursorId, userCursorInfo[userPk].cursor);
        broadCastedCursor.toggleFlag(cursorId, true);
        modifyQuillCursorStyling(cursorId);
      } else {
        broadCastedCursor.toggleFlag(cursorId, false);
        broadCastedCursor.removeCursor(cursorId);
      }
    }
  }
};

export const getOrientation = (layer) => {
  const currentOrientation =
    layer.payload.style && layer.payload.style.transform
      ? layer.payload.style.transform
      : [];
  var regex = /\d+/g;
  const rotationArray = currentOrientation.filter((current) =>
    current.includes("rotate")
  );
  const rotation =
    rotationArray.length > 0 ? rotationArray[0].match(regex) : "0";
  return parseInt(rotation);
};

export const getArtBoardSwiperInstance = () => {
  return document.querySelector(".artboard-swiper-container").swiper;
};

export const updateArtBoardSwiperToPrevArtboard = () => {
  let artboardSwiper = getArtBoardSwiperInstance();
  artboardSwiper.slideTo(artboardSwiper.activeIndex - 1);
};

const svgURLToString = async (url) => {
  let parser = new DOMParser(); // to convert string -> DOM
  let serializer = new XMLSerializer(); // to convert DOM -> string

  const response = await fetch(url);
  const svg = await response.text();

  if (svg != null) {
    // 4. convert received svg (string) to DOM element
    let parsedSVG = parser.parseFromString(svg, "image/svg+xml");
    // 5. select svg and remove height and width attributes
    parsedSVG.querySelector("svg").removeAttribute("height");
    parsedSVG.querySelector("svg").removeAttribute("width");
    // 6. convert DOM element back to string
    const serializedSVG = serializer.serializeToString(parsedSVG);

    return serializedSVG;
  }
  return null;
};

const svgAsStringPayload = async (url) => {
  return {
    loadType: "svg",
    svg: await svgURLToString(url),
  };
};

const svgAsURLPayload = (url) => {
  return {
    loadType: null,
    svg: url,
  };
};

export const prepareIconPayload = async (data) => {
  const url = data?.images?.svg || data;

  if (!isURL(url)) {
    console.warn(`Invalid URL: ${url}`);
    return;
  }

  const tldrPayload = {
    mime: "shape",
    payload: {
      type: FABRIC_SVG_ELEMENT,
      superType: "svg",
      userProperty: {
        source_id: data.id,
      },
    },
    content: {
      source: SourceTypes.FLATICON,
      source_url: url,
      source_id: data.id,
      meta: {
        tags: data?.tags,
        images: data?.images,
      },
    },
  };

  // const payload = await svgAsStringPayload(url);

  // To load svgAsURL
  const payload = svgAsURLPayload(url);

  let iconPayload = {
    ...tldrPayload,
    payload: {
      ...tldrPayload.payload,
      ...payload,
    },
  };

  return iconPayload;
};

export const getUserMetaData = (source, data) => {
  let user = { source: source };
  if (source === ImageSources.UNSPLASH) {
    user["source_location"] = "https://unsplash.com/";
    user["username"] = data?.user?.username;
    user["profile"] = data?.user?.links?.html;
    user["urls"] = data?.urls;
    user["links"] = data?.links;
  } else if (source === ImageSources.PEXELS) {
    user["source_location"] = "https://pexels.com/";
    user["username"] = data?.photographer;
    user["profile"] = data?.photographer_url;
  } else if (source === ImageSources.PIXABAY) {
    user["source_location"] = "https://pixabay.com/";
    user["user"] = data?.user;
    user["urls"] = data?.userImageURL;
  } else if (source === ImageSources.SHOPIFY) {
    user["source_location"] = "";
    user["user"] = data?.node?.title;
    user["urls"] = "";
  } else if (source === ImageSources.SHUTTERSTOCK) {
    user["source_location"] = "";
    user["user"] = data?.contributor?.id;
    user["urls"] = "";
  }
  return user;
};

export const getMIMETypeFromFabricObject = (objType) => {
  switch (objType) {
    case FABRIC_TEXT_ELEMENT:
    case FABRIC_ITEXT_ELEMENT:
    case FABRIC_TEXTBOX_ELEMENT:
      return "text";
    case FABRIC_SVG_ELEMENT:
      return "shape";
    case FABRIC_IMAGE_ELEMENT:
      return "image";
    case FABRIC_GROUP_ELEMENT:
      return "group";
    case FABRIC_GIF_ELEMENT:
      return "giphy";
    case FABRIC_VIDEO_ELEMENT:
      return "video";
    case FABRIC_RECT_ELEMENT:
    case FABRIC_TRIANGLE_ELEMENT:
    case FABRIC_CIRCLE_ELEMENT:
    case FABRIC_ELLIPSE_ELEMENT:
    case FABRIC_POLYGON_ELEMENT:
      return "shape";
    default:
      return "text";
  }
};

export const getFabricTypeFromMime = (objType) => {
  switch (objType) {
    case "text":
      return "textbox";
    case "image":
      return "image";
    case "video":
      return "video";
    case "shape":
      return "image";
    default:
      return "text";
  }
};

export const getLayerIdFromObjectTypeId = (layers, objectId) => {
  let layerId = null;
  forOwn(layers, (value, key) => {
    if (value.payload.id === objectId) {
      layerId = value.id;
    }
  });
  return layerId;
};

export const getImageInfo = (source, data) => {
  let imageData = {
    sourceData: {
      source: null,
      source_url: null,
      source_id: null,
    },
  };
  switch (source) {
    case ImageSources.UNSPLASH:
      imageData["url"] = data?.urls?.regular || "";
      imageData["imageAspectRatio"] = data?.width / data?.height;
      imageData["thumbURL"] = data?.urls?.thumb;
      imageData["width"] = data?.width;
      imageData["height"] = data?.height;

      imageData["sourceData"]["source"] = SourceTypes.UNSPLASH;
      imageData["sourceData"]["source_url"] = data?.urls?.regular;
      imageData["sourceData"]["source_id"] = data?.id;

      break;
    case ImageSources.PEXELS:
      imageData["url"] = data?.src?.original;
      imageData["imageAspectRatio"] = data.width / data.height;
      imageData["thumbURL"] = data?.src?.medium;
      imageData["width"] = data?.width;
      imageData["height"] = data?.height;

      imageData["sourceData"]["source"] = SourceTypes.PEXELS;
      imageData["sourceData"]["source_url"] = data?.src?.original;
      imageData["sourceData"]["source_id"] = data?.id;
      break;
    case ImageSources.PIXABAY:
      imageData["url"] = data?.largeImageURL;
      imageData["imageAspectRatio"] = data?.imageWidth / data?.imageHeight;
      imageData["thumbURL"] = data?.previewURL;
      imageData["width"] = data?.imageWidth;
      imageData["height"] = data?.imageHeight;

      imageData["sourceData"]["source"] = SourceTypes.PIXABAY;
      imageData["sourceData"]["source_url"] = data?.largeImageURL;
      imageData["sourceData"]["source_id"] = data?.id;
      break;
    case ImageSources.SHOPIFY:
      imageData["url"] = data?.node?.featuredImage?.originalSrc;
      imageData["imageAspectRatio"] = 1.5;
      imageData["thumbURL"] = data?.node?.featuredImage?.originalSrc;
      imageData["width"] = 200;
      imageData["height"] = 200;

      imageData["sourceData"]["source"] = SourceTypes.SHOPIFY;
      imageData["sourceData"]["source_url"] =
        data?.node?.featuredImage?.originalSrc;
      imageData["sourceData"]["source_id"] = data?.node?.id;
      break;
    case ImageSources.GOOGLE_DRIVE:
      imageData["url"] = data?.thumbnailLink;
      imageData["thumbURL"] = data?.thumbnailLink;
      imageData["width"] =
        data?.imageMediaMetadata?.width || data?.imageMediaMetadata?.width > 0
          ? data?.imageMediaMetadata.width
          : 50;
      imageData["height"] =
        data?.imageMediaMetadata?.height || data?.imageMediaMetadata?.height > 0
          ? data?.imageMediaMetadata.height
          : 50;
      imageData["imageAspectRatio"] = imageData?.width / imageData?.height;

      imageData["sourceData"]["source"] = SourceTypes.GOOGLE_DRIVE;
      imageData["sourceData"]["source_url"] = data?.thumbnailLink;
      imageData["sourceData"]["source_id"] = data?.id;
      break;
    case ImageSources.SHUTTERSTOCK:
      imageData["url"] = data?.assets?.preview_1500.url;
      imageData["imageAspectRatio"] =
        data?.assets?.preview_1500.width / data?.assets?.preview_1500.height;
      imageData["app_id"] = ImageAppSources.CUSTOM;
      imageData["identifier"] = data?.assets.huge_thumb.url;

      imageData["imageAspectRatio"] =
        data?.assets?.preview_1500.width / data?.assets?.preview_1500.height;
      imageData["thumbURL"] = data?.huge_thumb?.url;
      imageData["width"] = data?.assets?.preview_1500.width;
      imageData["height"] = data?.assets?.preview_1500.height;

      imageData["sourceData"]["source"] = SourceTypes.SHUTTERSTOCK;
      imageData["sourceData"]["source_url"] = data?.assets?.preview_1500.url;
      imageData["sourceData"]["source_id"] = data?.id;
      break;
    default:
      return;
  }
  return imageData;
};

/**
 *
 * @param {string} imageProvier ImageProviderSource
 * @param {errors} errors Errors Object
 * @returns {Object} {actionText: string, errorsText: Array<str>, actionURL: string}
 */
export const getImageProviderErrorsData = (imageSource, errors) => {
  const errorsData = {
    actionText: errors.action_text || null,
    errorsText:
      errors.non_field_errors ||
      `Something went wrong while fetching data from ${imageSource}`,
    actionURL: MY_APPS,
    iconComponent: null,
  };

  switch (
    imageSource

    // Modify `errorsData` according to the `imageSource`
  ) {
  }
  return errorsData;
};

export const getVideoSrc = (meta) => {
  let src = "";
  if (typeof meta.url === "undefined") {
    src = meta.videos.medium.url;
  } else {
    src = meta.video_files[0].link;
  }
  return src;
};

export const getSourceCreditInfoData = (source, props, meta) => {
  let sourceCreditInfo = { sourceSiteName: source };

  if (source === ImageSources.PEXELS && props.data.mime === "video") {
    sourceCreditInfo["authorName"] = meta.user?.name;
    sourceCreditInfo["authorLink"] = meta.user?.url;
    sourceCreditInfo["sourceSiteLink"] = "https://pexels.com/";
  } else if (
    source === ImageSources.UNSPLASH ||
    source === ImageSources.PEXELS
  ) {
    sourceCreditInfo["authorName"] = meta?.username;
    sourceCreditInfo["authorLink"] =
      meta.profile + "?utm_source=Simplified&utm_medium=referral";
    sourceCreditInfo["sourceSiteLink"] =
      meta.source_location + "?utm_source=Simplified&utm_medium=referral";
  } else if (source === "Giphy") {
    sourceCreditInfo["authorName"] = meta.user ? meta.user?.display_name : "";
    sourceCreditInfo["authorLink"] = meta.user ? meta.user?.profile_url : "";
    sourceCreditInfo["sourceSiteLink"] = "https://giphy.com/";
  } else if (source === ImageSources.PIXABAY) {
    sourceCreditInfo["authorName"] = meta?.user;
    sourceCreditInfo["authorLink"] = meta?.pageURL;
    sourceCreditInfo["sourceSiteLink"] = "https://pixabay.com/";
  } else if (source === "Flaticon") {
    sourceCreditInfo["sourceSiteLink"] = "https://flaticon.com/";
  } else if (source === "Shopify") {
    sourceCreditInfo["authorName"] = meta?.user;
  } else if (source === "Shutterstock" && meta?.media_type === "video") {
    sourceCreditInfo["authorName"] = meta.contributor?.id;
    sourceCreditInfo["sourceSiteLink"] = "https://www.shutterstock.com/";
  } else if (source === "Shutterstock") {
    sourceCreditInfo["authorName"] = meta?.user;
    sourceCreditInfo["sourceSiteLink"] = "https://www.shutterstock.com/";
  }

  return sourceCreditInfo;
};

export const getVideoDetails = (source, video) => {
  let videoInfo = {
    sourceData: {
      source: null,
      source_id: null,
      source_url: null,
    },
  };

  if (source === VideoSources.PIXABAY) {
    videoInfo["height"] = video?.videos?.medium?.height;
    videoInfo["width"] = video?.videos?.medium?.width;
    videoInfo["videoCoverUrl"] = format(
      PIXABAY_VIDEO_COVER_ENDPOINT,
      video.picture_id,
      "200x150"
    );
    videoInfo["url"] = video?.videos?.medium?.url;
    videoInfo["duration"] = video?.duration;

    videoInfo["sourceData"]["source"] = SourceTypes.PIXABAY;
    videoInfo["sourceData"]["source_id"] = video?.picture_id;
    videoInfo["sourceData"]["source_url"] = video?.videos?.medium?.url;
  } else if (source === VideoSources.PEXELS) {
    videoInfo["height"] = video?.video_files[0].height;
    videoInfo["width"] = video?.video_files[0].width;
    videoInfo["videoCoverUrl"] = video?.image.replace(
      "w=1200&h=630",
      "w=200&h=150"
    );
    videoInfo["url"] = video?.video_files[0].link;
    videoInfo["duration"] = video?.duration;

    videoInfo["sourceData"]["source"] = SourceTypes.PEXELS;
    videoInfo["sourceData"]["source_id"] = video?.id;
    videoInfo["sourceData"]["source_url"] = video?.video_files[0].link;
  } else if (source === VideoSources.SHUTTERSTOCK) {
    videoInfo["height"] = 336;
    videoInfo["width"] = 596;
    videoInfo["videoCoverUrl"] = video?.assets?.thumb_jpg.url;
    videoInfo["url"] = video?.assets?.preview_mp4.url;
    videoInfo["duration"] = video?.duration;

    videoInfo["sourceData"]["source"] = SourceTypes.SHUTTERSTOCK;
    videoInfo["sourceData"]["source_id"] = video?.id;
    videoInfo["sourceData"]["source_url"] = video?.video_files[0].link;
  } else if (source === VideoSources.STORYBLOCKS) {
    videoInfo["height"] = 720;
    videoInfo["width"] = 1280;
    videoInfo["videoCoverUrl"] = video?.thumbnail_url;
    videoInfo["url"] = video?.preview_urls?._720p;
    videoInfo["duration"] = video?.duration;

    videoInfo["sourceData"]["source"] = SourceTypes.STORYBLOCKS_VIDEO;
    videoInfo["sourceData"]["source_id"] = video?.id;
    videoInfo["sourceData"]["source_url"] = video?.preview_urls?._720p;
  }

  return videoInfo;
};

export const onClickSetAsBackground = (canvasRef, imageUrl) => {
  let activeObj;
  let imageURL;
  let filters = [];
  if (imageUrl) {
    imageURL = imageUrl;
    filters = canvasRef.handler.workarea.filters;
  } else {
    activeObj = canvasRef.handler.canvas.getActiveObject();
    if (!activeObj || activeObj.type !== "image" || activeObj.src === null) {
      return;
    }
    filters = activeObj.filters;
    imageURL = activeObj.src;
  }

  let objectPayload = null;
  if (activeObj) {
    objectPayload = activeObj;
    canvasRef.handler.remove(activeObj, true);
  } else {
    objectPayload = {
      src: imageURL,
      filters: filters,
    };
  }

  canvasRef.handler.workareaHandler
    .setImagePattern(objectPayload)
    .then((workarea) => {
      canvasRef.handler.canvas.fire("object:modified", {
        target: workarea,
      });
    });

  // to close the context menu
  if (canvasRef.handler.contextmenuHandler) {
    canvasRef.handler.contextmenuHandler.hide();
  }
};

export const alignObject = (action, canvasRef) => {
  switch (action) {
    case "top":
      canvasRef.handler.objectHandler.alignTop();
      break;
    case "middle":
      canvasRef.handler.objectHandler.alignMiddle();
      break;
    case "bottom":
      canvasRef.handler.objectHandler.alignBottom();
      break;
    case "left":
      canvasRef.handler.objectHandler.alignLeft();
      break;
    case "center":
      canvasRef.handler.objectHandler.alignCenter();
      break;
    case "right":
      canvasRef.handler.objectHandler.alignRight();
      break;
    default:
      return;
  }

  // to close the context menu
  if (canvasRef.handler.contextmenuHandler) {
    canvasRef.handler.contextmenuHandler.hide();
  }
};

export const rgbaTohex = (color) => {
  if (!color || typeof color === "object") return "0000";

  var a;
  var rgb = color
    .replace(/\s/g, "")
    .match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i);
  var alpha = ((rgb && rgb[4]) || "").trim();
  var hex = rgb
    ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
      (rgb[2] | (1 << 8)).toString(16).slice(1) +
      (rgb[3] | (1 << 8)).toString(16).slice(1)
    : color;

  if (alpha !== "") {
    a = alpha;
  } else {
    a = parseInt("01", 8);
  }
  // multiply before convert to HEX
  a = ((a * 255) | (1 << 8)).toString(16).slice(1);
  // hex = hex + a;

  if (color === "" || a === "00") return "0000";

  return hex;
};

export const triggerDownload = (url, name, type) => {
  if (url) {
    const anchorEl = document.createElement("a");
    anchorEl.href = url;
    anchorEl.download = `${name}.${type}`;
    document.body.appendChild(anchorEl); // required for firefox
    anchorEl.click();
    anchorEl.remove();
  }
};
export const getFontVariants = (fonts, font) => {
  let fontInfo = find(fonts, ["family", font]);
  if (fontInfo && fontInfo.payload && fontInfo.payload.variants) {
    return fontInfo.payload.variants;
  } else {
    return [];
  }
};

export const calculateIconColors = (element) => {
  const { format } = element;
  let colors = [];

  if (!format || format.type !== FABRIC_SVG_ELEMENT) return 0;

  if (format.objects) {
    format.objects.forEach((color) => {
      if (typeof color.fill !== "object") colors.push(color.fill);
      else colors.push("rgba(0, 0, 0, 0)");
    });
  } else if (format._objects) {
    format._objects.forEach((color) => {
      if (typeof color.fill !== "object") colors.push(color.fill);
    });
  }
  colors = [...new Set(colors)];
  return colors.length;
};

export const checkInputboxValueRangeForSlider = (number, range) => {
  if (!number || !range) return;

  return inRange(number, range[0], range[1] + 1);
};

export const formatDuration = (seconds) => {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
};

export const formatSelectedDuration = (seconds) => {
  seconds = Number(seconds.toFixed(1));

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds();
  if (hh) {
    return `${hh}:${pad(mm)}:${ss} hrs`;
  }
  if (mm) {
    return `${mm}:${pad(ss)} mins`;
  }
  return `${ss} secs`;
};

const pad = (string) => {
  return ("0" + string).slice(-2);
};

export const getPayloadFromShopify = (object) => {
  return {
    page: "",
    layers: [
      {
        name: "productName",
        properties: {
          text: object.node.title,
        },
      },
      {
        name: "productPrice",
        properties: {
          text:
            object.node.priceRangeV2.maxVariantPrice.currencyCode +
            object.node.priceRangeV2.maxVariantPrice.amount,
        },
      },
      {
        name: "featuredImage",
        properties: {
          src: object.node.featuredImage.originalSrc,
        },
      },
    ],
  };
};
export const angleToRect = (angle, sx, sy) => {
  while (angle < 0) {
    angle += 360;
  }
  angle %= 360;

  var a = sy,
    b = a + sx,
    c = b + sy,
    p = (sx + sy) * 2,
    rp = p * 0.00277,
    pp = Math.round((angle * rp + (sy >> 1)) % p);

  if (pp <= a) {
    return {
      x: 0,
      y: sy - pp,
    };
  } else if (pp <= b) {
    return {
      y: 0,
      x: pp - a,
    };
  } else if (pp <= c) {
    return {
      x: sx,
      y: pp - b,
    };
  } else {
    return {
      y: sy,
      x: sx - (pp - c),
    };
  }
};

export const adjustColorOffsets = (colorsData) => {
  var newData = [];
  colorsData.forEach((color) => {
    newData.push({
      ...color,
      offset: color.offset > 1 ? color.offset / 100 : color.offset,
    });
  });

  return newData;
};

export const getArtBoardSizeToFitAvailableArea = (
  artboardSize,
  availableAreaSize
) => {
  const { width: previewAreaWidth, height: previewAreaHeight } =
    availableAreaSize;

  const { width: maxWidth, height: maxHeight } = artboardSize;

  const artBoardAspectRatio = maxWidth / maxHeight;
  const availableAreaAspectRatio = previewAreaWidth / previewAreaHeight;

  let artBoardHeight,
    artBoardWidth,
    artBoardWidthPercentage,
    artBoardHeightPercentage;

  if (artBoardAspectRatio > availableAreaAspectRatio) {
    artBoardWidthPercentage = 90;

    // px
    artBoardWidth = previewAreaWidth * (artBoardWidthPercentage / 100);
    artBoardHeight = artBoardWidth / artBoardAspectRatio;

    // %
    artBoardHeightPercentage = (100 * artBoardHeight) / previewAreaHeight;
  } else {
    artBoardHeightPercentage = 90; // % of canvas area occupied by artboard height

    // px
    artBoardHeight = previewAreaHeight * (artBoardHeightPercentage / 100);
    artBoardWidth = artBoardAspectRatio * artBoardHeight;

    // %
    artBoardWidthPercentage = (100 * artBoardWidth) / previewAreaWidth;
  }

  return {
    heightPercentage: artBoardHeightPercentage,
    widthPercentage: artBoardWidthPercentage,
    height: artBoardHeight,
    width: artBoardWidth,
  };
};

export const isURL = (url) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};

/**
 *
 * @param {String} taskId celery task id
 * @param {Function} onAddTimer(timerId) | Called with timer id
 * @returns {Promise}
 */
export const checkCeleryTaskStatus = (taskId, onAddTimer) => {
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      axios
        .get(Format(CHECK_TASK_STATAUS, taskId))
        .then((res) => {
          if (res.data?.status === "SUCCESS") {
            clearInterval(timer);
            resolve({ taskId: taskId, response: res.data });
          } else if (res.data?.status === "FAILURE") {
            clearInterval(timer);
            reject();
          }
        })
        .catch((error) => {
          clearInterval(timer);
          reject(error);
        });
    }, 5000);
    onAddTimer(timer);
  });
};

/**
 *
 * @param {Object} item
 * @param {AbortHandler.singal.token} cancelToken asds
 * @param {function} onAddTimer(timer)
 * @param {props} parent component props
 * @returns {Promise} Promise returns updated item data
 */
export const genericImageDownload = async (
  item,
  cancelToken,
  onAddTimer,
  props = {}
) => {
  const { editor: { activePage: { id: activePageId } = {} } = {} } = props;

  const payload = {
    app_id: item.payload.app_id,
    identifier: item.payload.identifier,
    extra_data: { ...item, page: activePageId },
  };
  if (props.showToast) {
    props.showToast({
      message: "Please wait while image is being processed",
      heading: "Processing image",
      type: "success",
    });
  }
  return axios
    .post(GENERIC_IMAGE_DOWNLOAD, payload, {
      cancelToken,
    })
    .then((res) => {
      return checkCeleryTaskStatus(res.data?.task_id, onAddTimer);
    })
    .then((taskResponse) => {
      const contentUrl = taskResponse?.response?.info?.url;
      item.content.url = contentUrl;
      item.payload.src = contentUrl;
      item.payload.width = taskResponse?.response?.info?.width;
      item.payload.height = taskResponse?.response?.info?.height;

      if (props.showToast) {
        props.showToast({
          message: "Adding image to artboard",
          heading: "Adding image",
          type: "success",
        });
      }
      return Promise.resolve(item);
    });
};

export const bootIntercom = () => {
  if (!!window.Intercom && window.Intercom.booted) {
    window.Intercom("update", {
      app_id: process.env.REACT_APP_INTERCOM_APP_ID,
      email: JSON.parse(localStorage.getItem("User"))?.email,
      user_id: JSON.parse(localStorage.getItem("User"))?.username,
    });
  }
};

export const analytics = Analytics({
  app: "Simplified",
  plugins: [
    googleTagManager({
      containerId: process.env.REACT_APP_GOOGLETAGMANAGER_CONTAINERID,
    }),
  ],
});

export const analyticsTrackEvent = (eventName, eventData) => {
  if (process.env.REACT_APP_ENV === "production") {
    //analytics.page();
    let userData = JSON.parse(localStorage.getItem("User"));
    if (userData) {
      analytics.track("tldr." + eventName, {
        eventData: eventData,
        userId: userData?.pk,
        email: userData?.email,
        username: userData?.username,
      });
    } else {
      analytics.track("tldr." + eventName, eventData);
    }
  }
};

export const saveDataURLToFile = (dataURL, option) => {
  if (dataURL) {
    const anchorEl = document.createElement("a");
    anchorEl.href = dataURL;
    anchorEl.download = `${option.name}.${option.format}`;
    document.body.appendChild(anchorEl); // required for firefox
    anchorEl.click();
    anchorEl.remove();
  } else {
    console.error(
      "There is an error while exporting artboard as image. Contact to support center."
    );
  }
};

export const endsWithAny = (suffixes, string) => {
  for (const suffix of suffixes) {
    if (string.endsWith(suffix)) {
      return true;
    }
  }
  return false;
};

export const formatSize = (props, storySize) => {
  let format = ``;
  const activePageId = props?.editor?.activePage?.id;
  const activePagePayload = props?.pagestore?.pages[activePageId]?.payload;
  if (activePageId && !isEmpty(activePagePayload)) {
    format = `&format_size=${activePagePayload.width}x${activePagePayload.height}`;
  } else if (!isEmpty(storySize)) {
    format = `&format_size=${storySize.width}x${storySize.height}`;
  }
  return format;
};

export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const checkFeatureAvailability = (props, featureCode) => {
  const { subscription } = props;
  const { subscribedPlan, availableFeatures } = subscription;

  if (
    subscribedPlan?.trial_remaining_days >= 0 &&
    availableFeatures === undefined
  ) {
    return true;
  } else if (availableFeatures) {
    const featureCodeIndex = availableFeatures.findIndex(
      (feature) => feature.feature_code === featureCode
    );

    if (featureCodeIndex > -1) {
      return true;
    } else {
      return false;
    }
  }
};

export const updateAnimationTimings = function (
  enterAnimation,
  still,
  totalDuration,
  startTime
) {
  enterAnimation.start_time = startTime;
  enterAnimation.end_time = startTime + enterAnimation.trans_duration;

  still.start_time = enterAnimation.end_time;
  still.trans_duration = totalDuration - enterAnimation.trans_duration;
  still.end_time = still.start_time + still.trans_duration;

  return [enterAnimation, still];
};

export const updateLayerAnimation = (
  totalDuration,
  currentLayerAnimations,
  adjustment
) => {
  let startTime = 0,
    endTime = totalDuration;
  if (currentLayerAnimations && currentLayerAnimations.length === 2) {
    startTime = currentLayerAnimations[0].start_time;
    endTime = currentLayerAnimations[1].end_time;
    totalDuration = endTime - startTime;
  } else if (currentLayerAnimations && currentLayerAnimations.length === 1) {
    startTime = currentLayerAnimations[0].start_time;
    endTime = currentLayerAnimations[0].end_time;
    totalDuration = endTime - startTime;
  }

  let updatedAnimations = [];

  if (adjustment.id === "none") {
    const still = STILL_ANIMATION.variants[0].enter;
    still.start_time = startTime;
    still.end_time = endTime;
    still.trans_duration = totalDuration;
    updatedAnimations = [still];
  } else {
    const enterAnimation = adjustment.variants[0].enter;
    const still = STILL_ANIMATION.variants[0].enter;

    switch (currentLayerAnimations ? currentLayerAnimations.length : 2) {
      case 3:
      case 2:
      case 1:
        updatedAnimations = updateAnimationTimings(
          enterAnimation,
          still,
          totalDuration,
          startTime
        );
        break;
      default:
    }
  }

  return updatedAnimations;
};

export const encodeWithDash = (input) => {
  if (!input) {
    return "";
  }
  return input.replace(/\s+/g, "-").toLowerCase();
};

export const getMusicPayload = (source, payload) => {
  let musicPayload = { ...defaultMusicPayload };

  switch (source) {
    case MusicSources.STORYBLOCKS:
      musicPayload.title = payload?.title;
      musicPayload.src = payload?.preview_url;
      musicPayload.duration = payload?.duration;
      musicPayload.bpm = payload?.bpm;
      musicPayload.source = SourceTypes.STORYBLOCKS_AUDIO;
      musicPayload.source_id = payload?.id;
      musicPayload.source_url = payload?.preview_url;
      musicPayload.meta = {
        thumbnail: payload?.thumbnail_url,
        preview_url: payload?.preview_url,
      };
      break;
    default:
      musicPayload.title = "New Music";
      musicPayload.src = payload?.payload?.src;
      musicPayload.duration = payload?.content?.meta?.payload?.duration;
      musicPayload.bpm = null;

      break;
  }
  return musicPayload;
};

export const audioMimeTypes = ["audio/mpeg", "audio/vnd.wav"];

export const getAudioDurationFromFile = (source) => {
  return new Promise((resolve, reject) => {
    let src = null;
    if (isURL(source)) {
      src = source;
    } else if (!audioMimeTypes.includes(source.type)) {
      resolve(0);
    } else {
      src = URL.createObjectURL(source);
    }
    if (src) {
      let audio = new Audio();
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };
      audio.onerror = reject;
      audio.src = src;
    }
  });
};

export const invertColor = (rgba) => {
  let sep = rgba.indexOf(",") > -1 ? "," : " ";
  rgba = rgba.substr(5).split(")")[0].split(sep);

  // Strip the slash if using space-separated syntax
  if (rgba.indexOf("/") > -1) rgba.splice(3, 1);
  for (let R in rgba) {
    let r = rgba[R];
    if (r.indexOf("%") > -1) {
      let p = r.substr(0, r.length - 1) / 100;

      if (R < 3) {
        rgba[R] = Math.round(p * 255);
      } else {
        rgba[R] = p;
      }
    }
  }

  let invertedColor = invert.asRgbArray(rgba);
  return Format(
    "rgba({0}, {1}, {2}, {3})",
    invertedColor[0],
    invertedColor[1],
    invertedColor[2],
    invertedColor[3]
  );
};

export const showCreatePresetFloatingButton = (path) => {
  return (
    path === ROOT ||
    path === QUICK_START ||
    path === PROJECTS ||
    path === TEMPLATES_SCREEN
  );
};

export const showBottomMenuBar = (path) => {
  return (
    path === ROOT ||
    path === QUICK_START ||
    path === PROJECTS ||
    path === TEMPLATES_SCREEN ||
    path === LAYOUTS ||
    path === MAGICAL
  );
};

export const isMobileView = () => {
  if (window.innerWidth < 768) {
    return true;
  } else {
    return false;
  }
};

export const isWhiteColor = (color) => {
  return (
    color === "rgba(255,255,255,1)" ||
    color === "white" ||
    color === "#FFFFFF" ||
    color === "#FFF"
  );
};
