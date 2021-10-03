import React, { useEffect, useState } from "react";
import { faBold } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { getFontVariants } from "../../../../_utils/common";
import { TldrEditorAction } from "../../../common/statelessView";
import {
  comboKey1,
  FONT_BOLD_WEIGHT,
  FONT_REGULAR_WEIGHT,
} from "../../constants";
import { find } from "lodash";

const TLDRBold = (props) => {
  const { activeElement } = props;

  const [isBold, setIsBold] = useState(
    activeElement.format?.fontWeight >= FONT_BOLD_WEIGHT
  );
  const [fontFamily, setFontFamily] = useState(
    activeElement.format?.fontFamily
  );

  useEffect(() => {
    setIsBold(activeElement.format?.fontWeight >= FONT_BOLD_WEIGHT);
    setFontFamily(activeElement.format?.fontFamily);
  }, [activeElement.format]);

  function isBoldVariantAvailable(fontFamily) {
    const { fonts } = props;

    const variants = getFontVariants(fonts, fontFamily);

    return variants.some((variant) => {
      const variantNumber = Number(variant);
      if (isNaN(variantNumber)) {
        return false;
      } else {
        return variantNumber >= FONT_BOLD_WEIGHT;
      }
    });
  }

  function getBoldVariant(fontFamily) {
    const { fonts } = props;
    const variants = getFontVariants(fonts, fontFamily)?.sort();
    const variant = find(variants, (variant) => {
      let variantNumber = Number(variant);
      if (!isNaN(Number(variantNumber))) {
        return variantNumber >= FONT_BOLD_WEIGHT;
      }
    });
    return Number(variant) || FONT_BOLD_WEIGHT;
  }

  function onBoldClick(action, value) {
    const { canvasRef, activeElement } = props;
    const { fontWeight: currentFontWeight, fontFamily } = activeElement.format;
    let fontWeight =
      currentFontWeight >= FONT_BOLD_WEIGHT
        ? FONT_REGULAR_WEIGHT
        : getBoldVariant(fontFamily);

    canvasRef.handler.textHandler.bold(fontWeight);
  }

  return (
    <TldrEditorAction
      action={"bold"}
      icon={faBold}
      title={"Bold"}
      showHover={true}
      callback={onBoldClick}
      active={isBold}
      disabled={!isBoldVariantAvailable(fontFamily)}
      shortcutKeys={[comboKey1, "B"]}
    />
  );
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
  fonts: state.app.fonts,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TLDRBold);
