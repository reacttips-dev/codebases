import React from 'react';

export default function AssetsBlankSlate() {
  return (
    <div className="blank-slate blank-slate-with-editor-helper">
      <div className="welcome-message welcome-message-with-image">
        <div>
          <p>
            <strong>No Assets Yet</strong>
          </p>
          <p>
            Drag files here to use them in your project.
            <br />
            Add images, music, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
