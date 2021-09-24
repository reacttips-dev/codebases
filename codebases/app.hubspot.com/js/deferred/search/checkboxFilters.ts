import { dropdownFilterTemplate } from '../../../html/jsTemplates/search/dropdownFilterTemplate';
export var addButtonListener = function addButtonListener() {
  var filterCheckboxContainer = document.querySelector('.navSearch-filter-checkboxes');

  if (filterCheckboxContainer) {
    var dropdownFilterClose = filterCheckboxContainer.querySelector('.close-checkboxes');

    if (dropdownFilterClose) {
      dropdownFilterClose.addEventListener('click', function () {
        filterCheckboxContainer.classList.add('hidden');
      });
    }
  }
};
export var addSeeCheckboxesListener = function addSeeCheckboxesListener() {
  var filterCheckboxContainer = document.querySelector('.navSearch-filter-checkboxes');
  var inputButton = document.querySelector('.navSearch-input-filter');

  if (filterCheckboxContainer && inputButton) {
    inputButton.addEventListener('click', function () {
      if (!filterCheckboxContainer.classList.contains('hidden')) {
        filterCheckboxContainer.classList.add('hidden');
      } else {
        filterCheckboxContainer.classList.remove('hidden');
      }
    });
  }
};
export var addHeaderButtonListeners = function addHeaderButtonListeners() {
  var filterButtons = [].slice.call(document.querySelectorAll('button.navSearch-filter-button-header'));
  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var correspondingCheckbox = document.querySelector("div#" + button.id);

      if (correspondingCheckbox) {
        correspondingCheckbox.click();
      }
    });
  });
};
export var render = function render(customObjects, resultSectionKeys, selectedCategories) {
  var filterCheckboxContainer = document.querySelector('.navSearch-filter-checkboxes');

  if (filterCheckboxContainer) {
    filterCheckboxContainer.innerHTML = dropdownFilterTemplate({
      customObjects: customObjects,
      availableResultSections: resultSectionKeys,
      selectedResultSections: selectedCategories
    });
  }

  addButtonListener();
};
export var remove = function remove(customObjects) {
  var filterCounter = document.querySelector('.navSearch-filter-counter');

  if (filterCounter) {
    filterCounter.innerHTML = '';
  }

  var filterCheckboxContainer = document.querySelector('.navSearch-filter-checkboxes');

  if (filterCheckboxContainer) {
    filterCheckboxContainer.classList.add('hidden');
    filterCheckboxContainer.innerHTML = dropdownFilterTemplate({
      customObjects: customObjects,
      availableResultSections: null,
      selectedResultSections: []
    });
  }

  addButtonListener();
};