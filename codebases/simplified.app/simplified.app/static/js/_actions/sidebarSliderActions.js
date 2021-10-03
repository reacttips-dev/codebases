import axios from "axios";
import queryString from "query-string";
import {
  IMAGES_SLIDER_PANEL,
  GIPHY_SLIDER_PANEL,
  VIDEO_SLIDER_PANEL,
  TEXT_SLIDER_PANEL,
  ASSETS_SLIDER_PANEL,
  ELEMENTS_SLIDER_PANEL,
  TEMPLATES_SLIDER_PANEL,
  ICONS_SLIDER_PANEL,
  MUSIC_SLIDER_PANEL,
} from "../_components/details/constants";
import { batch } from "react-redux";
import * as errorHandlerActions from "./errorHandlerActions";
import {
  GIPHY_TRENDING_ENDPOINT,
  GIPHY_SEARCH_ENDPOINT,
  PIXABAY_VIDEO_ENDPOINT,
  FETCH_TEXT_BLOCKS,
  FETCH_IMAGES_ENDPOINT,
  SEARCH_IMAGES_ENDPOINT,
  ASSETS_ENDPOINT,
  DELETE_ASSET_ENDPOINT,
  DELETE_TEMPLATE_ENDPOINT,
  SEARCH_BY_TEMPLATE_TYPE,
  GROUP_BY_TEMPLATES,
  GROUP_BY_CATEGORIES,
  FETCH_IMAGES_ENDPOINT_PEXELS,
  SEARCH_IMAGES_ENDPOINT_PEXELS,
  PEXELS_CLIENT_ID,
  SEARCH_SHOPIFY,
  PIXABAY_IMAGES_ENDPOINT,
  FETCH_VIDEOS_ENDPOINT_PEXELS,
  ICONS_ENDPOINT_FLATICON,
  ICONS_SEARCH_ENDPOINT_FLATICON,
  DOWNLOAD_UNSPLASH_IMAGE_ENDPOINT,
  ICONS_ENDPOINT_BRANDFETCH,
  BRANDFETCH_API_KEY,
  ICONS_ENDPOINT_CLEARBIT,
  PUBLISH_TEMPLATE,
  SEARCH_GOOGLE_DRIVE,
  STORIES_DETAIL,
  DELETE_DOCUMENTS_ENDPOINT,
  STORYBLOCK_VIDEOS_FETCH,
  STORYBLOCK_MUSIC_COLLECTIONS_FETCH,
  STORYBLOCK_MUSIC_SEARCH,
} from "./endpoints";
import {
  GET_IMAGES,
  GET_GIPHY,
  GET_VIDEOS,
  GET_TEXT_BLOCKS,
  CLOSE_ADVANCED_SETTINGS,
  OPEN_ADVANCED_SETTINGS,
  OPEN_SIDEBAR,
  CLOSE_SIDEBAR,
  OPEN_SLIDER,
  SET_OR_UPDATE_STYLES,
  CLOSE_ALL_SLIDERS,
  GET_ASSETS,
  DELETE_ASSET,
  DELETE_TEMPLATE,
  RESET_PAGE,
  GET_TEMPLATE_GROUPS,
  RESET_ELEMENTS_VIEW_ALL,
  SEARCH_IMAGES,
  RESET_SIDEBAR_SLIDER_PAYLOAD,
  SEARCH_GIPHY,
  SEARCH_ELEMENTS,
  SEARCH_ELEMENTS_ALL,
  GET_ELEMENTS_VIEW_ALL,
  CHANGE_IMAGE_SOURCE,
  GET_ICONS,
  SEARCH_ICONS,
  GET_ICONS_VIEW_ALL,
  ImageSources,
  IconsSources,
  SWITCH_MEDIA_TAB,
  TEMPLATE_PUBLISHED,
  REMOVE_FOLDER_ITEM,
  CLEAR_ERRORS,
  DELETE_STORY,
  DELETE_DOCUMENT,
  VideoSources,
  MusicSources,
  GET_MUSIC,
} from "./types";
import { fetchBrandKits } from "./brandKitActions";
import { showToast } from "./toastActions";
import { deleteDocument } from "./aiDocumentActions";
import { analyticsTrackEvent, formatSize } from "../_utils/common";
import { closeBottomPanel } from "./bottomPanelActions";

const format = require("string-format");

export const setOrUpdateStyles = (performAction, destination) => {
  return {
    type: SET_OR_UPDATE_STYLES,
    payload: {
      action: performAction, // page, layer, component
      destination: destination,
    },
  };
};

export const resetSliders = () => {
  return {
    type: CLOSE_ALL_SLIDERS,
  };
};

export const switchMediaTab = (sliderPanelType) => {
  return {
    type: SWITCH_MEDIA_TAB,
    payload: sliderPanelType,
  };
};

// Open Sidebar
export const openSidebar = () => {
  return {
    type: OPEN_SIDEBAR,
    payload: {
      isSidebarOpen: true,
    },
  };
};

// Close Sidebar
export const closeSidebar = () => {
  return {
    type: CLOSE_SIDEBAR,
    payload: {
      isSidebarOpen: false,
    },
  };
};

// Open Slider
export const openSlider = (sliderPanelType) => {
  return {
    type: OPEN_SLIDER,
    payload: sliderPanelType,
  };
};

// Close Adv settings
export const closeAdvancedSettings = () => {
  return {
    type: CLOSE_ADVANCED_SETTINGS,
  };
};

