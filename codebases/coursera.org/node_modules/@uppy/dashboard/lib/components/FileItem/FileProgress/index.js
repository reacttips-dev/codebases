var _require = require('preact'),
    h = _require.h;

var _require2 = require('../../icons'),
    iconRetry = _require2.iconRetry;

var PauseResumeCancelIcon = require('./PauseResumeCancelIcon');

function onPauseResumeCancelRetry(props) {
  if (props.isUploaded) return;

  if (props.error && !props.hideRetryButton) {
    props.retryUpload(props.file.id);
    return;
  }

  if (props.hidePauseResumeCancelButtons) {
    return;
  }

  if (props.resumableUploads) {
    props.pauseUpload(props.file.id);
  } else if (props.individualCancellation) {
    props.cancelUpload(props.file.id);
  }
}

function progressIndicatorTitle(props) {
  if (props.isUploaded) {
    return props.i18n('uploadComplete');
  }

  if (props.error) {
    return props.i18n('retryUpload');
  }

  if (props.resumableUploads) {
    if (props.file.isPaused) {
      return props.i18n('resumeUpload');
    }

    return props.i18n('pauseUpload');
  } else if (props.individualCancellation) {
    return props.i18n('cancelUpload');
  }

  return '';
}

module.exports = function FileProgress(props) {
  if (props.hideRetryButton && props.error) {
    return h("div", {
      class: "uppy-DashboardItem-progress"
    });
  } else if (props.isUploaded || props.hidePauseResumeCancelButtons && !props.error) {
    return h("div", {
      class: "uppy-DashboardItem-progress"
    }, h("div", {
      class: "uppy-DashboardItem-progressIndicator"
    }, h(PauseResumeCancelIcon, {
      progress: props.file.progress.percentage,
      hidePauseResumeCancelButtons: props.hidePauseResumeCancelButtons
    })));
  } else {
    return h("div", {
      class: "uppy-DashboardItem-progress"
    }, h("button", {
      class: "uppy-u-reset uppy-DashboardItem-progressIndicator",
      type: "button",
      "aria-label": progressIndicatorTitle(props),
      title: progressIndicatorTitle(props),
      onclick: function onclick() {
        return onPauseResumeCancelRetry(props);
      }
    }, props.error ? props.hideRetryButton ? null : iconRetry() : h(PauseResumeCancelIcon, {
      progress: props.file.progress.percentage,
      hidePauseResumeCancelButtons: props.hidePauseResumeCancelButtons
    })));
  }
};