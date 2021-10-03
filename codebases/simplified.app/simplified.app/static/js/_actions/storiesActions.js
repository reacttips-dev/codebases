import axios from "axios";
import axiosRetry from "axios-retry";

import {
  FETCH_STORIES,
  FETCH_STORY_PAGES,
  FETCH_TEMPLATES,
  FETCH_CATEGORIES,
  STORIES_DETAIL,
  STORIES,
  CLONE_STORIES_DETAIL,
  GET_S3_SIGNED_URL_ENDPOINT,
  ASSETS_ENDPOINT,
  CLONE_TEMPLATE,
  GROUP_BY_TEMPLATES,
  SEARCH_BY_TEMPLATE_TYPE,
  CREATE_COMPONENT,
  CLONE_LAYERS_ENDPOINT,
  STORY_TO_TEMPLATE,
  FONTS_ENDPOINT,
  FILTER_TEMPLATES_BY_CATEGORY_ENDPOINT,
} from "./endpoints";
import {
  GET_STORIES,
  GET_STORY_PAGES,
  GET_TEMPLATES,
  RESET_STORIES,
  GET_CATEGORIES,
  GET_STORY,
  SET_COUNTER,
  GET_TEMPLATES_VIEW_ALL,
  DELETE_STORY,
  REMOVE_FOLDER_ITEM,
  RESET_TEMPLATES_VIEW_ALL,
  UPDATE_STORY_MUSIC,
  RECENT_STORIES,
  DELETED_RECENT_STORY,
} from "./types";

import { STORY_DETAIL, PROJECTS } from "../_utils/routes";
import * as errorHandlerActions from "./errorHandlerActions";
import { redirect } from "./commonAction";
import {
  getHeightAndWidth,
  dataURItoBlob,
  getAlignPosition,
  getRootElementIdOfGroup,
  convertCanvasObjectToDataURL,
  getImagePayload,
  analyticsTrackEvent,
  getAudioDurationFromFile,
} from "../_utils/common";
import { wsStatusMessage } from "../_middleware/middleware";
import { batch } from "react-redux";
import { wsLayerActionStarted } from "./webSocketAction";

import {
  ASSETS_SLIDER_PANEL,
  CATEGORY_TEMPLATE,
} from "../_components/details/constants";
import Format from "string-format";
import { fontGetAdded } from "./appActions";
import { showToast } from "./toastActions";
import { checkAssetStatus } from "./assetAction";
import { fetchBrandKits } from "./brandKitActions";
import { updateStoryMusicPlayback } from "./motionActions";

const format = require("string-format");

axiosRetry(axios, { retries: 3 });
export const createStory = (payload, signalToken, props) => (dispatch) => {
  axios
    .post(STORIES, payload, {
      cancelToken: signalToken,
    })
    .then((res) => {
      dispatch(
        redirect(
          format(
            STORY_DETAIL,
            res.data.organization,
            res.data.id,
            encodeURIComponent(res.data.title)
          ),
          props
        )
      );
    })
    .catch((error) =>
      dispatch(errorHandlerActions.handleHTTPError(error, props))
    );
};

export const deleteStory =
  (id, signalToken, props, shouldUpdateFolders = false) =>
  (dispatch) => {
    let data = { cancelToken: signalToken.token };
    return axios
      .delete(format(STORIES_DETAIL, id), data)
      .then((res) => {
        if (shouldUpdateFolders && props.selectedFolder) {
          dispatch({
            type: REMOVE_FOLDER_ITEM,
            payload: { folderId: props.selectedFolder.id, contentId: id },
          });
        } else if (props?.isRecent) {
          dispatch({
            type: DELETED_RECENT_STORY,
            payload: id,
          });
        } else {
          dispatch({
            type: DELETE_STORY,
            payload: id,
          });
        }
      })
      .catch((error) => {
        console.error(error.message);
        dispatch(errorHandlerActions.handleHTTPError(error, props));
      });
  };

export const cloneStory = (id, signalToken, props) => (dispatch) => {
  axios
    .post(
      format(CLONE_STORIES_DETAIL, id),
      {
        target: localStorage.getItem("SelectedOrgID"),
      },
      {
        cancelToken: signalToken.token,
      }
    )
    .then((res) => {
      //We are doing this to support
      axios.defaults.headers.common["Organization"] = parseInt(
        localStorage.getItem("SelectedOrgID")
      );
      analyticsTrackEvent("cloneDesign");
      dispatch(
        redirect(
          format(
            STORY_DETAIL,
            res.data.organization,
            res.data.id,
            encodeURIComponent(res.data.title)
          ),
          props
        )
      );
    })
    .catch((error) =>
      dispatch(errorHandlerActions.handleHTTPError(error, props))
    );
};

