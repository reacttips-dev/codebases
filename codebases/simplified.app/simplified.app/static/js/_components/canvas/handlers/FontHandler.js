import { fabric } from "fabric";
import {
  FABRIC_GROUP_ELEMENT,
  FABRIC_ITEXT_ELEMENT,
  FABRIC_TEXTBOX_ELEMENT,
  FABRIC_TEXT_TYPES,
} from "../../details/constants";
var FontFaceObserver = require("fontfaceobserver");
export default class FontHandler {
  constructor(handler) {
    this.handler = handler;

    this.cachedFont = {}; // It keeps track of loaded font in application
    // Default options
    this.options = {
      clearCache: false,
    };
  }

  setOptions = (options) => {
    this.options = Object.assign({}, this.options, options);
  };

  /**
   * Check font is already cached or not
   * @param {*} fontName
   */
  isCachedFontVariant = (fontName, variant) => {
    return this.cachedFont[fontName]?.[variant];
  };

  /**
   * Add font to cache
   * @param {*} fontName
   */
  cacheFontVariant = (fontName, variant) => {
    this.cachedFont[fontName] = {
      ...this.cachedFont[fontName],
      [variant]: true,
    };
  };

  getTextObjectsFromGroup = (groupObj, fontName) => {
    let textObjects = [];
    groupObj._objects &&
      groupObj._objects.forEach((obj, index) => {
        if (
          FABRIC_TEXT_TYPES.includes(obj.type) &&
          obj.fontFamily === fontName
        ) {
          textObjects.push(obj);
        } else if (obj.type === FABRIC_GROUP_ELEMENT) {
          textObjects = textObjects.concat(this.getTextObjectsFromGroup(obj));
        }
      });
    return textObjects;
  };

  /**
   * Get all text element from canvas which having matching fontName
   */
  getTextObjects = (fontName) => {
    let allObjects = this.handler.getObjects();
    let textObjects = [];

    allObjects.forEach((object, index) => {
      if (
        FABRIC_TEXT_TYPES.includes(object.type) &&
        object.fontFamily === fontName
      ) {
        textObjects.push(object);
      } else if (object.type === FABRIC_GROUP_ELEMENT) {
        textObjects = textObjects.concat(
          this.getTextObjectsFromGroup(object, fontName)
        );
      }
    });
    return textObjects;
  };

  clearFontCache = (obj, font) => {
    fabric.util.clearFabricFontCache(font);
    obj.initDimensions();
    obj._forceClearCache = true;
    if (obj?.group) {
      const fGroupObj = obj.group;
      fGroupObj.addWithUpdate();
    }
    this.handler.canvas.requestRenderAll();
  };

  /**
   * To forcefully render fabricjs's text element, it require to clear its cache
   */
  clearTextElementCache = (fontName) => {
    let textElements = this.getTextObjects(fontName);
    let font, customFont;

    textElements.forEach((obj, index) => {
      if (obj.styleHas("fontFamily")) {
        customFont = this.getITextFontFamily(obj);
      }

      if (Array.isArray(customFont)) {
        customFont.forEach((myFont) => {
          font = new FontFaceObserver(myFont, { weight: obj.fontWeight });
          font.load(null, 5000).then(() => {
            this.clearFontCache(obj, myFont);
          });
        });
      } else {
        font = new FontFaceObserver(fontName, { weight: obj.fontWeight });
        font.load(null, 5000).then(() => {
          this.clearFontCache(obj, fontName);
        });
      }
    });
  };

  getITextFontFamily = (obj) => {
    let fonts = [];
    if (
      !obj ||
      obj.type !== FABRIC_ITEXT_ELEMENT ||
      obj.type !== FABRIC_TEXTBOX_ELEMENT
    ) {
      return;
    }

    const selectionStyles = obj.getSelectionStyles(0, obj.text.length);
    selectionStyles.forEach((element) => {
      if (element.fontFamily) {
        fonts.push(element.fontFamily);
      }
    });
    fonts = [...new Set(fonts)];

    return fonts;
  };

