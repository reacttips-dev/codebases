import React, { ReactNode } from 'react';
import * as serverRenderingUtils from '../../../helpers/serverRenderingUtils';
import { debounce } from '../../modules/debounce';

function isMobile() {
  return serverRenderingUtils.isIOS() || serverRenderingUtils.isAndroidChrome();
}

type Size = {
  width: number;
  height: number;
};

const initialState = isMobile()
  ? {
      width: 600,
      height: 800,
    }
  : { width: 1366, height: 768 };

const BrowserSizeContext = React.createContext(initialState);

export const useBrowserSize = () => React.useContext(BrowserSizeContext);
export const BrowserSizeProvider = ({ children }: { children: ReactNode }) => {
  const [size, setSize] = React.useState<Size>(initialState);
  const setBrowserSize = debounce(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, 50);

  React.useEffect(() => {
    if (!serverRenderingUtils.windowUndefined()) {
      setBrowserSize();
      window.addEventListener('resize', setBrowserSize);
    }
    return () => {
      if (!serverRenderingUtils.windowUndefined()) {
        window.removeEventListener('resize', setBrowserSize);
      }
    };
  }, []);
  return (
    <BrowserSizeContext.Provider value={size}>
      {children}
    </BrowserSizeContext.Provider>
  );
};
