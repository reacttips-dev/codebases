'use es6';
/**
 * @deprecated use props directly in derefs instead
 */

export default function derefSearchText(props) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (state.searchText != null) {
    return state.searchText;
  }

  if (props.state && props.state.searchText && props.state.searchText.length) {
    return props.state.searchText;
  }

  if (props.searchText) {
    return props.searchText;
  }

  return undefined;
}