  loadFontFileInDOM = (fontFamily, url, fontId) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let css = xhr.responseText;
        css = css.replace(/}/g, "fontdisplay: swap; }");

        const head = document.getElementsByTagName("head")[0];
        const style = document.createElement("style");
        style.id = fontId || fontFamily;
        style.dataset.type = "fontFaceStyle";

        let styleExists = document.getElementById(`${style.id}`);
        if (!styleExists) {
          style.appendChild(document.createTextNode(css));
          head.appendChild(style);
        } else {
          // style.parentNode.replaceChild(document.createTextNode(css), style);
        }

        if (this.options.clearCache) {
          this.clearTextElementCache(fontFamily);
        }
      }
    };
    xhr.send();
  };

  /**
   * get list of font variant which supposed to be get added
   * @param {*} font
   */
  getVariantList = (font) => {
    // Load variants if there is any
    let variants = [];

    if (font.payload && font.payload.variants) {
      variants = font.payload.variants;
    } else if (font.variants) {
      variants = font.variants;
    }

    // Filter italic variants
    // As we are supporting with italic property
    variants = variants.filter(
      (variant, index) => !variant.toString().includes("italic")
    );

    return variants;
  };

  prepareFontFileURL = (font, variants) => {
    // Clean/Make font name to support URL
    let urlFamilyName = font.family.replace(/ +/g, "+");

    let allVariants = "";
    variants.forEach((variant, index) => {
      if (
        this.isCachedFontVariant(
          font.family,
          variant === "regular" ? 400 : Number(variant)
        )
      ) {
        return;
      }

      if (variant === "regular") {
        allVariants += `400`;
      } else {
        allVariants += `${variant}`;
      }
      if (index + 1 < variants.length) {
        allVariants += ";";
      }
    });

    if (allVariants) {
      if (allVariants.slice(-1) === ";") {
        allVariants = allVariants.slice(0, -1);
      }
      urlFamilyName = `${urlFamilyName}:wght@${allVariants}`;
    }

    return `https://fonts.googleapis.com/css2?family=${urlFamilyName}&display=swap`;
  };

  loadGoogleFont = (font) => {
    // Load variants if there is any
    let variants = this.getVariantList(font);

    const fontFileURL = this.prepareFontFileURL(font, variants);
    // Fetch font file and its css to DOM
    this.loadFontFileInDOM(font.family, fontFileURL, font.id);
  };

  getFontFaceCSS = (font) => {
    // Load variants if there is any
    const variants = this.getVariantList(font);

    let fontFaceCSS = "";
    variants.forEach((variant, index) => {
      let fontWeight = variant;
      if (variant === "regular") {
        fontWeight = 400;
      }

      if (this.isCachedFontVariant(font.family, Number(fontWeight))) {
        return;
      }

      fontFaceCSS += [
        `@font-face {\n`,
        `\tfont-family: '`,
        font.family,
        `';\n`,
        `\tfont-style: normal;\n`,
        `\tfont-weight: ${fontWeight};\n`,
        `\tsrc: url('`,
        font.payload.files[variant],
        "');\n",
        "}\n",
      ].join("");
    });

    return fontFaceCSS;
  };

  createFontFaceStyleNode = (fontName, cssText) => {
    let style = document.createElement("style");
    style.id = fontName;
    style.dataset.type = "fontFaceStyle";
    style.setAttribute("type", "text/css");
    style.innerHTML = cssText;

    return style;
  };

  addFontFaceStyleIntoDOM = (styleNode) => {
    const head = document.getElementsByTagName("head")[0];
    head.appendChild(styleNode);
  };

  loadCustomFont = (font) => {
    let fontFaceCSS = this.getFontFaceCSS(font);

    let fontFaceStyleNode = this.createFontFaceStyleNode(
      font?.id || font.family,
      fontFaceCSS
    );

    const fontFaceStyleNodeExists = document.getElementById(
      fontFaceStyleNode.id
    );

    if (!fontFaceStyleNodeExists) {
      this.addFontFaceStyleIntoDOM(fontFaceStyleNode);
    } else {
    }

    if (this.options.clearCache) {
      this.clearTextElementCache(font.family);
    }
  };

  activateFontsVariants = (font) => {
    // Load variants if there is any
    const variants = this.getVariantList(font);

    let fontsToObserve = {};
    variants.forEach((variant, index) => {
      fontsToObserve[font.family] = {
        weight: variant === "regular" ? 400 : Number(variant),
      };
    });

    var observers = [];

    // Make one observer for each font,
    // by iterating over the data we already have
    Object.keys(fontsToObserve).forEach(function (family) {
      var data = fontsToObserve[family];
      var obs = new FontFaceObserver(family, data);
      observers.push(obs.load(null, 5000));
    });

    Promise.all(observers)
      .then((fonts) => {
        fonts.forEach((font, index) => {
          this.cacheFontVariant(font.family, font.weight);
        });
      })
      .catch(function (err) {
        console.warn("Some critical font are not available:", err);
      });
  };

  addFont = (font) => {
    if (!font) return;
    switch (font.source) {
      case "google":
        this.loadGoogleFont(font);
        break;
      case "custom":
        this.loadCustomFont(font);
        break;
      case "typkit":
        return;
      default:
        console.error("Font has been provided from wrong source");
        return;
    }

    // Activate font variant of all loaded fonts
    this.activateFontsVariants(font);
  };

  /**
   * Add font list
   * It fetches the respective font file and add into the DOM
   * @param {*} fontList
   */
  addFonts = (fontList) => {
    if (!fontList || fontList.length === 0) {
      return;
    }

    fontList.forEach((font) => {
      this.addFont(font);
    });
  };
}
