import _ from 'underscore';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
import { hydrateQuestions } from 'bundles/discussions/utils/hydrateQuestionsAndAnswers';
import { loadingStates, savingStates } from 'bundles/discussions/constants';

class ThreadsStore extends BaseStore {
  static storeName = 'ThreadsStore';

  threads = {};

  currentPage;

  sort;

  currentForumId;

  forumType;

  forumId;

  loadingState = loadingStates.LOADING;

  savingStates = savingStates.UNCHANGED;

  filterQueryString = null;

  threadToInsert;

  userId;

  hasLoaded() {
    return true;
  }

  getThreadsPage() {
    const filterCombinationKey = this.getFilterCombinationKey(this.sort, this.answered);
    return (
      (this.threads[this.filterQueryString] &&
        this.threads[this.filterQueryString][this.currentForumId] &&
        this.threads[this.filterQueryString][this.currentForumId][filterCombinationKey] &&
        this.threads[this.filterQueryString][this.currentForumId][filterCombinationKey][this.currentPage]) ||
      []
    );
  }

  getCurrentPageNum() {
    return this.currentPage;
  }

  getPageCount() {
    return (
      (this.threads[this.filterQueryString] &&
        this.threads[this.filterQueryString][this.currentForumId] &&
        this.threads[this.filterQueryString][this.currentForumId].pageCount) ||
      0
    );
  }

  getThreadCount() {
    return (
      (this.threads[this.filterQueryString] &&
        this.threads[this.filterQueryString][this.currentForumId] &&
        this.threads[this.filterQueryString][this.currentForumId].threadCount) ||
      0
    );
  }

  getLoadingState() {
    return this.loadingState;
  }

  getThreadCountForForum(filterQueryString, forumId) {
    return (
      this.threads[filterQueryString] &&
      this.threads[filterQueryString][forumId] &&
      this.threads[filterQueryString][forumId].threadCount
    );
  }

  hasLoadedThreadPage({ sort, answered, pageNum, currentForumId, filterQueryString }) {
    const filterCombinationKey = this.getFilterCombinationKey(sort, answered);
    return !!(
      this.threads[filterQueryString] &&
      this.threads[filterQueryString][currentForumId] &&
      this.threads[filterQueryString][currentForumId][filterCombinationKey] &&
      this.threads[filterQueryString][currentForumId][filterCombinationKey][pageNum]
    );
  }

  getFilterCombinationKey = (sort, filter) => {
    return sort + filter;
  };

  static handlers = {
    CLEAR_THREADS_CACHE() {
      this.threads = {};
    },

    RECEIVE_THREADS({ results, sort, answered, pageNum, currentForumId, filterQueryString, forumType }) {
      const incomingFilterCombinationKey = this.getFilterCombinationKey(sort, answered);
      const existingFilterCombinationKey = this.getFilterCombinationKey(this.sort, this.answered);

      if (!this.threads[filterQueryString]) {
        this.threads[filterQueryString] = {};
      }
      if (!this.threads[filterQueryString][currentForumId]) {
        this.threads[filterQueryString][currentForumId] = {};
      }
      if (!this.threads[filterQueryString][currentForumId][sort]) {
        this.threads[filterQueryString][currentForumId][incomingFilterCombinationKey] = {};
      }

      this.threads[filterQueryString][currentForumId][incomingFilterCombinationKey][pageNum] = hydrateQuestions(
        results
      );
      this.threads[filterQueryString][currentForumId].pageCount = Math.ceil(results.paging.total / 15);
      this.threads[filterQueryString][currentForumId].threadCount = results.paging.total;
      this.loadingState = loadingStates.DONE;

      // Insert the user's new thread, if it's not in the page from the backend
      if (this.threadToInsert) {
        const forumId = this.threadToInsert.forumId;
        if (forumId === this.currentForumId) {
          const page = this.threads[this.filterQueryString][this.currentForumId][existingFilterCombinationKey][
            this.currentPage
          ];
          const threadAlreadyPresent = _(page).findWhere({
            id: this.threadToInsert.id,
          });
          if (!threadAlreadyPresent) {
            page.unshift(this.threadToInsert);
          }
        }
        this.threadToInsert = null;
      }
      this.emitChange();
    },

    START_THREADS_LOAD({ sort, answered, pageNum, filterQueryString, userId, forumType, forumId }) {
      this.sort = sort;
      this.answered = answered;
      this.currentPage = pageNum;
      this.currentForumId = forumId;
      this.forumType = forumType;
      this.forumId = forumId;
      this.userId = userId;
      this.filterQueryString = filterQueryString;
      this.emitChange();
    },

    UPDATE_THREADS_LOADING_STATE(loadingState) {
      this.loadingState = loadingState;
      this.emitChange();
    },

    THREADS_API_ERROR() {
      this.loadingState = loadingStates.ERROR;
      this.emitChange();
    },

    THREADS_API_SAVING() {
      this.savingState = savingStates.SAVING;
      this.emitChange();
    },

    RECEIVE_NEW_THREAD(newThread) {
      this.savingState = savingStates.SAVED;

      // force a reload of all thread pages
      this.threads = {};

      // Save for inserting when a new page of threads comes in
      this.threadToInsert = newThread;

      this.emitChange();
    },

    THREADS_API_SAVE_ERROR() {
      this.savingState = savingStates.ERROR;
      this.emitChange();
    },
  };
}

export default ThreadsStore;
