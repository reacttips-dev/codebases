// this is responsible for almost 100 type errors...makes sense it only name spaces any other element
export default function navQuerySelector() {
  var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  try {
    return document.querySelector("#hs-nav-v4 " + query);
  } catch (error) {
    return false;
  }
}