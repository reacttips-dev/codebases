'use es6';

import Raven from 'Raven';
import ContentManager from '../../data/ContentManager';
import FileManager from '../../data/FileManager';
import FMFile from '../../data/model/FMFile';
import actionTypes from './actionTypes';
import COSContent from '../../data/model/COSContent';
import Blog from '../../data/model/Blog';
var contentManager = ContentManager.getInstance();
var fileManager = FileManager.getInstance();
export var fetchBlogs = function fetchBlogs() {
  return function (dispatch) {
    dispatch({
      type: actionTypes.BLOGS_FETCH,
      apiRequest: function apiRequest() {
        return contentManager.fetchAllBlogs().then(Blog.createFromArray);
      }
    });
  };
};
export var fetchBlogPostOptions = function fetchBlogPostOptions(query) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.BLOG_POSTS_FETCH,
      apiRequest: function apiRequest() {
        return contentManager.fetchPosts(query).then(function (data) {
          data.objects.sort(function (a, b) {
            return b.publishDate - a.publishDate;
          });
          return data.objects.map(function (post) {
            post.campaignGuid = post.campaign ? post.campaign.split('|')[0] : null;
            return COSContent.createFrom(post);
          });
        });
      }
    });
  };
};
export var fetchPageOptions = function fetchPageOptions(query) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.BLOG_POSTS_FETCH,
      apiRequest: function apiRequest() {
        return contentManager.fetchPages(query).then(function (data) {
          data.objects.sort(function (a, b) {
            return b.publishDate - a.publishDate;
          });
          return data.objects.map(function (page) {
            page.campaignGuid = page.campaign;
            return COSContent.createFrom(page);
          });
        });
      }
    });
  };
};
export var fetchContent = function fetchContent(id) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return function (dispatch) {
    return dispatch({
      type: actionTypes.CONTENT_FETCH,
      payload: {
        id: id,
        index: index
      },
      apiRequest: function apiRequest() {
        return contentManager.fetchContent(id).then(COSContent.createFrom).catch(function () {
          Raven.captureBreadcrumb("Error fetching content for hubspotContentId " + id);
        });
      }
    });
  };
}; // downloads into File Manager

export var downloadFromUrl = function downloadFromUrl(imageUrl, opts) {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.FILE_MANAGER_DOWNLOAD_FROM_URL,
      payload: {},
      apiRequest: function apiRequest() {
        return fileManager.downloadFromUrl(imageUrl, opts).then(function (data) {
          return FMFile.createFrom(data);
        });
      }
    });
  };
};
export var fetchFileManagerFile = function fetchFileManagerFile(id) {
  var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch) {
    return dispatch({
      type: actionTypes.FILE_MANAGER_FILE_FETCH,
      payload: payload,
      apiRequest: function apiRequest() {
        return fileManager.fetchFile(id).then(function (data) {
          if (!data || data === '') {
            Raven.captureBreadcrumb({
              type: 'error',
              message: "FileManager api returned 204 for missing file id " + id
            });
            return null;
          }

          var file = FMFile.createFrom(data);

          if (file.isAnimated()) {
            return fileManager.fetchImageInfo(file.url).then(function (imageInfo) {
              return file.set('frameCount', imageInfo.frameCount);
            });
          } else {
            return file;
          }
        });
      }
    });
  };
};