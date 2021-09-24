import React, { useCallback, useRef } from 'react';
import useApplication from '../../hooks/useApplication';

export default React.forwardRef(function CodeMirror({ className }, ref) {
  const application = useApplication();

  // Maintain a ref to the previous node so we can clean it up when the node changes.
  const prevNode = useRef();
  const containerRefCallback = useCallback(
    (node) => {
      if (ref) {
        ref.current = node;
      }

      if (prevNode.current && prevNode.current !== node) {
        prevNode.current.removeChild(application.editorElement);
      }

      if (node) {
        node.appendChild(application.editorElement);
      }

      prevNode.current = node;
    },
    [application, ref],
  );

  // Maintain a ref to the previously passed in ref so we can rearrange when the
  // passed in ref changes.
  const prevRef = useRef(ref);
  if (prevRef.current !== ref) {
    if (ref) {
      ref.current = prevRef.current.current;
    }
    prevRef.current.current = undefined;
    prevRef.current = ref;
  }

  return <div className={className} ref={containerRefCallback} />;
});
