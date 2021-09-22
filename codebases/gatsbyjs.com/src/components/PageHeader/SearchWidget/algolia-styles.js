/** @jsx jsx */
import { css } from "@emotion/core"

const algoliaStyles = t => css`
  .DocSearch--active {
    overflow: hidden !important;
  }

  .DocSearch.DocSearch-Container {
    height: 100vh;
    left: 0;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 10001;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.25);
    padding: ${t.space[8]};
  }

  .DocSearch .DocSearch-Modal {
    font-family: ${t.fonts.body};
    margin: 0 auto;
    width: 100%;
    max-width: 47.375rem;
    display: flex;
    flex-direction: column;
    min-height: 0;
    border-radius: ${t.radii[4]};
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    background: #fff;
  }

  .DocSearch .DocSearch-MagnifierLabel {
    flex: none;
    width: 1.5rem;
    height: 1.5rem;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z' fill='%23663399'/%3E%3C/svg%3E%0A");
    margin-right: ${t.space[4]};
  }
  .DocSearch .DocSearch-MagnifierLabel svg {
    display: none;
  }
  .DocSearch .DocSearch-Container--Stalled .DocSearch-MagnifierLabel {
    display: none;
  }

  .DocSearch .DocSearch-Input {
    appearance: none;
    background: transparent;
    height: 4.5rem;
    font-size: 1rem;
    font-weight: 500;
    color: black;
    padding: 0;
    flex: auto;
    min-width: 0;
    border-width: 0;
    margin: 0;
  }
  .DocSearch .DocSearch-Input:focus {
    outline: 2px dotted transparent;
  }
  .DocSearch .DocSearch-Input::-webkit-search-cancel-button,
  .DocSearch .DocSearch-Input::-webkit-search-decoration,
  .DocSearch .DocSearch-Input::-webkit-search-results-button,
  .DocSearch .DocSearch-Input::-webkit-search-results-decoration {
    display: none;
  }

  .DocSearch .DocSearch-Cancel {
    display: none !important;
  }
  .DocSearch .DocSearch-Cancel::before {
    content: "esc";
    color: #9ca3af;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .DocSearch .DocSearch-Commands {
    display: none;
  }
  .DocSearch .DocSearch-Reset svg {
    display: none;
  }
  .DocSearch-Form .DocSearch-Reset {
    box-shadow: 0 0 0 1px ${t.colors.grey[30]};
    border-radius: ${t.radii[3]};
    color: ${t.colors.grey[50]};
    font-size: ${t.fontSizes[1]};
    line-height: ${t.lineHeights.solid};
    padding: ${t.space[3]};
  }
  .DocSearch-Form .DocSearch-Reset:focus {
    border-color: ${t.colors.purple[60]};
    background-color: ${t.colors.grey[5]};
  }
  .DocSearch .DocSearch-Reset::before {
    content: "esc";
  }
  /* Highlight all marks, not just .DocSearch-Hit[aria-selected=true] mark */
  .DocSearch .DocSearch-Hits mark {
    text-decoration: underline;
  }
  .DocSearch .DocSearch-Hit {
    // reset the global styles for li (hello typography.js (i think))
    margin-bottom: 0;
    // increase the default Docsearch theme padding-bottom
    padding-bottom: ${t.space[3]};
  }
  .DocSearch .DocSearch-Hit > a {
    border-radius: ${t.radii[3]};
    padding-left: 0;
  }
  .DocSearch .DocSearch-Hit-source {
    color: ${t.colors.grey[90]};
    margin: ${t.space[4]} 0;
    padding: 0;
  }
  .DocSearch .DocSearch-Hit-Container:first-child {
    margin-left: ${t.space[7]};
  }
  .DocSearch .DocSearch-Hit-icon {
    flex: none;
  }
  .DocSearch .DocSearch-Hit-content-wrapper {
    margin: 0 ${t.space[5]};
  }

  .DocSearch .DocSearch-NoResults {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 0;
    width: 100%;
  }

  .DocSearch .DocSearch-SearchBar {
    padding: ${t.space[2]} ${t.space[6]};
  }

  .DocSearch .DocSearch-Form {
    box-shadow: none;
    border-bottom: 1px solid ${t.colors.grey[30]};
    border-radius: 0;
    padding: 0;
    padding-left: ${t.space[2]};
  }

  .DocSearch .DocSearch-Dropdown {
    padding: 0 ${t.space[6]};
  }

  .DocSearch .DocSearch-Help {
    text-align: left;
  }
  .DocSearch .DocSearch-StartScreen {
    margin: 0;
  }

  .DocSearch .DocSearch-Screen-Icon {
    display: none;
  }

  .DocSearch .DocSearch-Title::after {
    content: " 😕";
  }

  .DocSearch .DocSearch-Footer {
    margin: 0 ${t.space[6]};
    padding: ${t.space[6]} 0;
    height: auto;
    width: calc(100% - (2 * ${t.space[6]}));
    box-shadow: none;
    border-top: 1px solid ${t.colors.grey[30]};
  }

  .DocSearch-LoadingIndicator {
    display: none;
  }
`

export default algoliaStyles