export const fetchStories =
  (status, searchPhrase, pageNo, props) => (dispatch) => {
    let endpoint = FETCH_STORIES;
    if (searchPhrase) {
      endpoint += `?search=title:${searchPhrase}`;
    } else {
      endpoint += `?page=${pageNo}`;
    }

    if (status) {
      endpoint += `&status=${status}`;
    }

    axios
      .get(endpoint)
      .then((res) => {
        if (props.isRecent) {
          dispatch({
            type: RECENT_STORIES,
            payload: res.data,
          });
        } else {
          dispatch({
            type: GET_STORIES,
            payload: res.data,
            loadMore: res.data.next !== null ? true : false,
          });
        }
      })
      .catch((error) => {
        dispatch(errorHandlerActions.handleHTTPError(error, props));
      });
  };

export const fetchStoryDetail =
  (id, signalToken, props) => async (dispatch) => {
    return axios
      .get(format(STORIES_DETAIL, id), {
        cancelToken: signalToken.token,
      })
      .then((res) => {
        dispatch({
          type: GET_STORY,
          payload: res.data,
        });
        return res.data;
      })
      .catch((error) =>
        dispatch(errorHandlerActions.handleHTTPError(error, props))
      );
  };

export const updateStory = (id, payload, signalToken, props) => (dispatch) => {
  axios
    .patch(format(STORIES_DETAIL, id), payload, {
      cancelToken: signalToken.token,
    })
    .then((res) => {
      dispatch({
        type: GET_STORY,
        payload: res.data,
      });
    })
    .catch((error) =>
      dispatch(errorHandlerActions.handleHTTPError(error, props))
    );
};

export const setCounter = (counter) => {
  return {
    type: SET_COUNTER,
    payload: counter,
  };
};

export const uploadFontFile =
  (orgId, file, metaInfo, brandKitId) => (dispatch) => {
    return new Promise((resolve, reject) => {
      axios
        .post(GET_S3_SIGNED_URL_ENDPOINT, {
          filename: file.name,
          filetype: file.type,
          action: "assets",
        })
        .then((response) => {
          return uploadToS3(response, file);
        })
        .then((response) => {
          const { variant, ...otherMeta } = metaInfo;

          let requestData = {
            family: otherMeta.family,
            source: "custom",
            brandkit: brandKitId,
            payload: {
              ...otherMeta,
              variants: [variant],
              files: {
                [variant]: response.data?.asset,
              },
            },
            organization: orgId,
          };
          return axios.post(FONTS_ENDPOINT, requestData);
        })
        .then((response) => {
          dispatch(fontGetAdded(response.data));
          resolve(response.data);
        });
    });
  };

export const uploadImageAndAddLayer =
  (file, props, signalToken) => (dispatch) => {
    dispatch(wsStatusMessage({ message: "Uploading.." }));
    dispatch(wsLayerActionStarted());
    props.showToast({
      message: "Please wait, while we upload the asset.",
      heading: "Uploading asset",
      type: "info",
    });
    props.openSlider(ASSETS_SLIDER_PANEL);
    let objectSize = {};
    getHeightAndWidth(file)
      .then((size) => {
        objectSize = size;
        return axios.post(
          GET_S3_SIGNED_URL_ENDPOINT,
          {
            filename: file.name,
            filetype: file.type,
            action: "assets",
          },
          {
            cancelToken: signalToken.token,
          }
        );
      })
      .then((response) => {
        return uploadToS3(response, file);
      })
      .then((response) => {
        const request = response.data;
        request["thumbnail"] = response.data.asset;
        request["thumbnail_height"] = objectSize.height;
        request["thumbnail_width"] = objectSize.width;
        return axios.post(ASSETS_ENDPOINT, request);
      })
      .then((response) => {
        batch(() => {
          const url = response.data.thumbnail;
          const imagePayload = getImagePayload(url, objectSize);
          props.wsAddLayer(props.activePage.id, imagePayload);

          props.checkAssetStatus(response.data.id, props, signalToken);
          props.showToast({
            message: "Asset uploaded successfully. Processing now.",
            heading: "Now Processing",
            type: "success",
          });
        });
      })
      .catch((error) =>
        dispatch(errorHandlerActions.handleHTTPError(error, props))
      );
  };

