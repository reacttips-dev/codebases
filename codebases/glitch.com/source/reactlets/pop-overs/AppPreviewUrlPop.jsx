import React from 'react';
import { normalize } from 'path';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';

export default React.forwardRef(function AppPreviewUrlPop(_props, ref) {
  const application = useApplication();
  const publishedUrl = useObservable(application.publishedUrl);
  const path = useObservable(application.appPreviewUrlPath);

  const handleChange = (e) => {
    const normalizedPath = normalize(e.target.value);
    const newPath = normalizedPath.charAt(0) !== '/' ? `/${normalizedPath}` : normalizedPath;
    application.appPreviewUrlPath(newPath);
    application.updateAppPreview();
  };

  const onResetClick = () => {
    application.appPreviewUrlPath('/');
    application.updateAppPreview();
  };

  return (
    <dialog className="pop-over app-preview-url-pop" ref={ref}>
      <section className="info">
        <h1>Change URL</h1>
      </section>
      <section className="action">
        <p>{publishedUrl}</p>
        <div className="input-wrap">
          <input className="input" value={path} onChange={handleChange} />
        </div>
      </section>
      <section className="info">
        <div className="button-wrap">
          <button className="button" onClick={onResetClick}>
            Reset
          </button>
        </div>
      </section>
    </dialog>
  );
});
