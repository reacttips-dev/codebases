import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

class ThreadSettingsStore extends BaseStore {
  static storeName = 'ThreadSettingsStore';

  static handlers = {
    ADD_THREAD: 'onAddThread',
    CLOSE_THREAD: 'onCloseThread',
    UNCLOSE_THREAD: 'onUncloseThread',
    PIN_THREAD: 'onPinThread',
    UNPIN_THREAD: 'onUnpinThread',
    THREAD_SETTINGS_ERROR: 'onError',
  };

  threadInfo = {};

  errorMessage = null;

  onAddThread(threadInfo) {
    this.errorMessage = null;
    this.threadInfo = threadInfo;
    this.emitChange();
  }

  onCloseThread() {
    this.errorMessage = null;
    if (this.threadInfo.state) {
      this.threadInfo.state.closed = true;
    }
    this.emitChange();
  }

  onUncloseThread() {
    this.errorMessage = null;
    if (this.threadInfo.state) {
      this.threadInfo.state.closed = false;
    }
    this.emitChange();
  }

  onPinThread() {
    this.errorMessage = null;
    if (this.threadInfo.state) {
      this.threadInfo.state.pinned = true;
    }
    this.emitChange();
  }

  onUnpinThread() {
    this.errorMessage = null;
    if (this.threadInfo.state) {
      this.threadInfo.state.pinned = false;
    }
    this.emitChange();
  }

  onError(errorMessage) {
    this.errorMessage = errorMessage;
    this.emitChange();
  }

  isClosed() {
    return !!(this.threadInfo.state && (this.threadInfo.state.closed || false));
  }

  isPinned() {
    return !!(this.threadInfo.state && (this.threadInfo.state.pinned || false));
  }

  getQuestionId() {
    return this.threadInfo.id;
  }

  getForumType() {
    return this.threadInfo.forumType;
  }

  isError() {
    return !!this.errorMessage;
  }
}

export default ThreadSettingsStore;