export const takeSnapshopAndCreateTemplate = (name, props, signal) => {
  const { canvasRef } = props;
  const { mime, id } =
    "props" in props
      ? props.props.editor.activeElement
      : props.editor.activeElement;

  let target = canvasRef.handler.canvas.getActiveObject();

  const request = {
    id: id,
    title: name ? name : mime,
    image_height: target ? parseInt(target.height) : 0,
    image_width: target ? parseInt(target.width) : 0,
  };

  let fileType = "png";
  let fileName = format("{0}.{1}", name, fileType);
  return new Promise(function (resolve, reject) {
    convertCanvasObjectToDataURL(canvasRef)
      .then((dataURI) => {
        let file = new File([dataURItoBlob(dataURI)], fileName, {
          type: "image/png",
        });
        return file;
      })
      .then((file) => {
        if ("props" in props) {
          props.props.wsStatusMessage({
            message: "Creating your component...",
          });
        } else {
          props.wsStatusMessage({ message: "Creating your component..." });
        }
        return saveAsComponent(mime, file, request, signal);
      })
      .then((sucess) => {
        if ("props" in props) {
          props.props.wsStatusMessage({
            message: "Component created successfully.",
          });
        } else {
          props.wsStatusMessage({ message: "Component created successfully." });
        }
        resolve();
      })
      .catch((err) => {
        if ("props" in props) {
          props.props.wsStatusMessage({ message: "Failed, please try again." });
        } else {
          props.wsStatusMessage({ message: "Failed, please try again." });
        }
        reject(err);
      });
  });
};

export const saveAsComponent = (mime, file, request, signalToken) => {
  return new Promise(function (resolve, reject) {
    axios
      .post(
        GET_S3_SIGNED_URL_ENDPOINT,
        {
          filename: file.name,
          filetype: file.type,
          action: mime,
        },
        {
          cancelToken: signalToken.token,
        }
      )
      .then((response) => {
        return uploadToS3(response, file);
      })
      .then((response) => {
        request["image"] = response.data.asset;
        return axios.post(format(CREATE_COMPONENT, request["id"]), request);
      })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => reject(error));
  });
};

export const uploadFile = (file, props, signalToken) => async (dispatch) => {
  // let objectSize = {};
  let payload = { duration: 0 };
  dispatch(
    showToast({
      message: "Please wait, while we upload the asset.",
      heading: "Uploading asset",
      type: "info",
    })
  );

  if (typeof props.openSlider === "function") {
    // safe to use the function
    props.openSlider(ASSETS_SLIDER_PANEL);
  }
  try {
    const duration = await getAudioDurationFromFile(file); // For audio files get duration else 0
    const objectSize = await getHeightAndWidth(file);
    // Get the signed URL
    const signedResponse = await axios.post(
      GET_S3_SIGNED_URL_ENDPOINT,
      {
        filename: file.name,
        filetype: file.type,
        action: "assets",
      },
      {
        cancelToken: signalToken.token,
      }
    );
    const uploadS3Response = await uploadToS3(signedResponse, file);

    const request = uploadS3Response.data;
    request["brandkit"] = props.brandKitId;
    request["thumbnail"] = uploadS3Response.data.asset;
    request["thumbnail_height"] = objectSize.height;
    request["thumbnail_width"] = objectSize.width;
    request["payload"] = { duration: duration };

    const assetCreateResponse = await axios.post(ASSETS_ENDPOINT, request);

    // On successful upload of asset creation
    dispatch(
      showToast({
        message: "Asset uploaded successfully. Processing now.",
        heading: "Now Processing",
        type: "success",
      })
    );
    dispatch(checkAssetStatus(assetCreateResponse.data.id, props, signalToken));
    dispatch(fetchBrandKits());
    analyticsTrackEvent("uploadedAssets");
  } catch (error) {
    dispatch(errorHandlerActions.handleHTTPError(error, props));
  }
};

