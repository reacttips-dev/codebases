import React from "react";
import { KEYBOARD_SHORTCUTS_LIST } from "../details/constants";
import {
  StyledKeyboardShortcutsCategories,
  StyledKeyboardShortcutsSubcategories,
} from "../styled/styles";

function TldrKeyboardShortcutsList() {
  return (
    <div>
      <ListOfMainCategories />
    </div>
  );
}

function ListOfMainCategories() {
  return KEYBOARD_SHORTCUTS_LIST.map((category, index) => (
    <StyledKeyboardShortcutsCategories key={index}>
      {category.title}
      <hr className="kbd-shortcuts-panel-hr" />
      <ListOfSubCategories subCategories={category.shortcuts} />
    </StyledKeyboardShortcutsCategories>
  ));
}

function ListOfSubCategories(props) {
  const { subCategories } = props;
  return subCategories.map((subCategory, index) => (
    <StyledKeyboardShortcutsSubcategories key={index}>
      <div className="keyboard-shortcuts">
        {subCategory.title}
        <ListOfShortcuts
          keys={subCategory.keys}
          i={index}
          showOR={
            subCategory.title.startsWith("Move") ||
            subCategory.title === "Change Artboard"
          }
        />
      </div>
      <hr className="kbd-shortcuts-panel-hr" />
    </StyledKeyboardShortcutsSubcategories>
  ));
}

function ListOfShortcuts(props) {
  const { keys, i, showOR } = props;
  return (
    <div key={i} className="keyboard-shortcuts-keys">
      {keys.map((key, index) => (
        <>
          <kbd key={index}>{key}</kbd>
          {showOR && index < keys.length - 1 && <p>/</p>}
        </>
      ))}
    </div>
  );
}

export default TldrKeyboardShortcutsList;
