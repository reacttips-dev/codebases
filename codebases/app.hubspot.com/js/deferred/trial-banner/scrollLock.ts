var originalBodyPaddingRight;
var originalDocumentOverflow;
var originalBodyOverflow;

function measureScrollbar() {
  var scrollDiv = document.createElement('div');
  scrollDiv.className = 'uiFullScreen-scrollbar-measure';
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}

var addFauxScrollbar = function addFauxScrollbar() {
  var bodyHasScrollbar = document.body.clientWidth < window.innerWidth;

  if (bodyHasScrollbar) {
    var scrollbarWidth = measureScrollbar() + "px";
    originalBodyPaddingRight = document.body.style.paddingRight;
    document.body.style.paddingRight = scrollbarWidth;
  }
};

export var disableBackgroundScrolling = function disableBackgroundScrolling() {
  addFauxScrollbar();
  originalDocumentOverflow = document.documentElement.style.overflow;
  originalBodyOverflow = document.body.style.overflow;
  document.documentElement.style.overflow = 'hidden';
};

var removeFauxScrollbar = function removeFauxScrollbar() {
  document.body.style.paddingRight = originalBodyPaddingRight;
};

export var restoreBackgroundScrolling = function restoreBackgroundScrolling() {
  document.documentElement.style.overflow = originalDocumentOverflow;
  document.body.style.overflow = originalBodyOverflow;
  document.body.style.paddingRight = originalBodyPaddingRight;
  removeFauxScrollbar();
};