const uploadToS3 = async (request, file) => {
  const requestOptions = {
    method: "PUT",
    // headers: {
    //   //"Access-Control-Allow-Origin": "*",
    //   //"Access-Control-Allow-Headers":
    //   // "Origin, X-Requested-With, Content-Type, Accept",
    //   "Content-type": "image/jpeg",
    // },
    body: file,
  };
  let response = await fetch(request.data.signed, requestOptions);
  if (response.ok) {
    return request;
  } else {
    return Promise.reject(response);
  }
};

export const captureAndUpdateCover =
  (storyId, payload, saveAsTemplate, signalToken, props, templateName) =>
  (dispatch) => {
    batch(() => {
      dispatch(wsStatusMessage({ message: "Saving, please wait..." }));
    });
    /* props.showToast({
      message: "Saving project as template ...",
      heading: "Info",
      type: "info",
    }); */
    axios
      .post(
        GET_S3_SIGNED_URL_ENDPOINT,
        {
          filename: payload.name,
          filetype: payload.type,
          action: "snaps",
        },
        {
          cancelToken: signalToken.token,
        }
      )
      .then((response) => {
        return uploadToS3(response, payload);
      })
      .then((response) => {
        const request = {
          image: response.data.asset,
        };
        return axios.patch(format(STORIES_DETAIL, storyId), request);
      })
      .then(async () => {
        if (saveAsTemplate) {
          try {
            await axios.post(format(STORY_TO_TEMPLATE, storyId), {
              title: templateName,
            });
            batch(() => {
              props.showToast({
                message: "Saved project as template successfully!",
                heading: "Success",
                type: "success",
              });
              dispatch(wsStatusMessage({ message: "Saved successfully." }));
            });
            analyticsTrackEvent("savedAsTemplate");
          } catch (e) {
            batch(() => {
              props.showToast({
                message: "Failed to save project as template",
                heading: "Error",
                type: "error",
              });
              dispatch(wsStatusMessage({ message: "Failed to save" }));
            });
          }
        } else {
          props.backToDashboard();
          dispatch(redirect(PROJECTS, props));
        }
      })
      .catch((error) => {
        dispatch(errorHandlerActions.handleHTTPError(error, props));
      });
  };

export const fetchStoryPages = (storyId, pageId, props) => async (dispatch) => {
  try {
    let endpoint = format(FETCH_STORY_PAGES, storyId);
    if (pageId) {
      endpoint += `/${pageId}`;
    }
    const res = await axios.get(endpoint);
    dispatch({
      type: GET_STORY_PAGES,
      payload: res?.data?.results ? res.data : { results: [res.data] },
    });
  } catch (error) {
    return dispatch(errorHandlerActions.handleHTTPError(error, props));
  }
};

export const resetStories = () => {
  return {
    type: RESET_STORIES,
  };
};

export const fetchTemplates =
  (template, category, props, signalToken) => (dispatch) => {
    axios
      .get(format(FETCH_TEMPLATES, template, "", category), {
        cancelToken: signalToken,
      })
      .then((res) => {
        dispatch({
          type: GET_TEMPLATES,
          payload: res.data,
        });
      })
      .catch((error) => {
        dispatch(errorHandlerActions.handleHTTPError(error, props));
      });
  };

export const fetchTemplatesByGroup =
  (searchTerm, props, signalToken, tags = undefined) =>
  async (dispatch) => {
    let endpoint = GROUP_BY_TEMPLATES;
    if (searchTerm?.length > 0) {
      let searchText = searchTerm.toLowerCase();
      endpoint += `?tags__wildcard=*${searchText}*`;
    } else {
      endpoint += "/groups?group_by=format_title";
    }
    if (tags && tags.length > 0) {
      endpoint = endpoint + "&tags__in=" + tags.join("__");
    }

    endpoint += `&page=${props.stories.templatesPage || 1}&template=template`;

    try {
      const res = await axios.get(endpoint, {
        cancelToken: signalToken,
      });
      dispatch({
        type: GET_TEMPLATES,
        payload: res.data.results,
        loadMore: res.data.next !== null,
        groupKey: props.groupKey || 0,
      });
      return res.data.results;
    } catch (error) {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    }
  };

