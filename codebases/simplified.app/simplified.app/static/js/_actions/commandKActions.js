import { SHOW_COMMANDK_SEARCH, HIDE_COMMANDK_SEARCH } from "./types";

// Show searchbar
export const showCommandKSearch = () => {
  return {
    type: SHOW_COMMANDK_SEARCH,
  };
};

// Hide searchbar
export const hideCommandKSearch = () => {
  return {
    type: HIDE_COMMANDK_SEARCH,
  };
};