// Open Slider
export const openAdvancedSettings = (panel, selectedTab) => (dispatch) => {
  batch(() => {
    dispatch({
      type: OPEN_ADVANCED_SETTINGS,
      payload: {
        selectedTab: selectedTab,
        panel: panel,
      },
    });
    // Whenever advance panel get open close the bottom panel always for better UX
    dispatch(closeBottomPanel());
  });
};

// // open animation effects slider
// export const openAdvancedAnimationSettings = (action, index) => {
//   return {
//     type: OPEN_ADVANCED_ANIMATION_SETTINGS,
//     payload: {
//       action: action,
//       selectedAnimationIndex: index,
//     },
//   };
// };

// // close animation effects slider
// export const closeAdvancedAnimationSettings = () => {
//   return {
//     type: CLOSE_ADVANCED_ANIMATION_SETTINGS,
//   };
// };

// Close Slider
export const closeSlider = () => {
  return {
    type: "CLOSE_SLIDER",
  };
};

export const resetPage = (page) => {
  return {
    type: RESET_PAGE,
    payload: page,
  };
};

export const changeSource = (source) => {
  return {
    type: CHANGE_IMAGE_SOURCE,
    payload: source,
  };
};

export const resetSidebarSliderPayload = () => {
  return {
    type: RESET_SIDEBAR_SLIDER_PAYLOAD,
  };
};

