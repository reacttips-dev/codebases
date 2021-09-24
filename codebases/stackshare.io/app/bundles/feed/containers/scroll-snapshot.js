/*
 * These functions are meant to be mixed into the Feed component which needs
 * to restore scrollTop across updates when the items changes.
 * This effectively prevents the browser from jumping to the end of the page
 * when you click the "Load More" button. It keeps the scroll position
 * so you can start from the first newly added card.
 * FUTURE: use a hook!
 */

export function takeScrollSnapshot(prevProps, props) {
  if (prevProps.items && props.items && prevProps.items.length < props.items.length) {
    return {scrollTop: document.documentElement.scrollTop};
  }
  return null;
}

export function restoreScrollSnapshot(snapshot) {
  if (snapshot) {
    document.documentElement.scrollTop = snapshot.scrollTop;
  }
}
