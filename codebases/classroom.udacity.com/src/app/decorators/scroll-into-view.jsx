import { getDisplayName } from 'helpers/decorator-helpers.js';
// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
const DEFAULT_SCROLL_OPTS = {
  behavior: 'smooth',
  block: 'start',
  inline: 'nearest',
};
// HACK: scroll hack to handle scrolling a particular ID into view when
// scrolling available
export function scrollIdIntoView(id) {
  let itemElement = document.getElementById(id);
  if (itemElement) {
    itemElement.scrollIntoView(DEFAULT_SCROLL_OPTS);
  }
}

export function scrollAfterRender(id, timeout) {
  setTimeout(() => scrollIdIntoView(id), timeout);
}

export default function withScrollIntoView(WrappedComponent) {
  const WithScrollIntoView = (props) => {
    return (
      <WrappedComponent
        scrollIdIntoView={scrollIdIntoView}
        scrollAfterRender={scrollAfterRender}
        {...props}
      />
    );
  };
  WithScrollIntoView.displayName = `WithScrollIntoView(${getDisplayName(
    WrappedComponent
  )})`;
  WithScrollIntoView.WrappedComponent = WrappedComponent;
  return WithScrollIntoView;
}
