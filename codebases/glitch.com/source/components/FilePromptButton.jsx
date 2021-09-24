import React, { useRef } from 'react';

export default function FilePromptButton({ children, accept, multiple, onSelection }) {
  const inputRef = useRef();

  return (
    <>
      <button
        className="button"
        onClick={() => {
          inputRef.current.click();
        }}
      >
        {children}
      </button>

      <input
        ref={inputRef}
        type="file"
        onChange={(e) => {
          onSelection(Array.from(e.target.files));
        }}
        accept={accept}
        multiple={multiple}
        hidden
      />
    </>
  );
}
