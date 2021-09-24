'use es6';

var plainTextFromHTML = function plainTextFromHTML(htmlString) {
  var dummyEl = document.createElement('div');
  dummyEl.innerHTML = htmlString;
  var text = dummyEl.innerText.trim();
  return text;
};

export default plainTextFromHTML;