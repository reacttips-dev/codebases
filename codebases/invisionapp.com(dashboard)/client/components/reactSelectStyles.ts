import { createGlobalStyle } from 'styled-components'

// Brought over from the css file in the package so we don't have to load css manually
export const GlobalStyle = createGlobalStyle`
  /**
  * React Select
  * ============
  * Created by Jed Watson and Joss Mackison for KeystoneJS, http://www.keystonejs.com/
  * https://twitter.com/jedwatson https://twitter.com/jossmackison https://twitter.com/keystonejs
  * MIT License: https://github.com/JedWatson/react-select
  */
  .Select {
    position: relative;
  }
  .Select input::-webkit-contacts-auto-fill-button,
  .Select input::-webkit-credentials-auto-fill-button {
    display: none !important;
  }
  .Select input::-ms-clear {
    display: none !important;
  }
  .Select input::-ms-reveal {
    display: none !important;
  }
  .Select,
  .Select div,
  .Select input,
  .Select span {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .Select.is-disabled .Select-arrow-zone {
    cursor: default;
    opacity: 0.35;
    pointer-events: none;
  }
  .Select.is-disabled > .Select-control {
    background-color: #f9f9f9;
  }
  .Select.is-disabled > .Select-control:hover {
    box-shadow: none;
  }
  .Select.is-open > .Select-control {
    border-color: #b3b3b3 #ccc #d9d9d9;
    background: #fff;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .Select.is-open > .Select-control .Select-arrow {
    top: -2px;
    border-width: 0 5px 5px;
    border-color: transparent transparent #999;
  }
  .Select.is-searchable.is-open > .Select-control {
    cursor: text;
  }
  .Select.is-searchable.is-focused:not(.is-open) > .Select-control {
    cursor: text;
  }
  .Select.is-focused > .Select-control {
    background: #fff;
  }
  .Select.is-focused:not(.is-open) > .Select-control {
    border-color: #007eff;
    background: #fff;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 0 3px rgba(0, 126, 255, 0.1);
  }
  .Select.has-value.is-clearable.Select--single > .Select-control .Select-value {
    padding-right: 42px;
  }
  .Select.has-value.Select--single > .Select-control .Select-value .Select-value-label,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value .Select-value-label {
    color: #333;
  }
  .Select.has-value.Select--single > .Select-control .Select-value a.Select-value-label,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value a.Select-value-label {
    cursor: pointer;
    text-decoration: none;
  }
  .Select.has-value.Select--single > .Select-control .Select-value a.Select-value-label:hover,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value a.Select-value-label:hover,
  .Select.has-value.Select--single > .Select-control .Select-value a.Select-value-label:focus,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value a.Select-value-label:focus {
    color: #007eff;
    outline: none;
    text-decoration: underline;
  }
  .Select.has-value.Select--single > .Select-control .Select-value a.Select-value-label:focus,
  .Select.has-value.is-pseudo-focused.Select--single > .Select-control .Select-value a.Select-value-label:focus {
    background: #fff;
  }
  .Select.has-value.is-pseudo-focused .Select-input {
    opacity: 0;
  }
  .Select.is-open .Select-arrow,
  .Select .Select-arrow-zone:hover > .Select-arrow {
    border-top-color: #666;
  }
  .Select.Select--rtl {
    direction: rtl;
    text-align: right;
  }
  .Select-control {
    position: relative;
    display: table;
    overflow: hidden;
    width: 100%;
    height: 36px;
    border: 1px solid #ccc;
    border-color: #d9d9d9 #ccc #b3b3b3;
    background-color: #fff;
    border-collapse: separate;
    border-radius: 4px;
    border-spacing: 0;
    color: #333;
    cursor: default;
    outline: none;
  }
  .Select-control:hover {
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
  }
  .Select-control .Select-input:focus {
    background: #fff;
    outline: none;
  }
  .Select-placeholder,
  .Select--single > .Select-control .Select-value {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    max-width: 100%;
    padding-right: 10px;
    padding-left: 10px;
    color: #aaa;
    line-height: 34px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .Select-input {
    height: 34px;
    padding-right: 10px;
    padding-left: 10px;
    vertical-align: middle;
  }
  .Select-input > input {
    display: inline-block;
    width: 100%;
    /* For IE 8 compatibility */
    padding: 8px 0 12px;
    border: 0 none;
    margin: 0;
    /* For IE 8 compatibility */
    -webkit-appearance: none;
    background: none transparent;
    box-shadow: none;
    cursor: default;
    font-family: inherit;
    font-size: inherit;
    line-height: 17px;
    outline: none;
  }
  .is-focused .Select-input > input {
    cursor: text;
  }
  .has-value.is-pseudo-focused .Select-input {
    opacity: 0;
  }
  .Select-control:not(.is-searchable) > .Select-input {
    outline: none;
  }
  .Select-loading-zone {
    position: relative;
    display: table-cell;
    width: 16px;
    cursor: pointer;
    text-align: center;
    vertical-align: middle;
  }
  .Select-loading {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border: 2px solid #ccc;
    border-right-color: #333;
    -webkit-animation: Select-animation-spin 400ms infinite linear;
    -o-animation: Select-animation-spin 400ms infinite linear;
    animation: Select-animation-spin 400ms infinite linear;
    border-radius: 50%;
    vertical-align: middle;
  }
  .Select-clear-zone {
    position: relative;
    display: table-cell;
    width: 17px;
    -webkit-animation: Select-animation-fadeIn 200ms;
    -o-animation: Select-animation-fadeIn 200ms;
    animation: Select-animation-fadeIn 200ms;
    color: #999;
    cursor: pointer;
    text-align: center;
    vertical-align: middle;
  }
  .Select-clear-zone:hover {
    color: #D0021B;
  }
  .Select-clear {
    display: inline-block;
    font-size: 18px;
    line-height: 1;
  }
  .Select--multi .Select-clear-zone {
    width: 17px;
  }
  .Select-arrow-zone {
    position: relative;
    display: table-cell;
    width: 25px;
    padding-right: 5px;
    cursor: pointer;
    text-align: center;
    vertical-align: middle;
  }
  .Select--rtl .Select-arrow-zone {
    padding-right: 0;
    padding-left: 5px;
  }
  .Select-arrow {
    position: relative;
    display: inline-block;
    width: 0;
    height: 0;
    border-width: 5px 5px 2.5px;
    border-style: solid;
    border-color: #999 transparent transparent;
  }
  .Select-control > *:last-child {
    padding-right: 5px;
  }
  .Select--multi .Select-multi-value-wrapper {
    display: inline-block;
  }
  .Select .Select-aria-only {
    position: absolute;
    display: inline-block;
    overflow: hidden;
    width: 1px;
    height: 1px;
    margin: -1px;
    clip: rect(0, 0, 0, 0);
    float: left;
  }
  @-webkit-keyframes Select-animation-fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes Select-animation-fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .Select-menu-outer {
    position: absolute;
    z-index: 1;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-top-color: #e6e6e6;
    margin-top: -1px;
    background-color: #fff;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
    -webkit-overflow-scrolling: touch;
  }
  .Select-menu {
    max-height: 198px;
    overflow-y: auto;
  }
  .Select-option {
    display: block;
    box-sizing: border-box;
    padding: 8px 10px;
    background-color: #fff;
    color: #666666;
    cursor: pointer;
  }
  .Select-option:last-child {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .Select-option.is-selected {
    background-color: #f5faff;
    /* Fallback color for IE 8 */
    background-color: rgba(0, 126, 255, 0.04);
    color: #333;
  }
  .Select-option.is-focused {
    background-color: #ebf5ff;
    /* Fallback color for IE 8 */
    background-color: rgba(0, 126, 255, 0.08);
    color: #333;
  }
  .Select-option.is-disabled {
    color: #cccccc;
    cursor: default;
  }
  .Select-noresults {
    display: block;
    box-sizing: border-box;
    padding: 8px 10px;
    color: #999999;
    cursor: default;
  }
  .Select--multi .Select-input {
    padding: 0;
    margin-left: 10px;
    vertical-align: middle;
  }
  .Select--multi.Select--rtl .Select-input {
    margin-right: 10px;
    margin-left: 0;
  }
  .Select--multi.has-value .Select-input {
    margin-left: 5px;
  }
  .Select--multi .Select-value {
    display: inline-block;
    border: 1px solid #c2e0ff;
    /* Fallback color for IE 8 */
    border: 1px solid rgba(0, 126, 255, 0.24);
    margin-top: 5px;
    margin-left: 5px;
    background-color: #ebf5ff;
    /* Fallback color for IE 8 */
    background-color: rgba(0, 126, 255, 0.08);
    border-radius: 2px;
    color: #007eff;
    font-size: 0.9em;
    line-height: 1.4;
    vertical-align: top;
  }
  .Select--multi .Select-value-icon,
  .Select--multi .Select-value-label {
    display: inline-block;
    vertical-align: middle;
  }
  .Select--multi .Select-value-label {
    border-bottom-right-radius: 2px;
    border-top-right-radius: 2px;
    cursor: default;
  }
  .Select--multi a.Select-value-label {
    color: #007eff;
    cursor: pointer;
    text-decoration: none;
  }
  .Select--multi a.Select-value-label:hover {
    text-decoration: underline;
  }
  .Select--multi .Select-value-icon {
    padding: 2px 5px;
    padding: 1px 5px 3px;
    border-right: 1px solid #c2e0ff;
    /* Fallback color for IE 8 */
    border-right: 1px solid rgba(0, 126, 255, 0.24);
    border-bottom-left-radius: 2px;
    border-top-left-radius: 2px;
    cursor: pointer;
  }
  .Select--multi .Select-value-icon:hover,
  .Select--multi .Select-value-icon:focus {
    background-color: #d8eafd;
    /* Fallback color for IE 8 */
    background-color: rgba(0, 113, 230, 0.08);
    color: #0071e6;
  }
  .Select--multi .Select-value-icon:active {
    background-color: #c2e0ff;
    /* Fallback color for IE 8 */
    background-color: rgba(0, 126, 255, 0.24);
  }
  .Select--multi.Select--rtl .Select-value {
    margin-right: 5px;
    margin-left: 0;
  }
  .Select--multi.Select--rtl .Select-value-icon {
    border-right: none;
    border-left: 1px solid #c2e0ff;
    /* Fallback color for IE 8 */
    border-left: 1px solid rgba(0, 126, 255, 0.24);
  }
  .Select--multi.is-disabled .Select-value {
    border: 1px solid #e3e3e3;
    background-color: #fcfcfc;
    color: #333;
  }
  .Select--multi.is-disabled .Select-value-icon {
    border-right: 1px solid #e3e3e3;
    cursor: not-allowed;
  }
  .Select--multi.is-disabled .Select-value-icon:hover,
  .Select--multi.is-disabled .Select-value-icon:focus,
  .Select--multi.is-disabled .Select-value-icon:active {
    background-color: #fcfcfc;
  }
  @keyframes Select-animation-spin {
    to {
      transform: rotate(1turn);
    }
  }
  @-webkit-keyframes Select-animation-spin {
    to {
      -webkit-transform: rotate(1turn);
    }
  }

`
