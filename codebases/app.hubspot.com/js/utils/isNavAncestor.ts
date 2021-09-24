import navQuerySelector from './navQuerySelector';
export default function isNavAncestor(element, potentialAncestor) {
  if (element === null || potentialAncestor === null || element === potentialAncestor || element === document.body) return false;
  var navRoot = navQuerySelector();
  var parent = element;

  while (parent !== navRoot && parent != null && parent.parentElement != null && parent !== potentialAncestor) {
    parent = parent.parentElement;
  }

  return parent === potentialAncestor;
}