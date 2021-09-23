import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import * as SearchAPI from './SearchAPI';
import { text } from 'unified-navigation-ui/utils/NavI18n';
import { alertTemplate } from '../../../html/jsTemplates/alertTemplate';
var FeedbackType = {
  helpful: 0,
  'not-useful': 1,
  'bad-ranking': 2,
  'something-wrong': 3
};

var clearRadioError = function clearRadioError() {
  var radioError = document.querySelector('.navSearch-radio-button-error');

  if (radioError) {
    radioError.innerHTML = '';
  }
};

var controlRadios = function controlRadios(evt) {
  evt.preventDefault();
  clearRadioError();
  var radioButtons = [].slice.call(document.querySelectorAll('.navSearch-radio-button'));
  var radio = evt.currentTarget;

  if (radio) {
    if (radio.classList.contains('selected')) {
      radio.classList.remove('selected');
    } else {
      radio.classList.add('selected');
      var index = radioButtons.indexOf(radio);
      var remainingButtons = [].concat(_toConsumableArray(radioButtons.slice(0, index)), _toConsumableArray(radioButtons.slice(index + 1)));
      remainingButtons.forEach(function (button) {
        button.classList.remove('selected');
      });
    }
  }
};

var controlCheckboxes = function controlCheckboxes(evt) {
  evt.preventDefault();
  var checkbox = evt.currentTarget;

  if (checkbox.classList.contains('selected')) {
    checkbox.classList.remove('selected');
  } else {
    checkbox.classList.add('selected');
  }
};

var addRadioListeners = function addRadioListeners() {
  var radioButtons = [].slice.call(document.querySelectorAll('.navSearch-radio-button'));
  radioButtons.forEach(function (radio) {
    radio.addEventListener('click', controlRadios);
  });
  var checkboxes = [].slice.call(document.querySelectorAll('.navSearch-feedback-checkbox'));
  checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('click', controlCheckboxes);
  });
};

var getContactPermission = function getContactPermission() {
  var contactCheckbox = document.querySelector('.navSearch-feedback-checkbox.ok-to-contact');

  if (contactCheckbox && contactCheckbox.classList.contains('selected')) {
    return true;
  }

  return false;
};

var getScreenshotPermission = function getScreenshotPermission() {
  var screenshotCheckbox = document.querySelector('.navSearch-feedback-checkbox.include-screenshot');

  if (screenshotCheckbox && screenshotCheckbox.classList.contains('selected')) {
    return true;
  }

  return false;
};

var getComments = function getComments() {
  var textInput = document.querySelector('.navSearch-modal-text input');

  if (textInput) {
    return textInput.value;
  }

  return '';
};

var getRadioSelection = function getRadioSelection() {
  var selectedButton = '';
  var radioButtons = [].slice.call(document.querySelectorAll('.navSearch-radio-button'));
  radioButtons.forEach(function (radio) {
    if (radio.classList.contains('selected')) {
      var input = radio.querySelector('input');

      if (input) {
        selectedButton = input.value;
      }
    }
  });
  return selectedButton;
};

var displayMessage = function displayMessage(status) {
  var displayAlert = document.querySelector('.navSearch-error');

  if (displayAlert) {
    if (status === 'success') {
      displayAlert.innerHTML = alertTemplate({
        level: 'success',
        title: text('nav.search.thankyou', {
          defaultValue: 'Thank you.'
        }),
        description: text('nav.search.feedback.submitted', {
          defaultValue: 'Your feedback has been submitted.'
        })
      });
    } else {
      displayAlert.innerHTML = alertTemplate({
        level: 'danger',
        title: text('nav.search.somethingWentWrong', {
          defaultValue: 'Something went wrong'
        }),
        description: text('nav.search.feedback.notSubmitted', {
          defaultValue: 'Your feedback was not submitted. Please try again.'
        })
      });
    }

    var message = document.querySelector('.user-pref-alert');
    var closeIcon = document.querySelector('svg.close-icon');

    if (message && closeIcon) {
      closeIcon.addEventListener('click', function () {
        displayAlert.removeChild(message);
      });
    }

    setTimeout(function () {
      return displayAlert.innerHTML = '';
    }, 6000);
  }

  clearRadioError();
};

export var render = function render(data) {
  var modal = document.querySelector('.navSearch-modal-container');

  if (modal) {
    modal.classList.add('shown');
  }

  var modalClose = document.querySelector('.modal-close-button');
  var closeButton = document.querySelector('.navSearch-modal-cancel');
  var sendButton = document.querySelector('.navSearch-modal-send');

  if (modal && modalClose && closeButton && sendButton) {
    var closeModal = function closeModal() {
      modal.classList.remove('shown');
      modalClose.removeEventListener('click', closeModal);
      closeButton.removeEventListener('click', closeModal);
      var radioButtons = [].slice.call(document.querySelectorAll('.navSearch-radio-button'));
      radioButtons.forEach(function (radio) {
        radio.classList.remove('selected');
        radio.removeEventListener('click', controlRadios);
      });
      var checkboxes = [].slice.call(document.querySelectorAll('.navSearch-feedback-checkbox'));
      checkboxes.forEach(function (checkbox) {
        checkbox.classList.add('selected');
        checkbox.removeEventListener('click', controlCheckboxes);
      });
      var textInput = document.querySelector('.navSearch-modal-text input');

      if (textInput) {
        textInput.value = '';
      }

      clearRadioError();
    };

    modalClose.addEventListener('click', closeModal);
    closeButton.addEventListener('click', closeModal);

    var sendButtonEventListener = function sendButtonEventListener() {
      var radioSelection = getRadioSelection();
      var comments = getComments();
      var okayToContact = getContactPermission();
      var includeScreenshot = getScreenshotPermission();

      if (radioSelection.length === 0) {
        var radioError = document.querySelector('.navSearch-radio-button-error');

        if (radioError) {
          radioError.innerHTML = text('nav.search.feedback.pleaseSelectOptions', {
            defaultValue: 'Please select one of the above options.'
          });
        }

        return;
      }

      if (!includeScreenshot) {
        delete data.screenshot;
      }

      SearchAPI.sendFeedback({
        body: Object.assign({}, data, {
          freeformFeedback: comments,
          okayToContact: okayToContact,
          includeScreenshot: includeScreenshot,
          radioOptions: FeedbackType[radioSelection]
        }),
        onSuccess: function onSuccess() {
          return displayMessage('success');
        },
        onFail: function onFail() {
          return displayMessage('error');
        }
      });
      closeModal();
      sendButton.removeEventListener('click', sendButtonEventListener);
    };

    sendButton.addEventListener('click', sendButtonEventListener);
  }

  addRadioListeners();
};