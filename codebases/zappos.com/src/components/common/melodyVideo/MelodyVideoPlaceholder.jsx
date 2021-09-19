// For Videos on PDP (or other places we don't want to autoload), we want to be able to increase pagespeed by deferring video loads via user interaction. This wrapper allows
// us to acheive that without affecting video components on other pages

import { useState } from 'react';

import css from 'styles/components/landing/melodyVideo/melodyVideoPlaceholder.scss';

const MelodyVideoPlaceholder = ({ showPlaceholder, children, widthValue = '100%', heightValue = '100%' } = {}) => {
  const [userClickedToPlay, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
  };

  if (!showPlaceholder) {
    return children;
  } else {
    return (
    <>
      {
        userClickedToPlay
          ?
          children
          :
          <div style={{ width: widthValue, height: heightValue }} className={css.wrapper}>
            <button
              type="button"
              className={css.play}
              aria-label="Play Product Video"
              onClick={handleClick}
            />
          </div>
      }
    </>
    );
  }
};

export default MelodyVideoPlaceholder;