export const fetchViewAllTemplatesByGroup =
  (searchTerm, formatId, categoryId, pageIndex, props, signalToken) =>
  (dispatch) => {
    let endpoint = `${SEARCH_BY_TEMPLATE_TYPE}?template=template&format_title=${formatId}&page=${pageIndex}`;

    if (categoryId) {
      endpoint = endpoint + `&category_id=${categoryId}`;
    }
    if (searchTerm && searchTerm.length > 0) {
      endpoint = endpoint + `&tags__wildcard=*${searchTerm}*`;
    }

    axios
      .get(endpoint, {
        cancelToken: signalToken,
      })
      .then((res) => {
        dispatch({
          type: GET_TEMPLATES_VIEW_ALL,
          payload: res.data.results,
          loadMore: res.data.next !== null,
        });
      })
      .catch((error) => {
        dispatch(errorHandlerActions.handleHTTPError(error, props));
      });
  };

export const fetchCategories = (props, signalToken) => (dispatch) => {
  return axios
    .get(Format(FETCH_CATEGORIES, CATEGORY_TEMPLATE), {
      cancelToken: signalToken,
    })
    .then((res) => {
      dispatch({
        type: GET_CATEGORIES,
        payload: res.data,
      });
      return res.data.results;
    })
    .catch((error) => {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

export const cloneTemplate = (id, signalToken, props) => (dispatch) => {
  axios
    .post(format(CLONE_TEMPLATE, id), {
      cancelToken: signalToken.token,
    })
    .then((res) => {
      dispatch(
        redirect(
          format(
            STORY_DETAIL,
            res.data.organization,
            res.data.id,
            encodeURIComponent(res.data.title)
          ),
          props
        )
      );
    })
    .catch((error) =>
      dispatch(errorHandlerActions.handleHTTPError(error, props))
    );
};

export const getAlignSizePositionForElement = (alignType, props) => {
  const { editor, layerstore, story } = props;
  const layerId = editor.activeElement.id;
  const layer = layerstore.layers[layerId];
  let { size, position } = layer.payload;

  let rootElementIdOfGroup = getRootElementIdOfGroup(
    layerstore.layers,
    layerId
  );
  if (rootElementIdOfGroup !== null) {
    let payload = layerstore.layers[rootElementIdOfGroup].payload;
    size = payload.size;
    position = payload.position;
  }

  let contentSize = {
    width: story.payload.image_width,
    height: story.payload.image_height,
  };

  return {
    size: size,
    position: getAlignPosition(size, position, alignType, contentSize),
  };
};

export const moveElement = (action, props) => {
  const layerId = props.editor.activeElement.id;
  const layer = props.layerstore.layers[layerId];

  let newSizePosition = getAlignSizePositionForElement(action, props);

  const message = {
    layer: getRootElementIdOfGroup(props.layerstore.layers, layerId),
    payload: {
      ...layer.payload,
      position: newSizePosition.position,
      size: newSizePosition.size,
    },
  };

  props.updateLayerPayload(message);
  props.wsUpdateLayer(message);
};

export const cloneLayers = (layers, page, signalToken) => {
  return new Promise(function (resolve, reject) {
    axios
      .post(
        Format(CLONE_LAYERS_ENDPOINT),
        {
          layers: layers,
          page: page,
        },
        {
          cancelToken: signalToken.token,
        }
      )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => reject(error));
  });
};

export const resetTemplatesViewAll = () => {
  return {
    type: RESET_TEMPLATES_VIEW_ALL,
  };
};

export const filterTemplatesByCategory =
  (searchTerm, categoryId, formatId, props, signalToken) => (dispatch) => {
    let endpoint = Format(
      FILTER_TEMPLATES_BY_CATEGORY_ENDPOINT,
      formatId,
      categoryId
    );

    if (searchTerm.length > 0) {
      endpoint = endpoint + `&search=${searchTerm}`;
    }

    endpoint += "&page=1";

    if (categoryId === "") {
      dispatch(
        fetchViewAllTemplatesByGroup(
          searchTerm,
          formatId,
          categoryId,
          props,
          signalToken
        )
      );
      return;
    }

    axios
      .get(endpoint, {
        cancelToken: signalToken,
      })
      .then((res) => {
        dispatch({
          type: GET_TEMPLATES_VIEW_ALL,
          payload: res.data.results,
        });
      })
      .catch((error) => {
        dispatch(errorHandlerActions.handleHTTPError(error, props));
      });
  };

export const updateStoryMusic = (musicData) => (dispatch) => {
  batch(() => {
    dispatch({
      type: UPDATE_STORY_MUSIC,
      payload: musicData,
    });
    dispatch(updateStoryMusicPlayback("play"));
  });
};
