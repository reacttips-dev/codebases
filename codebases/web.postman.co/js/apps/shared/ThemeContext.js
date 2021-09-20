import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { light, dark } from '@postman/aether';

const theme = {
  light, dark
};

// wrapper Theme component which exposes the design tokens based on current theme
export const Theme = ({ children }) => {

  const [currentTheme, setCurrentTheme] = React.useState({
    name: pm.settings.getSetting('postmanTheme'),
    ...theme[pm.settings.getSetting('postmanTheme')]
  });
  useEffect(() => {
    pm.settings.on('setSetting:postmanTheme', () => {
        setCurrentTheme({
          name: pm.settings.getSetting('postmanTheme'),
          ...theme[pm.settings.getSetting('postmanTheme')]
        });
    });
  }, []);
  return <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>;
};
