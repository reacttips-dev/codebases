import React from "react";
import GlobalSearchUiProvider from "./components/GlobalSearchUiProvider";
import GlobalSearchUi from "./components/GlobalSearchUi";
import { GlobalSearchUiProps } from "./types/GlobalSearchUiProps";

export const GlobalSearch = (props: GlobalSearchUiProps) => {
  return (
    <GlobalSearchUiProvider {...props}>
      <GlobalSearchUi />
    </GlobalSearchUiProvider>
  );
};

export default GlobalSearch;