const fetchImages = (props, signalToken) => (dispatch) => {
  fetch(`${FETCH_IMAGES_ENDPOINT}&page=${props.page}&per_page=20`, {
    signal: signalToken,
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      batch(() => {
        dispatch({
          type: GET_IMAGES,
          payload: {
            data: json,
            groupKey: props.groupKey || 0,
            hasMore: true,
            imagesource: "Unsplash",
          },
        });
        dispatch({ type: CLEAR_ERRORS });
      });
    })
    .catch((error) => {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

const fetchImagesFromPexels = (props, signalToken) => async (dispatch) => {
  try {
    const response = await fetch(
      `${FETCH_IMAGES_ENDPOINT_PEXELS}?page=${props.page}&per_page=20`,
      {
        signal: signalToken,
        headers: {
          Authorization: `${PEXELS_CLIENT_ID}`,
        },
      }
    );

    const json = await response.json();
    if (json !== null) {
      batch(() => {
        dispatch({
          type: GET_IMAGES,
          payload: {
            data: json.photos,
            groupKey: props.groupKey || 0,
            searchText: props.searchText,
            imagesource: "Pexels",
            hasMore: true,
          },
        });
        dispatch({ type: CLEAR_ERRORS });
      });
    }
  } catch (error) {
    dispatch(errorHandlerActions.handleHTTPError(error, props));
  }
};

const fetchImagesFromPixabay = (props, signalToken) => async (dispatch) => {
  try {
    const response = await fetch(
      `${PIXABAY_IMAGES_ENDPOINT}&page=${props.page}&per_page=20`,
      {
        signal: signalToken,
      }
    );

    const json = await response.json();

    if (json !== null) {
      batch(() => {
        dispatch({
          type: GET_IMAGES,
          payload: {
            data: json.hits,
            groupKey: props.groupKey || 0,
            searchText: props.searchText,
            imagesource: "Pixabay",
            hasMore: true,
          },
        });
        dispatch({ type: CLEAR_ERRORS });
      });
    }
  } catch (error) {
    dispatch(errorHandlerActions.handleHTTPError(error, props));
  }
};

export const searchImagesOnShutterstock =
  (searchTerm, props, signalToken) => async (dispatch) => {
    const sstk = require("shutterstock-api");

    sstk.setAccessToken(process.env.REACT_APP_SHUTTERSTOCK_TOKEN);

    const imagesApi = new sstk.ImagesApi();

    const queryParams = {
      query: searchTerm,
      image_type: "photo",
      orientation: "vertical",
      people_number: 3,
      page: props.page,
      per_page: 20,
    };

    imagesApi
      .searchImages(queryParams)
      .then(({ data }) => {
        if (data !== null) {
          batch(() => {
            dispatch({
              type: GET_IMAGES,
              payload: {
                data: data,
                groupKey: props.groupKey || 0,
                searchText: props.searchText,
                imagesource: "Shutterstock",
                hasMore: true,
              },
            });
            dispatch({ type: CLEAR_ERRORS });
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

export const triggerDownload = (meta, signalToken) => (dispatch) => {
  if (meta.source !== "Unsplash") {
    return;
  }

  // For unspash we need to trigger download.
  const location = meta.links.download_location;

  fetch(format(DOWNLOAD_UNSPLASH_IMAGE_ENDPOINT, location), {
    signal: signalToken,
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {})
    .catch((error) => {});
};

/* error handling is not done correctly"*/
const searchImages = (searchTerm, props, signalToken) => (dispatch) => {
  fetch(
    `${SEARCH_IMAGES_ENDPOINT}&page=${props.page}&per_page=20&query=${searchTerm}`,
    {
      signal: signalToken,
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      batch(() => {
        dispatch({
          type: SEARCH_IMAGES,
          payload: {
            data: json.results,
            groupKey: props.groupKey || 0,
            searchText: props.searchText,
            hasMore: props.page + 1 <= json.total_pages,
            imagesource: "Unsplash",
          },
        });
        dispatch({ type: CLEAR_ERRORS });
      });
    })
    .catch((error) => {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

/* Search Images on Pexels */
const searchImagesOnPexels =
  (searchTerm, props, signalToken) => async (dispatch) => {
    try {
      const response = await fetch(
        `${SEARCH_IMAGES_ENDPOINT_PEXELS}?query="${searchTerm}"&page=${props.page}&per_page=20`,
        {
          signal: signalToken,
          headers: {
            Authorization: `${PEXELS_CLIENT_ID}`,
          },
        }
      );

      const json = await response.json();

      if (json !== null) {
        batch(() => {
          dispatch({
            type: GET_IMAGES,
            payload: {
              data: json.photos,
              groupKey: props.groupKey || 0,
              searchText: searchTerm,
              imagesource: "Pexels",
              hasMore: props.page + 1 <= json.total_results,
            },
          });
          dispatch({ type: CLEAR_ERRORS });
        });
      }
    } catch (error) {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    }
  };

/* Search Images on Pixabay */
const searchImagesOnPixabay =
  (searchTerm, props, signalToken) => async (dispatch) => {
    try {
      const response = await fetch(
        `${PIXABAY_IMAGES_ENDPOINT}&q=${searchTerm}&page=${props.page}&per_page=20&image_type=photo`,
        {
          signal: signalToken,
        }
      );

      const json = await response.json();
      if (json !== null) {
        batch(() => {
          dispatch({
            type: GET_IMAGES,
            payload: {
              data: json.hits,
              groupKey: props.groupKey || 0,
              searchText: props.searchText,
              imagesource: "Pixabay",
              hasMore: true,
            },
          });
          dispatch({ type: CLEAR_ERRORS });
        });
      }
    } catch (error) {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    }
  };

/* Search Images from shopify */
const searchImagesFromShopify =
  (searchTerm, props, signalToken) => (dispatch) => {
    axios
      .post(
        SEARCH_SHOPIFY,
        { cursor: "", query: searchTerm },
        { cancelToken: signalToken.token }
      )
      .then((res) => {
        batch(() => {
          dispatch({
            type: GET_IMAGES,
            payload: {
              data: res.data.data.products.edges,
              groupKey: props.groupKey || 0,
              searchText: props.searchText,
              imagesource: ImageSources.SHOPIFY,
              hasMore: false,
            },
          });
          dispatch({ type: CLEAR_ERRORS });
        });
      })
      .catch((error) => {
        if (error.response.status === 400) {
          if (error.response.data) {
            dispatch(
              errorHandlerActions.addImageProviderErrors(
                ImageSources.SHOPIFY,
                error.response.data
              )
            );
          }
        } else {
          console.error(`Error in fetching ${props.type || "elements"}!`);
          dispatch(errorHandlerActions.handleHTTPError(error, props));
        }
      });
  };

const searchImagesFromGoogleDrive =
  (searchTerm, props, signalToken) => (dispatch) => {
    const nextPageToken = props.sidebarSlider.nextPageToken;
    const query = queryString.stringify({
      search: searchTerm,
      next_page_token: nextPageToken,
    });
    axios
      .get(SEARCH_GOOGLE_DRIVE + `?${query}`, {
        cancelToken: signalToken.token,
      })
      .then((res) => {
        dispatch({
          type: GET_IMAGES,
          payload: {
            data: res.data.files,
            groupKey: props.groupKey || 0,
            searchText: props.searchText,
            imagesource: ImageSources.GOOGLE_DRIVE,
            hasMore: !!res.data.nextPageToken,
            nextPageToken: res.data.nextPageToken,
          },
        });
      })
      .catch((error) => {
        if (error.response.status === 400) {
          if (error.response.data) {
            dispatch(
              errorHandlerActions.addImageProviderErrors(
                ImageSources.GOOGLE_DRIVE,
                error.response.data
              )
            );
          }
        } else {
          console.error(`Error in fetching ${props.type || "elements"}!`);
          dispatch(errorHandlerActions.handleHTTPError(error, props));
        }
      });
  };

const fetchCollectionsFromFlaticon =
  (props, signalToken) => async (dispatch) => {
    const { viewAll } = props;

    if (viewAll) {
      dispatch(fetchAllIconsFromFlaticon(props, signalToken));
    } else {
      axios
        .get(`${ICONS_ENDPOINT_FLATICON}/categories?page=${props.page}`)
        .then((response) => {
          dispatch({
            type: GET_ICONS,
            payload: {
              data: response.data.data,
              groupKey: props.groupKey || 0,
              hasMore: false,
              iconsource: "Flaticon",
              searchText: props.searchText,
            },
          });
        })
        .catch((error) => {
          dispatch(errorHandlerActions.handleHTTPError(error, props));
        });
    }
  };

const fetchAllIconsFromFlaticon = (props, signalToken) => async (dispatch) => {
  const limit = 30;
  let dataCount = 0;

  axios
    .get(
      `${ICONS_SEARCH_ENDPOINT_FLATICON}?categoryId=${props.categoryId}&page=${props.page}&limit=${limit}`
    )
    .then((response) => {
      dataCount = limit * props.page;

      dispatch({
        type: GET_ICONS_VIEW_ALL,
        payload: {
          data: response.data.data,
          groupKey: props.groupKey || 0,
          type: props.type,
          hasMore: dataCount >= response.data.metadata.total ? false : true,
          iconsource: "Flaticon",
        },
      });
    })
    .catch((error) => {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

const searchIconsOnFlaticon =
  (searchTerm, props, signalToken) => async (dispatch) => {
    const orderBy = "added";
    const limit = 30;
    let dataCount = 0;

    const query = queryString.stringify({
      q: searchTerm,
      page: props.page,
      limit,
      categoryId: props.categoryId,
    });

    analyticsTrackEvent("searchIcons", {
      keyword: searchTerm,
    });

    axios
      .get(`${ICONS_SEARCH_ENDPOINT_FLATICON}/${orderBy}?${query}`, {
        cancelToken: signalToken,
      })
      .then((response) => {
        dataCount = limit * props.page;

        dispatch({
          type: SEARCH_ICONS,
          payload: {
            data: response.data.data,
            groupKey: props.groupKey || 0,
            hasMore: dataCount >= response.data.metadata.total ? false : true,
            searchText: searchTerm,
            iconsource: "Flaticon",
          },
        });
      })
      .catch((error) => {
        dispatch(errorHandlerActions.handleHTTPError(error, props));
      });
  };

/* Search for Logos on Brandfetch */
export const searchIconsOnBrandfetch =
  (searchTerm, props, signalToken) => async (dispatch) => {
    fetch(`${ICONS_ENDPOINT_CLEARBIT}?query=${searchTerm}`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        let domainName = json[0].domain;
        fetch(`${ICONS_ENDPOINT_BRANDFETCH}`, {
          method: "POST",
          headers: {
            "x-api-key": `${BRANDFETCH_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            domain: domainName,
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            let allLogos = [];
            allLogos.push(json.response.logo);
            dispatch({
              type: GET_ICONS,
              payload: {
                data: allLogos,
                groupKey: props.groupKey || 0,
                hasMore: true,
                iconsource: "Brandfetch",
              },
            });
            dispatch(errorHandlerActions.clearErrors());
          })
          .catch((error) => {
            dispatch(errorHandlerActions.handleHTTPError(error, props));
          });
      })
      .catch((error) => {
        dispatch(errorHandlerActions.handleHTTPError(error, props));
      });
  };

/* error handling is not done correctly"*/
const fetchGiphy = (props, signalToken) => (dispatch) => {
  let limit = 20;
  fetch(
    `${GIPHY_TRENDING_ENDPOINT}&limit=${limit}&offset=${
      (props.page - 1) * limit
    }`,
    { signal: signalToken }
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      dispatch({
        type: GET_GIPHY,
        payload: {
          data: json.data,
          groupKey: props.groupKey || 0,
          hasMore:
            json.pagination.count + json.pagination.offset <=
            json.pagination.total_count,
        },
      });
    })
    .catch((error) => {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

const searchGiphy = (searchTerm, props, signalToken) => (dispatch) => {
  let limit = 20;
  fetch(
    `${GIPHY_SEARCH_ENDPOINT}&q=${searchTerm}&limit=${limit}&offset=${
      (props.page - 1) * limit
    }&rating=PG&lang=en`,
    { signal: signalToken }
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      dispatch({
        type: SEARCH_GIPHY,
        payload: {
          data: json.data,
          groupKey: props.groupKey || 0,
          searchText: props.searchText,
          hasMore:
            json.pagination.count + json.pagination.offset <=
            json.pagination.total_count,
        },
      });
    })
    .catch((error) =>
      dispatch(errorHandlerActions.handleHTTPError(error, props))
    );
};

const fetchVideos = (searchTerm, props, signalToken) => (dispatch) => {
  let perPage = 20;
  fetch(
    `${PIXABAY_VIDEO_ENDPOINT}&q=${searchTerm}&page=${props.page}&per_page=${perPage}`,
    {
      signal: signalToken,
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      dispatch({
        type: GET_VIDEOS,
        payload: {
          data: json.hits,
          groupKey: props.groupKey || 0,
          searchText: props.searchText,
          videosource: "Pixabay",
          hasMore: props.page * perPage <= json.total,
        },
      });
    })
    .catch((error) => {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

/* Fetch videos from Pexels */
const fetchVideosFromPexels =
  (searchTerm, props, signalToken) => (dispatch) => {
    fetch(
      `${FETCH_VIDEOS_ENDPOINT_PEXELS}search?query=${searchTerm}&page=${props.page}&per_page=20`,
      {
        signal: signalToken,
        headers: {
          Authorization: `${PEXELS_CLIENT_ID}`,
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        dispatch({
          type: GET_VIDEOS,
          payload: {
            data: json.videos,
            groupKey: props.groupKey || 0,
            searchText: props.searchText,
            videosource: "Pexels",
            hasMore: true,
          },
        });
      })
      .catch((error) => {
        dispatch(errorHandlerActions.handleHTTPError(error, props));
      });
  };

/* Fetch videos from Shutterstock */
export const searchVideosOnShutterstock =
  (searchTerm, props) => async (dispatch) => {
    const sstk = require("shutterstock-api");

    sstk.setAccessToken(process.env.REACT_APP_SHUTTERSTOCK_TOKEN);

    const videosApi = new sstk.VideosApi();

    const queryParams = {
      query: searchTerm,
      sort: "popular",
      page: props.page,
      per_page: 20,
    };

    videosApi
      .searchVideos(queryParams)
      .then((data) => {
        dispatch({
          type: GET_VIDEOS,
          payload: {
            data: data.data,
            groupKey: props.groupKey || 0,
            searchText: props.searchText,
            videosource: "Shutterstock",
            hasMore: true,
          },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

/**
 *
 * @param {string} searchTerm Search term
 * @param {Object} props Props of parent component where action is injected
 */
export const searchVideosOnStoryBlocks =
  (searchTerm, props) => async (dispatch) => {
    const query = queryString.stringify({
      keywords: searchTerm,
      project_id: props.story?.payload?.id,
      user_id: props.auth?.payload?.selectedOrg,
      page: props.page,
      extended: "description,keywords,durationMs,aspectRatio",
    });
    try {
      const response = await axios.get(`${STORYBLOCK_VIDEOS_FETCH}?${query}`);
      if (response.status === 200) {
        dispatch({
          type: GET_VIDEOS,
          payload: {
            data: response.data.results,
            groupKey: props.groupKey || 0,
            searchText: props.searchText,
            videosource: VideoSources.STORYBLOCKS,
            hasMore: true,
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

export const searchMusicOnStoryblocks =
  (searchTerm, props, signalToken) => (dispatch) => {
    if (props.viewAll || searchTerm) {
      const limit = 20;
      const query = queryString.stringify({
        categories: props.categoryId,
        project_id: props.story?.payload?.id,
        user_id: props.auth?.payload?.selectedOrg,
        keywords: props.searchText,
        page: props.page,
      });

      axios.get(`${STORYBLOCK_MUSIC_SEARCH}?${query}`).then((res) => {
        const totalResults = res.data.total_results;

        const pageNum = props.page ?? 1;

        dispatch({
          type: GET_MUSIC,
          payload: {
            data: res.data.results,
            groupKey: props.categoryId || 0,
            hasMore: totalResults > pageNum * limit,
            musicSource: MusicSources.STORYBLOCKS,
            searchText: props.searchText,
          },
        });
      });
    } else {
      axios.get(STORYBLOCK_MUSIC_COLLECTIONS_FETCH).then((res) => {
        dispatch({
          type: GET_MUSIC,
          payload: {
            data: res.data,
            groupKey: props.groupKey || 0,
            hasMore: false,
            musicSource: MusicSources.STORYBLOCKS,
            searchText: props.searchText,
          },
        });
      });
    }
  };

export const fetchTextBlocks = (props, signalToken) => (dispatch) => {
  axios
    .get(FETCH_TEXT_BLOCKS, { cancelToken: signalToken })
    .then((res) => {
      dispatch({
        type: GET_TEXT_BLOCKS,
        payload: {
          data: res.data.results,
          groupKey: props.groupKey || 0,
          hasMore: res.data.next !== null,
        },
      });
    })
    .catch((error) => {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

const fetchAssets = (props, signalToken) => (dispatch) => {
  let url = `${ASSETS_ENDPOINT}?page=${props.page || 1}`;
  if (props.titleSearchQuery) {
    url += `&asset_key=${props.titleSearchQuery}`;
  }
  axios
    .get(url, {
      cancelToken: signalToken,
    })
    .then((res) => {
      dispatch({
        type: GET_ASSETS,
        payload: {
          data: res.data.results,
          groupKey: props.groupKey || 0,
          hasMore: res.data.next !== null,
        },
      });
    })
    .catch((error) => {
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

const deleteAsset =
  (props, signalToken, shouldUpdateFolders = false) =>
  (dispatch) => {
    axios
      .delete(format(DELETE_ASSET_ENDPOINT, props.id), {
        cancelToken: signalToken,
      })
      .then((res) => {
        dispatch({
          type: DELETE_ASSET,
          payload: props.id,
        });
        dispatch(fetchBrandKits());

        if (shouldUpdateFolders && props.selectedFolder) {
          dispatch({
            type: REMOVE_FOLDER_ITEM,
            payload: { folderId: props.selectedFolder.id, contentId: props.id },
          });
          if (props.ids) {
            props.ids.forEach((id) => {
              dispatch({
                type: REMOVE_FOLDER_ITEM,
                payload: {
                  folderId: props.selectedFolder.id,
                  contentId: id,
                },
              });
            });
          }
        }
      })
      .catch((error) => {
        dispatch(errorHandlerActions.handleHTTPError(error, props.id));
      });
  };

const deleteTemplate = (id, signalToken) => (dispatch) => {
  dispatch(
    showToast({
      message: "Deleting selected template ... ",
      heading: "Deleting template",
      type: "info",
    })
  );
  let data = { cancelToken: signalToken };
  return axios
    .delete(format(DELETE_TEMPLATE_ENDPOINT, id), data)
    .then((res) => {
      dispatch({
        type: DELETE_TEMPLATE,
        payload: id,
      });
      dispatch(
        showToast({
          message: "Selected template has been deleted!",
          heading: "Success",
          type: "success",
        })
      );
      return res;
    })
    .catch((error) => {
      dispatch(
        showToast({
          message: "Failed to delete selected template.",
          heading: "Failed",
          type: "error",
        })
      );
      dispatch(errorHandlerActions.handleHTTPError(error, id));
    });
};

const bulkAction =
  (
    props,
    endpoint,
    action,
    signalToken,
    dispatchType,
    shouldUpdateFolders = false
  ) =>
  (dispatch) => {
    const ids = props.ids;
    axios
      .post(
        format(endpoint, "bulk"),
        { ids, action },
        { cancelToken: signalToken }
      )
      .then((res) => {
        if (shouldUpdateFolders && props.selectedFolder) {
          ids.forEach((id) => {
            dispatch({
              type: REMOVE_FOLDER_ITEM,
              payload: {
                folderId: props.selectedFolder.id,
                contentId: id,
              },
            });
          });
        }

        ids.forEach((id) => {
          dispatch({
            type: dispatchType,
            payload: id,
          });
        });
      })
      .catch((error) => {
        dispatch(errorHandlerActions.handleHTTPError(error, props));
      });
  };

export const fetchTemplates =
  (props, signalToken, templateType, storySize) => (dispatch) => {
    const formatFilter =
      templateType === "template" ? formatSize(props, storySize) : "";
    if (props.viewAll) {
      fetchViewAllTemplates(
        props,
        signalToken,
        dispatch,
        templateType,
        formatFilter
      );
    } else {
      fetchTemplateGroups(
        props,
        signalToken,
        dispatch,
        templateType,
        formatFilter
      );
    }
  };

export const fetchTemplateGroups = (
  props,
  signalToken,
  dispatch,
  templateType,
  formatFilter
) => {
  let endpoint = `${format(GROUP_BY_CATEGORIES, templateType)}`;
  if (formatFilter) {
    endpoint += formatFilter;
  }

  endpoint += `&page=${props?.sidebarSlider?.page}`;

  axios
    .get(endpoint, {
      cancelToken: signalToken,
    })
    .then((res) => {
      dispatch({
        type: GET_TEMPLATE_GROUPS,
        payload: {
          data: res.data.results,
          groupKey: props.groupKey || 0,
          hasMore: res.data.next !== null,
        },
      });
    })
    .catch((error) => {
      console.error(`Error in fetching elements!`);
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

export const fetchViewAllTemplates = (
  props,
  signalToken,
  dispatch,
  templateType,
  formatFiler
) => {
  let endpoint = `${SEARCH_BY_TEMPLATE_TYPE}?template=${templateType}&page=${props.page}`;

  if (props.org) {
    endpoint += `&org=${props.org}`;
  } else {
    endpoint += "&org=";
  }
  if (props.categoryType) {
    endpoint += `&category_id=${props.categoryId}`;
  }
  if (formatFiler && props.formatFilter !== false) {
    endpoint += formatFiler;
  }

  axios
    .get(endpoint, { cancelToken: signalToken })
    .then((res) => {
      dispatch({
        type: GET_ELEMENTS_VIEW_ALL,
        payload: {
          data: res.data.results,
          groupKey: props.groupKey || 0,
          type: props.type,
          hasMore: res.data.next ? true : false,
        },
      });
    })
    .catch((error) => {
      console.error(`Error in fetching ${props.type || "elements"}!`);
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

export const searchTemplates =
  (searchTerm, props, signalToken, templateType, storySize, groupBy) =>
  (dispatch) => {
    const { viewAll } = props;
    const formatFilter =
      templateType === "template" ? formatSize(props, storySize) : "";

    analyticsTrackEvent("searchTemplates", {
      keyword: searchTerm,
    });

    if (viewAll) {
      searchTemplateAll(
        searchTerm,
        props,
        signalToken,
        dispatch,
        templateType,
        formatFilter
      );
      return;
    }
    searchTemplateGroups(
      searchTerm,
      props,
      signalToken,
      dispatch,
      templateType,
      formatFilter,
      groupBy
    );
  };

export const searchTemplateAll = (
  searchTerm,
  props,
  signalToken,
  dispatch,
  templateType,
  formatFiler
) => {
  const { groupKey, type, page } = props;

  let endpoint = `${SEARCH_BY_TEMPLATE_TYPE}?template=${templateType}&page=${page}&search=${searchTerm}`;
  if (formatFiler) {
    endpoint += formatFiler;
  }
  if (props.categoryType && props.categoryId) {
    endpoint += `&category_id=${props.categoryId}`;
  }
  axios
    .get(endpoint, { cancelToken: signalToken })
    .then((res) => {
      dispatch({
        type: SEARCH_ELEMENTS_ALL,
        payload: {
          data: res.data.results,
          groupKey: groupKey || 0,
          type: type,
          searchText: searchTerm,
          hasMore: res.data.next !== null,
        },
      });
    })
    .catch((error) => {
      console.error(`Error in searching ${props.type}!`);
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

export const searchTemplateGroups = (
  searchTerm,
  props,
  signalToken,
  dispatch,
  templateType,
  formatFilter,
  groupBy
) => {
  const { groupKey } = props;
  let endpoint = GROUP_BY_TEMPLATES;

  let groups = `/groups?group_by=${groupBy}`;
  let templates = `&template=${templateType}`;
  let searchParam = `&search=${searchTerm}`;
  endpoint = `${endpoint}${groups}${templates}${searchParam}`;
  if (formatFilter) {
    endpoint += formatFilter;
  }

  axios
    .get(endpoint, { cancelToken: signalToken })
    .then((res) => {
      dispatch({
        type: SEARCH_ELEMENTS,
        payload: {
          data: res.data.results,
          groupKey: groupKey || 0,
          searchText: searchTerm,
        },
      });
    })
    .catch((error) => {
      console.error(`Error in searching elements!`);
      dispatch(errorHandlerActions.handleHTTPError(error, props));
    });
};

export const resetViewAll = () => (dispatch) => {
  dispatch({
    type: RESET_ELEMENTS_VIEW_ALL,
  });
};

const executeNotPathFound = (searchTerm, props) => {};

export const deleteUserAssets =
  (props, token, shouldUpdateFolders = false) =>
  (dispatch) => {
    switch (props.type) {
      case "asset":
      case "brandAsset":
        return dispatch(deleteAsset(props, token, shouldUpdateFolders));
      case "svg":
        return dispatch(deleteTemplate(props.id, token));
      case "document":
        return dispatch(deleteDocument(props.id, token));
      default:
        return executeNotPathFound();
    }
  };

export const deleteItemsInBulk =
  (props, token, shouldUpdateFolders = false) =>
  (dispatch) => {
    switch (props.type) {
      case "asset":
      case "brandAsset":
        return dispatch(
          bulkAction(
            props,
            DELETE_ASSET_ENDPOINT,
            "delete",
            token,
            DELETE_ASSET,
            shouldUpdateFolders
          )
        );
      case "svg":
        return dispatch(
          bulkAction(
            props,
            DELETE_TEMPLATE_ENDPOINT,
            "delete",
            token,
            DELETE_TEMPLATE,
            shouldUpdateFolders
          )
        );
      case "story":
        return dispatch(
          bulkAction(
            props,
            STORIES_DETAIL,
            "delete",
            token,
            DELETE_STORY,
            shouldUpdateFolders
          )
        );
      case "document":
        return dispatch(
          bulkAction(
            props,
            DELETE_DOCUMENTS_ENDPOINT,
            "delete",
            token,
            DELETE_DOCUMENT,
            shouldUpdateFolders
          )
        );
      default:
        return executeNotPathFound();
    }
  };

export const search =
  (source, searchTerm, props, signalToken) => (dispatch) => {
    switch (props.panelType) {
      case IMAGES_SLIDER_PANEL:
        return dispatch(
          searchImagesPerSource(source, searchTerm, props, signalToken)
        );
      case GIPHY_SLIDER_PANEL:
        return dispatch(searchGiphy(searchTerm, props, signalToken));
      case VIDEO_SLIDER_PANEL:
        return dispatch(
          searchVideosPerSource(source, searchTerm, props, signalToken)
        );
      case TEXT_SLIDER_PANEL:
        return dispatch(fetchTextBlocks(props));
      case ELEMENTS_SLIDER_PANEL:
        return dispatch(
          searchTemplates(
            searchTerm,
            props,
            signalToken,
            props.templateType,
            props?.story?.contentSize,
            "category"
          )
        );
      case TEMPLATES_SLIDER_PANEL:
        return dispatch(
          searchTemplates(
            searchTerm,
            props,
            signalToken,
            props.templateType,
            props?.story?.contentSize,
            "template"
          )
        );
      case ICONS_SLIDER_PANEL:
        return dispatch(
          searchIconsPerSource(source, searchTerm, props, signalToken)
        );
      case MUSIC_SLIDER_PANEL:
        return dispatch(
          fetchMusicPerSource(source, searchTerm, props, signalToken)
        );
      default:
        return executeNotPathFound();
    }
  };

export const searchImagesPerSource =
  (imgSource, searchTerm, props, signalToken) => (dispatch) => {
    switch (imgSource) {
      case ImageSources.UNSPLASH:
        return dispatch(searchImages(searchTerm, props, signalToken));
      case ImageSources.PEXELS:
        return dispatch(searchImagesOnPexels(searchTerm, props, signalToken));
      case ImageSources.PIXABAY:
        return dispatch(searchImagesOnPixabay(searchTerm, props, signalToken));
      case ImageSources.SHOPIFY:
        return dispatch(
          searchImagesFromShopify(searchTerm, props, signalToken)
        );
      case ImageSources.GOOGLE_DRIVE:
        return dispatch(
          searchImagesFromGoogleDrive(searchTerm, props, signalToken)
        );
      case ImageSources.SHUTTERSTOCK:
        return dispatch(
          searchImagesOnShutterstock(searchTerm, props, signalToken)
        );
      default:
        return executeNotPathFound();
    }
  };

export const searchVideosPerSource =
  (imgSource, searchTerm, props, signalToken) => (dispatch) => {
    switch (imgSource) {
      case "Pixabay":
        return dispatch(fetchVideos(searchTerm, props, signalToken));
      case "Pexels":
        return dispatch(fetchVideosFromPexels(searchTerm, props, signalToken));
      case "Shutterstock":
        return dispatch(searchVideosOnShutterstock(searchTerm, props));
      case VideoSources.STORYBLOCKS:
        return dispatch(searchVideosOnStoryBlocks(searchTerm, props));
      default:
        return executeNotPathFound();
    }
  };

const searchIconsPerSource =
  (source, searchTerm, props, signalToken) => (dispatch) => {
    switch (source) {
      case "Flaticon":
        return dispatch(searchIconsOnFlaticon(searchTerm, props, signalToken));
      case "Brandfetch":
        return dispatch(
          searchIconsOnBrandfetch(searchTerm, props, signalToken)
        );
      default:
        return executeNotPathFound();
    }
  };

const fetchMusicPerSource =
  (source, searchTerm, props, signalToken) => (dispatch) => {
    switch (source) {
      case MusicSources.STORYBLOCKS:
        return dispatch(
          searchMusicOnStoryblocks(searchTerm, props, signalToken)
        );

      default:
        return executeNotPathFound();
    }
  };

export const fetchData = (source, props, signalToken) => (dispatch) => {
  switch (props.panelType) {
    case IMAGES_SLIDER_PANEL:
      return dispatch(fetchDataPerSource(source, props, signalToken));
    case GIPHY_SLIDER_PANEL:
      return dispatch(fetchGiphy(props, signalToken));
    case VIDEO_SLIDER_PANEL:
      return dispatch(fetchVideoPerSource(source, props, signalToken));
    case TEXT_SLIDER_PANEL:
      return dispatch(fetchTextBlocks(props, signalToken));
    case ASSETS_SLIDER_PANEL:
      return dispatch(fetchAssets(props, signalToken));
    case ELEMENTS_SLIDER_PANEL:
    case TEMPLATES_SLIDER_PANEL:
      return dispatch(
        fetchTemplates(
          props,
          signalToken,
          props.templateType,
          props?.story?.contentSize
        )
      );
    case ICONS_SLIDER_PANEL:
      return dispatch(fetchIconsPerSource(source, props, signalToken));
    case MUSIC_SLIDER_PANEL:
      return dispatch(fetchMusicPerSource(source, "", props, signalToken));
    default:
      return executeNotPathFound();
  }
};

export const fetchDataPerSource =
  (source, props, signalToken) => (dispatch) => {
    switch (source) {
      case ImageSources.UNSPLASH:
        return dispatch(fetchImages(props, signalToken));
      case ImageSources.PEXELS:
        return dispatch(fetchImagesFromPexels(props, signalToken));
      case ImageSources.PIXABAY:
        return dispatch(fetchImagesFromPixabay(props, signalToken));
      case ImageSources.SHOPIFY:
        return dispatch(searchImagesFromShopify(null, props, signalToken));
      case ImageSources.GOOGLE_DRIVE:
        return dispatch(searchImagesFromGoogleDrive(null, props, signalToken));
      case ImageSources.SHUTTERSTOCK:
        return dispatch(searchImagesOnShutterstock(null, props, signalToken));
      default:
        return executeNotPathFound();
    }
  };

export const fetchVideoPerSource =
  (source, props, signalToken) => (dispatch) => {
    switch (source) {
      case "Pixabay":
        return dispatch(fetchVideos("people", props, signalToken));
      case "Pexels":
        return dispatch(fetchVideosFromPexels("people", props, signalToken));
      case "Shutterstock":
        return dispatch(searchVideosOnShutterstock("", props));
      case VideoSources.STORYBLOCKS:
        return dispatch(searchVideosOnStoryBlocks("", props));
      default:
        return executeNotPathFound();
    }
  };

const fetchIconsPerSource = (source, props, signalToken) => (dispatch) => {
  switch (source) {
    case IconsSources.FLATICON:
      return dispatch(fetchCollectionsFromFlaticon(props, signalToken));
    case IconsSources.BRANDFETCH:
      return dispatch(searchIconsOnBrandfetch("google", props, signalToken));
    default:
      return executeNotPathFound();
  }
};

export const fetchDataOnSourceChange =
  (source, props, signalToken) => (dispatch) => {
    props.page = 1;
    switch (props.panelType) {
      case "images":
        return dispatch(fetchDataPerSource(source, props, signalToken));
      case "video":
        return dispatch(fetchVideoPerSource(source, props, signalToken));
      default:
        return executeNotPathFound();
    }
  };

export const searchDataOnSourceChange =
  (source, searchTerm, props, signalToken) => (dispatch) => {
    props.page = 1;
    switch (source) {
      case ImageSources.UNSPLASH:
        return dispatch(searchImages(searchTerm, props, signalToken));
      case ImageSources.PEXELS:
        return dispatch(searchImagesOnPexels(searchTerm, props, signalToken));
      case ImageSources.PIXABAY:
        return dispatch(searchImagesOnPixabay(searchTerm, props, signalToken));
      case ImageSources.SHOPIFY:
        return dispatch(
          searchImagesFromShopify(searchTerm, props, signalToken)
        );
      case ImageSources.GOOGLE_DRIVE:
        return dispatch(
          searchImagesFromGoogleDrive(searchTerm, props, signalToken)
        );
      case ImageSources.SHUTTERSTOCK:
        return dispatch(
          searchImagesOnShutterstock(searchTerm, props, signalToken)
        );
      default:
        return executeNotPathFound();
    }
  };

export const publishTemplate =
  (templateId, payload, signalToken) => (dispatch) => {
    dispatch(
      showToast({
        message: "Please wait, while we publish your template.",
        heading: "Publishing template",
        type: "info",
      })
    );

    return axios
      .put(format(PUBLISH_TEMPLATE, templateId), payload, {
        cancelToken: signalToken.token,
      })
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            showToast({
              message:
                "Congratulations, Your template is now published and available for the community.",
              heading: "Now Processing",
              type: "success",
            })
          );
          dispatch({
            type: TEMPLATE_PUBLISHED,
          });
          return res;
        }
      })
      .catch((error) => {
        dispatch(
          showToast({
            message: "Failed to publish your template.",
            heading: "Failed",
            type: "error",
          })
        );
        dispatch(errorHandlerActions.handleHTTPError(error));
      });
  };
