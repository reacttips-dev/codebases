// @todo -> Split this file and moke it more modularize
import React, { Component } from 'react';
import * as monaco from '@postman/monaco-editor/esm/vs/editor/editor.api';
import ThemeManager from '@postman-app-monolith/renderer/js/controllers/theme/ThemeManager.js';
import { Button } from '@postman/aether';
import { Tabs, Tab } from '@postman-app-monolith/renderer/js/components/base/Tabs';
import { Button as LegacyButton } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import { Dropdown, DropdownButton, DropdownMenu, MenuItem } from '@postman-app-monolith/renderer/js/components/base/Dropdowns';
import vkbeautify from '@postman-app-monolith/renderer/js/utils/vkbeautify';
import KeyMaps from '@postman-app-monolith/renderer/js/components/base/keymaps/KeyMaps';
import getKeyMaps from './keymaps';
import LoadingIndicator from '@postman-app-monolith/renderer/js/components/base/LoadingIndicator';
import ClipboardHelper from '@postman-app-monolith/renderer/js/utils/ClipboardHelper';
import { themes } from './themes';
import registerTokenizer from './tokenizer/textmate.tokenizer';
import {
  CUSTOMIZABLE_TEXT_EDITOR_SETTINGS, EDITOR_FEEDBACK_STATES, LANGUAGE_PLAINTEXT,
  THEME_MAP, MONACO_THEMES, VIEW_MODES, TEXT_EDITOR_VALIDATION_MESSAGE_LEVEL
} from './constants';
import { getMonacoLanguageName, transformResponseForLanguage } from './language';
import { getSettingValue } from './settings';
import { createOverflowingWidgetsContainerNode } from './dom';

let monacoEditorOptionsMap = {};
let monacoModelMarkerSeverityMap = {};
let isMonacoLanguageRegistrySubscribed = false;

// Boolean value representing if the global handlers for monaco have been initialized.
let areGlobalOptionsInitialized = false;

/**
 * Register all of the available themes
 * @param {*} monaco
 * @param {*} themes
 */
export function registerThemes (themes) {
  if (!monaco || !themes.length) { return; }
  themes.forEach((theme) => {
    monaco.editor.defineTheme(theme.id, theme.props);
  });
}

/**
 * Sets up handlers to listen to theme changes on the app and update editor theme correspondingly
 *
 */
function initializeTheme () {
  if (!monaco) {
    return;
  }

  // Gets the latest theme from the theme manager and updates the theme on monaco editor
  // Note: This updates the theme for all instances of monaco editors.
  monaco.editor.setTheme(THEME_MAP[ThemeManager.getCurrentTheme()]);

  // listen to theme changes and update
  pm.mediator.on('themeChange', updateMonacoTheme);
}

/**
 * Register XML formatter to monaco.
 *
 * @param {*} monaco
 */
function registerXmlFormatter () {
  // register formatter for xml
  // @todo: move the register to a better place
  monaco.languages.registerDocumentFormattingEditProvider('xml', {
    provideDocumentFormattingEdits (textModel) {
      let textModelOptions = textModel.getOptions();

      // step param of vkbeautify takes in a number if indent type is a space
      // or else takes a pattern for non-space indent type
      let step = textModelOptions.insertSpaces ? textModelOptions.indentSize : '\t';
      return [{
        // we send one edit replacing the entire previous value with new formatted value
        // @todo: optimize this and send individual edits
        range: textModel.getFullModelRange(),

        text: vkbeautify.xml(textModel.getValue(), step, true)
      }];
    }
  });
}

/**
 * Updates the theme on monaco
 */
function updateMonacoTheme (theme) {
  monaco.editor.setTheme(THEME_MAP[theme] || MONACO_THEMES.LIGHT);
}

/**
 *
 * @param {*} monaco
 * @param {*} markers
 */
function setModelMarkers (model, markers) {
  let markerData = markers.map((e) => {
    return {
      startLineNumber: e.startLineNumber,
      endLineNumber: e.endLineNumber,
      startColumn: e.startColumn,
      endColumn: e.endColumn,
      message: e.message,
      severity: e.severity || monacoModelMarkerSeverityMap[e.level]
    };
  });
  monaco.editor.setModelMarkers(model, 'postman', markerData);
}

/**
 * Create a map for monaco's editor options
 * @param {*} monaco
 */
function registerMonacoEditorOptions () {

  // List of all editor options and their ids
  // https://microsoft.github.io/monaco-editor/api/enums/monaco.editor.editoroption.html
  monacoEditorOptionsMap = {
    lineHeight: monaco.editor.EditorOption.lineHeight,
    links: monaco.editor.EditorOption.links,
    layoutInfo: monaco.editor.EditorOption.layoutInfo
  };
}

/**
 *
 * @param {*} monaco
 */
function registerModelMarkerSeverity () {
  monacoModelMarkerSeverityMap = {
    [TEXT_EDITOR_VALIDATION_MESSAGE_LEVEL.INFO]: monaco.MarkerSeverity.Info,
    [TEXT_EDITOR_VALIDATION_MESSAGE_LEVEL.WARNING]: monaco.MarkerSeverity.Warning,
    [TEXT_EDITOR_VALIDATION_MESSAGE_LEVEL.ERROR]: monaco.MarkerSeverity.Error
  };
}

/**
 * Function to initialize any global handlers that need to be added for monaco editor. These need
 * to be initialized only once for the monaco object and not for each instance of the editor.
 *
 * @param {Object} monaco - The monaco object. This is used to create instances of the editor.
 */
function initializeGlobalHandlers () {

  createOverflowingWidgetsContainerNode();

  // Register monaco editor options and model marker severity
  registerMonacoEditorOptions();
  registerModelMarkerSeverity();

  // 1. register formatter
  registerXmlFormatter();

  // Themes registration and initialization
  registerThemes(themes);
  initializeTheme();

  monaco.languages.register({ id: 'hexdump' });
  monaco.languages.register({ id: 'hex' });
  monaco.languages.register({ id: 'base64' });

  // Make JSON validate so that it does not try to format invalid JSON
  monaco.languages.postman_json.jsonDefaults.setDiagnosticsOptions({ validate: true });

  //  Config for JS language
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    // Semantic validation are language rules which helps in providing correct context to syntactically correct code.
    // For example, consider the following code
    //     console.log(y);
    //     let y = 5;
    // Syntax wise the code is correct, but the block scoped variable y is being used before it's initialization, which is incorrect.
    noSemanticValidation: true
  });

  // compiler options
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    // JS version to be targeted. Currently the node version shipped with the Postman app supports
    // ES6.
    target: monaco.languages.typescript.ScriptTarget.ES6,

    // This property sets the library type definitions that should
    // be included for this editor. Since we are target node env and don't need
    // reference for DOM Elements hence the lib is kept as ES6.
    // For other available options go to https://www.typescriptlang.org/docs/handbook/compiler-options.html
    //
    // @todo The library mode ES6 doesn't contain complete set of functions and properties
    // available in Node env, the most common being console,setTimeout etc. Hence
    // will need to create a custom node.d.ts type definition file and will be loaded via extraLib api.
    lib: ['ES6'],

    // If the language is set as Javascript, this option should be true. The worker process for JS and
    // TS language is shared which is typescript.worker.js. This settings helps in the parsing and validation
    // of the code snippet when the language is set to JS, otherwise the validations don't work and file not found
    // error is logged in the console
    allowNonTsExtensions: true,

    // This property helps in auto-complete for the APIs of modules that are imported via require call
    allowJs: true
  });

  // This adds a Link Detector to the editor, specifically to the JSON language. The purpose is to try to find
  // any absolute AND relative URLs, making them clickable in the response... but only in PRETTY view mode when
  // JSON is selected. This is related to issue APPSDK-113.
  // NOTE: This currently first looks for ALL absolute paths in the response, then looks for all relative paths
  // which is denoted by a string of text starting with the '/' character. Because of the potential of false
  // positives where by a relative path is PART of an absolute path, a filter is applied to remove any relative
  // paths that are also part of absolute paths. The remainder will be a list of relative links, which is then
  // returned. Each LINK contains the range within the response body where it starts and ends, so that the editor
  // can properly turn it into a link in the response view.
  monaco.languages.registerLinkProvider('json', {
    provideLinks (textModel, token) {
      // The textModel.findMatches() call takes several parameters as detailed in the documentation
      // here: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.itextmodel.html#findmatches
      let absoluteMatches = textModel.findMatches(/https?:\/\/[^\s"'<>]+/g, {}, true, false, null, true);
      let matches = textModel.findMatches(/\/[^\s"'<>]+/g, {}, true, false, null, true);

      matches = matches.filter((match) => {
        return !absoluteMatches.some((absoluteLink) => {
          return monaco.Range.intersectRanges(absoluteLink.range, match.range);
        });
      });

      let links = matches.map(function (match) {
        return {
          range: match.range,
          url: match.matches[0]
        };
      });

      return {
        links: links
      };
    }
  });

  areGlobalOptionsInitialized = true;
}

/**
 * Any handlers that need to be initialized for each instance of the monaco editor. These are initialized
 * when the component is mounted and need to be cleaned up properly when the component is unmounted.
 *
 * NOTE: Any listeners that need to be attached to the instance of the monaco editor needs to be done in
 * this function and should not have any reference to the React component itself.
 * If not cleaned up properly, these can lead to memory leaks
 *
 * @param {Object} editor - Instance of the monaco editor
 *
 * @returns {Function} - A function that can be used to dispose all handlers that have been attached
 */
function initializeInstanceHandlers (editor) {
  if (!editor) {
    return;
  }

  let isLinkEnabled = editor.getOption(monacoEditorOptionsMap.links);

  if (!isLinkEnabled) {
    return;
  }


  /**
   * This is a hack to change the link click behavior on monaco
   *
   * By default monaco only allows links to be opened on cmd + click
   *
   * We override the handlers to allow both single click and cmd + click
   *
   * We also keep track of if the user is trying to select some text within a link by keeping track of
   * the mouse position on a mousedown, and then on a mouseup event, comparing the two to determine if the user
   * is trying to select some of the text (mouse down and up positions are different) or click on the link
   * (mouse down and up positions are the same). This allows the user to select some to all of the link text without
   * opening the link in a new tab so that they may perform a copy operation on the selected text.
   */
  let _linkUrl;

  let LinkDetector = editor.getContribution('editor.linkDetector');

  if (!LinkDetector) {
    return;
  }

  // Override isEnabled to allow link highlight always
  // The default behavior highlights only when a modifier key is pressed
  LinkDetector.isEnabled = () => {
    return true;
  };

  // Override link open function
  // Original method https://github.com/microsoft/vscode/blob/69146d090e1785fe122526a4d74467ece743f38a/src/vs/editor/contrib/links/links.ts#L352-L374
  LinkDetector.openLinkOccurrence = (occurrence) => {
    // occurrence here is the link occurrence that internally has a reference to the link
    // we stub the resolver defined originally below
    // https://github.com/microsoft/vscode/blob/69146d090e1785fe122526a4d74467ece743f38a/src/vs/editor/contrib/links/getLinks.ts#L47-L73
    let url = _.get(occurrence, ['link', '_link', 'url']);

    if (!url) {
      return;
    }

    // url is either unparsed as a string
    // or parsed and hence encoded in the URI class on monaco
    // if the url is unparsed and as a string, keep it as such
    // other wise stringify without encoding
    if (typeof url !== 'string') {
      // if url is not a string, it is an instance of the URI class on monaco
      // the toString method on URI has a parameter that can skip encoding
      // https://github.com/microsoft/vscode/blob/69146d090e1785fe122526a4d74467ece743f38a/src/vs/base/common/uri.ts#L368-L370
      url = url.toString(true);
    }

    // Set clicked on link for use in onMouseUp handler to open link if left mouse button is used.
    _linkUrl = url;
  };

  // override ClickLinkGesture to always allow link click
  import('monaco-editor/esm/vs/editor/contrib/gotoSymbol/link/clickLinkGesture').then(({ ClickLinkGesture }) => {
    // eslint-disable-next-line consistent-this
    let _mouseDownPosition;

    ClickLinkGesture.prototype.onEditorMouseDown = function (mouseEvent) {
      // cache the position on mouse down
      _mouseDownPosition = mouseEvent.target.position;
    };

    // `this` here is ClickLinkGesture
    ClickLinkGesture.prototype.onEditorMouseUp = function (mouseEvent) {
      let lastPosition = _mouseDownPosition,
        currentPosition = mouseEvent.target.position;

      // APPSDK-288 - check to make sure currentPosition and lastPosition are not null, if so, jump out.
      if (!(currentPosition && lastPosition)) {
        return;
      }

      // if the position of the mouse down was different from the position of mouse up
      // this is a click and drag action so do not open the link when this happens
      if (lastPosition.lineNumber !== currentPosition.lineNumber || lastPosition.column !== currentPosition.column) {
        return;
      }

      // always fire link handler on click. Default behavior allows only on modifier key press
      // this here is ClickLinkGesture
      this._onExecute.fire(mouseEvent);
    };
  });

  /**
   * APPSDK-423 (and APPSDK-117) - This handles determining if the right mouse button is clicked
   * or not upon mouse up. It is here to prevent the right mouse button from doing what the left mouse
   * button does.. which is open the link being clicked on into a new tab or external browers. Future edition
   * will update this with an updated context menu with options.
   */
  let mouseUpDisposer = editor.onMouseUp(({ event }) => {
    let mouseButtonClick = event.leftButton ? 'left' : event.middleButton ? 'middle' : event.rightButton ? 'right' : null;
    let lnk = _linkUrl;

    // reset link so it is not used erroneously on subsequent mouse clicks possibly outside of links being
    // clicked on.
    _linkUrl = null;

    if (mouseButtonClick !== 'left' || !lnk) {
      return;
    }

    let _isLinkClickWithModifier = (global.process.platform === 'darwin') ? (event.metaKey && !event.ctrlKey) : (event.ctrlKey && !event.metaKey);

    require('@postman-app-monolith/renderer/js/modules/services/LinkClickService').openLink(lnk, { openInBrowser: _isLinkClickWithModifier });
  });

  return function () {
    mouseUpDisposer && mouseUpDisposer.dispose();
  };
}

/**
 * Wrapper over the monaco editor model to be exposed to consumers
 */
function getTextEditorModel (model, position) {
  return {
    getLineCount: function () {
      return model.getLineCount();
    },
    getLineContent: function (lineNumber) {
      return model.getLineContent(lineNumber);
    },
    getLinesContent: function () {
      return model.getLinesContent();
    },
    getCurrentLine: function () {
      return model.getLineContent(position.lineNumber);
    },
    getValue: function () {
      return model.getValue();
    },
    getWordAtPosition: function (position) {
      return model.getWordAtPosition(position);
    },
    getCurrentWord: function () {
      return model.getWordAtPosition(position);
    },
    getWordBeforePosition: function (positionArg) {
      return model.getWordUntilPosition(positionArg);
    },
    getUri: function () {
      return model.uri;
    },
    deltaDecorations: function (oldDecorations, newDecorations) {
      return model.deltaDecorations(oldDecorations, newDecorations);
    },
    getValueInRange: function (range) {
      return model.getValueInRange(range);
    }
  };
}

export default class TextEditorInternal extends Component {
  constructor (props) {
    super(props);

    this.state = {
      activeView: VIEW_MODES.PRETTY,
      isMounted: false, // whether Monaco is mounted or not
      height: 0, // to resize the parent container of the editor when auto-resize is true
      placeHolderVisible: false
    };

    this.deferredQueue = [];
    this.placeHolderDomNode = null;
    this.decorations = [];
    this.codeCompletionProviderDisposables = {};
    this.definitionProviderDisposables = {};
    this.hoverProviderDisposables = {};

    // Refresh editor function is now being throttled instead of debounce and as throttle makes sure
    // it gets invoked at least once in every 100ms thus minimizing the lag while editor is dragged
    // to resize in two-pane view.
    // APPSDK-930 Creating a new throttled refresh function instead of assigning to the original function
    // as for some use-case(like auto-resize of the editor), we require the raw version of the refresh
    // function to prevent the fluctuations that appear because of throttling behaviour.
    this.throttledRefresh = _.throttle(this.refresh.bind(this), 100, { leading: true, trailing: true });
    this.replaceMonacoModel = this.replaceMonacoModel.bind(this);
    this.handleValueUpdate = this.handleValueUpdate.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.toggleFindWidget = this.toggleFindWidget.bind(this);
    this.handleOpenFindWidget = this.handleOpenFindWidget.bind(this);
    this.handleCloseFindWidget = this.handleCloseFindWidget.bind(this);
    this.handleCopyText = this.handleCopyText.bind(this);
    this.handleViewChange = this.handleViewChange.bind(this);
    this.prettify = this.prettify.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.isTextEditorView = this.isTextEditorView.bind(this);
    this.renderActionBar = this.renderActionBar.bind(this);
    this.wrapWithEditorFeedback = this.wrapWithEditorFeedback.bind(this);
    this.replaceAsPrettyModel = this.replaceAsPrettyModel.bind(this);
    this.getKeyMapHandlers = this.getKeyMapHandlers.bind(this);
    this.focus = this.focus.bind(this);
    this.focusEditor = this.focusEditor.bind(this);
    this.codeCompletionItemProvider = this.codeCompletionItemProvider.bind(this);
    this.definitionProvider = this.definitionProvider.bind(this);
    this.hoverProvider = this.hoverProvider.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.handleRedo = this.handleRedo.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    this.registerInstanceLevelSettings = this.registerInstanceLevelSettings.bind(this);
    this.disposeInstanceSettings = this.disposeInstanceSettings.bind(this);
    this.scrollEventListenerCallback = this.scrollEventListenerCallback.bind(this);
    this.hideParameterHintsWidget = this.hideParameterHintsWidget.bind(this);
  }

  disposeInstanceSettings () {
    this.instanceSettingsDisposerObject && this.instanceSettingsDisposerObject.dispose();
    this.instanceSettingsDisposerObject = null;
  }

  transformSchemas (schemas, uri) {
    let mutatedSchemas = [];

    if (schemas.length > 0) {
      mutatedSchemas = schemas.map((schemaObject) => {
        let mutatedSchemaObject = {};

        /**
         * isReferencedBy -> Is used to check whether the schemas passed is root level or not
         * If the schema is root level then we append fileMatch to the schema object
         * If we assign fileMatch to all the schemas than all of them would start acting as root schemas
         * e.g
         * schemas: [{
                uri: "http://myserver/foo-schema.json", // id of the first schema
                schema: {
                    type: "object",
                    properties: {
                        p2: {
                            $ref: "http://myserver/bar-schema.json" // reference the second schema
                        }
                    }
                },
                isReferencedBy: null
            }, {
                uri: "http://myserver/bar-schema.json", // id of the first schema
                schema: {
                    type: "object",
                    properties: {
                        q1: {
                            enum: ["x1", "x2"]
                        }
                    }
                },
                isReferencedBy: 'http://myserver/foo-schema.json'
            }]
          So if we append fileMatch to second schema also then that makes q1 property available at root level
          whereas it should be inside p2 only
         */
        if (!schemaObject.isReferencedBy) {
          mutatedSchemaObject = {
            ...schemaObject,
            fileMatch: [uri]
          };
        }
        else {
          mutatedSchemaObject = schemaObject;
        }

        delete mutatedSchemaObject.isReferencedBy;

        return mutatedSchemaObject;
      });
    }

    return mutatedSchemas;
  }

  registerInstanceLevelSettings (uri) {
    switch (this.props.language) {
      case 'json':
        this.instanceSettingsDisposerObject = monaco.languages.postman_json.jsonDefaults.setInstanceSettings(uri, {
          ...this.props.settings,
          schemas: this.transformSchemas(_.get(this.props, 'settings.schemas', []), uri)
        });
        break;
      case 'yaml':
        this.instanceSettingsDisposerObject = monaco.languages.yaml.yamlDefaults.setInstanceSettings(uri, {
          ...this.props.settings,
          schemas: this.transformSchemas(_.get(this.props, 'settings.schemas', []), uri)
        });
        break;
      default:
        break;
    }
  }

  componentDidMount () {
    if (!this._node) {
      return;
    }

    // set isMounted to false before importing Monaco.
    // this will add a loading indicator on the UI.
    this.state.isMounted && this.setState({ isMounted: false });


    // Initialize global editor settings. If the global handlers have already been attached once
    // then we do not attach them again.
    !areGlobalOptionsInitialized && initializeGlobalHandlers();

    // create editor and mount it
    this.editor = monaco.editor.create(this._node, this.getMonacoOptions());

    // explicitly setting the indentation of the text model as the editor
    // creation is creating a model with cached value of the editor and not
    // the current value of tabSize or insertSpaces
    this.setIndentation();
    let uri = this.editor.getModel().uri.toString();

    if (this.props.settings) {
      this.registerInstanceLevelSettings(uri);
    }

    this.editorModelChangeDisposable = this.editor.onDidChangeModel((evt) => {
      this.instanceLibsDisposable && this.instanceLibsDisposable.dispose();
      if (evt.newModelUrl === null) {
        return;
      }
      let newUri = evt.newModelUrl.toString();
      this.registerTypeDefinitions(newUri, this.props.language, this.props.typeDefinitionsProvider);

      // explicitly setting the indentation of the text model as the editor
      // creation is creating a model with cached value of the editor and not
      // the current value of tabSize or insertSpaces
      this.setIndentation();
    });

    // Adding listeners for Annotations inside Monaco
    this.props.onSelection && this.editor.onDidChangeCursorSelection(this.props.onSelection);
    this.props.onClickInside && this.editor.onMouseUp(this.props.onClickInside);
    this.props.registerTextEditor && this.props.registerTextEditor(this.editor);

    // Initialize instance handlers. These need to be attached for each instance of the editor
    // Returns a disposer function that can be used to dispose any listeners that have been
    // attached.
    // NOTE: This disposer needs to be called when the component is unmounted so that the
    // listeners are cleaned up and do not lead to memory leaks.
    this.disposeInstanceOptions = initializeInstanceHandlers(this.editor);

    this.registerCodeCompletion(this.props.language, this.props.codeCompletionProviders);
    this.registerTypeDefinitions(uri, this.props.language, this.props.typeDefinitionsProvider);
    this.registerDefinitionProvider(this.props.language, this.props.definitionProviders);
    this.registerHoverProvider(this.props.language, this.props.hoverProviders);

    // We are listening to keydown press on the editor event for key combination of [mod+enter].
    // If the onSubmit fn is provided via props we stop propagation and call the function, otherwise
    // we create a new event from the original event and dispatch it from the monaco's parent container.
    // This combination is a global postman shortcut to send the current request.
    // If the event is not intercepted in that case monaco will run its own shortcut with the similar
    // key combination( the shortcut adds a new line) and the event is not bubbled up too.
    this.editorKeyDownDisposable = this.editor.onKeyDown((event) => {
      if ((event.metaKey || event.ctrlKey) && event.keyCode == monaco.KeyCode.Enter) {
        event.stopPropagation();

        if (this.props.onSubmit) {
          this.props.onSubmit();
        }
        else {
          // Creating a copy of the main event that was raised
          // https://stackoverflow.com/a/20541207
          let newEvent = new event.browserEvent.constructor(event.browserEvent.type, event.browserEvent);

          // Dispatching it from the the parent container of the dom where monaco is attached so that
          // this event is not intercepted by the monaco.
          this.editorContainer && this.editorContainer.dispatchEvent && this.editorContainer.dispatchEvent(newEvent);
        }
      }
    });

    if (this.editor && this.props.onCancel) {
      this.editorCancelDisposable = this.editor.addAction({
        id: 'editor-cancel',
        label: 'escape',
        run: this.props.onCancel,
        keybindings: [
          monaco.KeyCode.Escape
        ]
      });
    }

    // if editor is mounted, set isMounted to true.
    // this will remove the loading indicator on the UI.
    if (this.editor && !this.state.isMounted) {
      this.setState({ isMounted: true });
    }

    /**
     * APPSDK-264. Handling every time a change event happens to the text editor model.
     * This particular handler ONLY provides the information of the exact change. This could be individually typed
     * characters, a paste of text, a deletion, an undo (ctrl-z), etc. It then calls the props onChange handler
     * with the ENTIRE model buffer.
     */
    this.contentChangeListenerDisposable = this.editor.onDidChangeModelContent(() => {
      let value = this.editor.getValue();
      this.props.onChange && this.props.onChange(value);
      this.handlePlaceholder(_.isEmpty(value));
      this.handleSuggestWidget();
    });

    if (this.props.autoResize) {
      this.contentSizeChangeListenerDisposable = this.editor.onDidContentSizeChange((evt) => {
        this.attemptResize(evt);
      });
    }

    // set value & language
    this.handleValueUpdate().then(() => {
      this.handlePlaceholder(_.isEmpty(this.props.value));
      this.executeDeferredActions();
    });

    // initialize editor instance settings
    // @note: if you are attaching any listeners - make sure you clean them up
    this.registerPmEventListeners();


    // 2. Resize Observer
    // APPSDK-67 - replace resize listeners with resizeObserver that refreshes editor. This fixes
    // an issue where certain events that should have redrawn the editor UI, such as opening/closing side bar,
    // having a large request description displayed while changing from single pane to double pane view, and
    // other events that require a re-render.
    //
    // This SINGLE observer handles the following resize events:
    // * Window resize and zoom in and out
    // * Sidebar open/close/resize
    // * Sidebar expand/collapse
    // * Switching tabs, browser/build, etc

    this.resizeObserver = new ResizeObserver((entries) => {
      this.refresh();
      this.resizePlaceholder();
    });

    this.resizeObserver.observe(this._node);

    // QUAL-1423 - We are observing the text editor node via intersection
    // observer. The moment the text editor is no longer visible, we check
    // if parameter hints widget is open or not. If open then we close it.

    // This is being done only for the editable text editors, as the parameters
    // hint widget will not be present for the readonly text-editor.

    if (!this.props.readOnly) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          let isVisible = entry.isIntersecting;

          if (!isVisible) {
            this.hideParameterHintsWidget();
          }
        });
      });

      this.intersectionObserver.observe(this._node);
    }

    // Textmate's registerTokenizer function works by setting a new token provider for a given language.
    // But monaco also comes with an inbuilt token provider for all the languages. As Monaco's default
    // token provider is registered lazily, textmate's token provider is overridden by monaco's
    // default token provider if applied before it (No event is raised when a language's token provider
    // is registered). Hence we register the textmate token provider when the javascript language is
    // requested for the first time.
    if (!isMonacoLanguageRegistrySubscribed) {
      import('monaco-editor/esm/vs/editor/common/modes/languageConfigurationRegistry').then((registry) => {
        let disposable = registry.LanguageConfigurationRegistry.onDidChange((e) => {
          if (e.languageIdentifier.language === 'javascript' && !isMonacoLanguageRegistrySubscribed) {
            isMonacoLanguageRegistrySubscribed = true;
            disposable && disposable.dispose();
            registerTokenizer(monaco, this.editor);
          }
        });
      });

      // Since hex-dump is a newly added language and it does not provide any sort of language configuration,
      // the above `LanguageConfigurationRegistry.onDidChange` is not called for hex-dump. Due to this the tokenizer for
      // the hex-dump will not get registered and the syntax highlighting will not work for the editor with `hex-dump` if
      // we register the tokenizer same as we do for `javascript`. Hence as a workaround we listen to `onLanguage` event
      // which is called once when any editor is instantiated with a given language. In the callback of this event, we
      // perform the task of registering the tokenizer.
      for (const language of ['hexdump', 'hex', 'base64']) {
        let disposable = monaco.languages.onLanguage(language, (e) => {
          if (!isMonacoLanguageRegistrySubscribed) {
            isMonacoLanguageRegistrySubscribed = true;
            disposable && disposable.dispose();
            registerTokenizer(monaco, this.editor);
          }
        });
      }
    }

    // 3. code format listener
    // monaco lazy loads languages
    // which means the very first time we try to format the value
    // languages are not yet registered - so it doesn't take effect
    // to circumvent this, we listen to language registrations and trigger the formatting
    // https://github.com/Microsoft/monaco-editor/issues/115
    import('monaco-editor/esm/vs/editor/common/modes')
      .then(({ DocumentFormattingEditProviderRegistry }) => {
        this.languageRegistryDisposer = DocumentFormattingEditProviderRegistry.onDidChange(() => {
          // Triggering formatting on the model, instead of formatting through
          // @todo: add an API on the editor to perform actions without stealing focus
          this.shouldAutoFormat() && this.state.activeView === VIEW_MODES.PRETTY
            && this.replaceAsPrettyModel(this.editor.getModel());
        });
      });

    // since the overflowing widgets now have fixed property,
    // they are not hidden when a scroll event is triggered in the app
    // Hence we hide these widgets whenever the scroll event is triggered
    window.addEventListener('scroll', this.scrollEventListenerCallback, true);

  }

  componentWillUnmount () {

    // remove scroll listener
    window.removeEventListener('scroll', this.scrollEventListenerCallback, true);

    // dispose monaco editor
    if (this.editor) {
      // Dispose of the content change listener
      this.contentChangeListenerDisposable && this.contentChangeListenerDisposable.dispose();

      // Dispose the content size change listener
      this.contentSizeChangeListenerDisposable && this.contentSizeChangeListenerDisposable.dispose();

      // Dispose the model change listener
      this.editorModelChangeDisposable && this.editorModelChangeDisposable.dispose();

      // Disposing instance level settings
      this.disposeInstanceSettings();

      // IMPORTANT: Monaco editor does not dispose the models on disposing the editor
      // that's why we dispose the model explicitly
      this.editor.getModel() && this.editor.getModel().dispose();

      // Disposing the listeners attached to the instance of monaco editor
      this.disposeInstanceOptions && this.disposeInstanceOptions();

      this.disposeCodeCompletionProviders();
      this.disposeDefinitionProviders();
      this.disposeHoverProviders();
      this.suggestWidgetShowDisposable && this.suggestWidgetShowDisposable.dispose();

      // Disposing the instance libs
      this.instanceLibsDisposable && this.instanceLibsDisposable.dispose();

      // Disposing keydown and custom action handler
      this.editorKeyDownDisposable && this.editorKeyDownDisposable.dispose();
      this.editorCancelDisposable && this.editorCancelDisposable.dispose();

      this.placeHolderDomNode && this.placeHolderDomNode.removeEventListener('click', this.focus);
      this.placeHolderDomNode = null;

      // Disposing the instance of the editor itself
      this.editor.dispose();
    }

    // remove editor specific handlers
    this.unregisterPmEventListeners();

    // Resize Observer and Intersection Observer disconnection
    this.resizeObserver && this.resizeObserver.disconnect();
    this.intersectionObserver && this.intersectionObserver.disconnect();

    // code format listener
    this.languageRegistryDisposer && this.languageRegistryDisposer.dispose();
  }

  componentDidUpdate (prevProps) {
    if (!this.editor) {
      pm.logger.warn('TextEditor~componentDidUpdate - Editor instance not set');
      return;
    }

    if (prevProps.value !== this.props.value) {
      this.handleValueUpdate();
    }

    // if value has not changed and language has changed
    // change the model language
    // if value is changed language change would be handled by it
    else if (prevProps.language !== this.props.language) {
      this.handleLanguageChange();
    }

    if (prevProps.wordWrap !== this.props.wordWrap || prevProps.readOnly !== this.props.readOnly) {
      this.editor.updateOptions(this.getMonacoOptions());
    }

    if (prevProps.validationErrors !== this.props.validationErrors) {
      this.editor && setModelMarkers(this.editor.getModel(), this.props.validationErrors);
    }

    // The previous check for language change is part of if-else.
    // But the code-registration should always run whenever the language is changed.
    if (prevProps.language !== this.props.language) {
      this.registerCodeCompletion(this.props.language, this.props.codeCompletionProviders);
      this.registerDefinitionProvider(this.props.language, this.props.definitionProviders);
      this.registerHoverProvider(this.props.language, this.props.definitionProviders);
      this.disposeInstanceSettings();
    }

    if (!_.isEqual(prevProps.settings, this.props.settings)) {
      this.disposeInstanceSettings();
      this.registerInstanceLevelSettings(this.editor.getModel().uri.toString());
    }

    if (!_.isEqual(this.props.indentation, prevProps.indentation)) {
      this.setIndentation();
    }
  }

  scrollEventListenerCallback (e) {
    if (!this.editor) {
      return;
    }

    let editorDomNode = this.editor.getDomNode();
    if (!editorDomNode) {
      return;
    }

    // A scroll event from the current editor's text area is encountered in the
    // event capturing phase whenever any edit is performed in the current editor
    // Hence we ignore such scroll events
    if (editorDomNode.contains(e.target)) {
      return;
    }

    if (this.editor._contentWidgets) {
      Object.entries(this.editor._contentWidgets).forEach(([key, value]) => {
        if (value && value.widget
          && value.widget.hideWidget && _.isFunction(value.widget.hideWidget)) {
          value.widget.hideWidget();
        }
      });
    }
  }

  executeDeferredActions () {
    while (this.deferredQueue.length) {
      let fn = this.deferredQueue.shift();
      if (typeof (fn) === 'function') {
        fn.apply(this);
      }
    }
  }

  handleSuggestWidget () {

    // APPSDK-972 If any function in the text editor has parameter and a type-def has been defined
    // for it, the parameters widget and suggest widget both are visible and parameter-hint widget
    // is layed over the suggest widget, which prevents the user from seeing the top 2 or 3 options.
    // Hence we hide the parameters-hint widget if the suggest widget is visible.

    if (this.suggestWidgetShowDisposable) {
      return null;
    }
    let suggestWidget = this.editor._contentWidgets['editor.widget.suggestWidget'] &&
      this.editor._contentWidgets['editor.widget.suggestWidget'].widget;
    if (suggestWidget) {
      this.suggestWidgetShowDisposable = suggestWidget.onDidShow((evt) => {
        this.hideParameterHintsWidget();
      });
    }
  }

  hideParameterHintsWidget () {
    let paramterHintsWidget = this.editor._contentWidgets['editor.widget.parameterHintsWidget']
      && this.editor._contentWidgets['editor.widget.parameterHintsWidget'].widget;
    if (paramterHintsWidget && paramterHintsWidget.visible) {
      paramterHintsWidget.cancel && paramterHintsWidget.cancel();
    }
  }

  getQuickSuggestionsConfig () {
    return {
      other: true,
      strings: true,
      comments: false
    };
  }

  getIndentationSettingValue (name) {
    switch (name) {
      case 'editorIndentType':
        let type = this.props.indentation && !_.isNull(this.props.indentation.indentationType) ?
          this.props.indentation.indentationType : getSettingValue(name);
        return type === 'space';
      case 'editorIndentCount':
        return this.props.indentation && !_.isNull(this.props.indentation.indentationSize) ?
          this.props.indentation.indentationSize : getSettingValue(name);
    }
  }

  getMonacoOptions () {
    return {
      // options
      value: this.props.value,
      minimap: { enabled: false },
      readOnly: this.props.readOnly,
      scrollBeyondLastLine: false,
      lineNumbers: (this.state.activeView === VIEW_MODES.PRETTY && !this.props.hideLineNumbers) ? 'on' : 'off',
      wordWrap: (this.state.activeView === VIEW_MODES.PRETTY && this.props.wordWrap === false) ? 'off' : 'on',
      fontFamily: getSettingValue('editorFontFamily'),
      language: getMonacoLanguageName(this.props.language),
      links: this.props.enableLinks ? true : false,

      // config to set allow the auto complete only in string and other areas except comments
      quickSuggestions: (this.props.hideSuggestions) ? false : this.getQuickSuggestionsConfig(),
      scrollbar: {
        vertical: this.props.autoResize || this.props.hideScrollbar === 'both' || this.props.hideScrollbar === 'vertical' ? 'hidden' : 'auto', // this property hides the scrollbar when auto-resize is enabled
        horizontal: this.props.hideScrollbar === 'both' || this.props.hideScrollbar === 'horizontal' ? 'hidden' : 'auto',
        alwaysConsumeMouseWheel: false // when the property is set to false, monaco doesn't consume the mouse scroll events
      },

      // minified text are not force wrapped
      // @todo: disable this word wrap beyond a size
      wordWrapMinified: false,

      // 1. Do not add a wrapping indent in raw view or for markdown editors
      // 2. Indent the wrapped lines for all other languages
      wrappingIndent: this.state.activeView === VIEW_MODES.RAW || getMonacoLanguageName(this.props.language) === 'markdown' ? 'none' : 'indent',
      renderIndentGuides: getMonacoLanguageName(this.props.language) === 'markdown' ? false : true, // hiding the indent lines that are visible when a line is indented
      glyphMargin: this.props.glyphMargin || false,
      folding: !this.props.hideCodeFolding,
      extraEditorClassName: this.props.customEditorClassName ? this.props.customEditorClassName : '', // add custom class to editor
      renderLineHighlight: (this.props.hideCurrentLineHighlight) ? 'none' : 'line', // to control the highlighting of current line
      overviewRulerLanes: this.props.autoResize ? 0 : 3, // this is to hide the right hand size overview view when auto resize is on
      overviewRulerBorder: !this.props.autoResize, // hide the vertical scroll border

      // add's 4 pixels of space to the left margin which when no line numbers and code folding is present
      // gives it a little space from the left border, especially useful if there is a drawn border around the editor
      lineDecorationsWidth: 4,
      fontSize: getSettingValue('responseFontSize'),

      // line-height should not be exposed but calculated from font size.
      // The default line height in monaco is 18px which is 1.5 times the default font size of 12px
      // Hence the factor of 1.5 is being maintained between font size and line height
      lineHeight: 1.5 * getSettingValue('responseFontSize'),
      detectIndentation: false, // setting off the indentation detection
      insertSpaces: this.getIndentationSettingValue('editorIndentType'), // controls the behaviour to use tab or space, when tab key is pressed
      tabSize: this.getIndentationSettingValue('editorIndentCount'),
      autoClosingBrackets: (getSettingValue('editorAutoCloseBrackets') ? 'languageDefined' : 'never'),
      autoClosingQuotes: (getSettingValue('editorAutoCloseQuotes') ? 'languageDefined' : 'never'),
      renderWhitespace: this.props.showNonPrintableCharacters === true ? 'all' : 'none',
      renderControlCharacters: this.props.showNonPrintableCharacters,
      overflowWidgetsDomNode: document.querySelector('#monaco-overflowing-widgets-container'),
      fixedOverflowWidgets: true
    };
  }

  shouldAutoFormat () {

    // Set the autoFormat to true only if the autoFormat props is provided in combination with
    // readOnly. If the consumer tries to auto-format it in edit mode, DO NOT perform the action
    return this.props.readOnly && this.props.autoFormat;
  }

  handleSelectAll (target) {
    if (target && target.closest('.monaco-editor') === this.editor.getDomNode()) {
      this.editor.trigger('Context Menu', 'selectAll');
    }
  }

  handleRedo (target) {
    if (target && target.closest('.monaco-editor') === this.editor.getDomNode()) {
      this.editor.trigger('Context Menu', 'redo');
    }
  }

  handleUndo (target) {
    if (target && target.closest('.monaco-editor') === this.editor.getDomNode()) {
      this.editor.trigger('Context Menu', 'undo');
    }
  }

  /**
     * This function is exposed to external consumers to insert a block of text on the line the cursor is currently on,
     * or the next line if the current line has text on it. It will also preserve the UNDO stack upon insertion.
     *
     * @param textBlock this is the block of text to insert on the line (or next line) the cursor is on
     */
  insertTextBlock (textBlock) {
    let editor = this.editor,
      position = editor.getPosition(),
      model = editor.getModel(),
      lineLen = model.getLineLength(position.lineNumber),
      newLineRequired = lineLen > 0,
      startLineNumber = newLineRequired ? position.lineNumber + 1 : position.lineNumber;

    let eol = model.getEOL();
    let range = {
      startLineNumber: newLineRequired ? position.lineNumber : startLineNumber,
      startColumn: newLineRequired ? lineLen + 1 : 0,
      endLineNumber: newLineRequired ? position.lineNumber : startLineNumber,
      endColumn: newLineRequired ? lineLen + eol.length : 0
    };

    editor.executeEdits('', [
      {
        range: range,
        text: newLineRequired ? eol + textBlock : textBlock,

        // forceMoveMarkers MOVES the cursor to AFTER the insertion point...
        // we do it HERE to ensure the next editor.executeEdits() does NOT start a selection process. Without
        // this one here, but left in the next one down, it starts to select the inserted text.. which would then
        // cause the next keystroke to replace it.
        forceMoveMarkers: true
      }]);

    let newCursorPosition = editor.getPosition(); // get current pos of cursor after text insertion
    let newRange = {
      startLineNumber: range.startLineNumber,
      startColumn: range.startColumn,
      endLineNumber: newCursorPosition.lineNumber,
      endColumn: newCursorPosition.column
    }; // calculate range for the text added

    this.focus();

    editor.setSelection(newRange); // select the inserted text

    // Run format command for the selected text.
    // The command takes care of putting the edit in undo stack
    editor.getAction('editor.action.formatSelection').run();
    editor.setPosition(newCursorPosition); // remove the selection and set the cursor to it's pre-formatted position

  }

  beautifyContent () {
    this.editor.getAction('editor.action.formatDocument').run();
  }

  handleLanguageChange () {
    // When the language is changed
    // get the unformatted value and set + prettify again
    // this is slightly less performant
    // but it is accurate
    // for e.g. if the response viewer is formatted once with a language, it changes
    // the actual content by adding indent and newlines
    // formatting this content might break the syntax of the next language
    // so always use the raw value
    // https://github.com/postmanlabs/postman-app-support/issues/6887
    this.handleValueUpdate();
  }

  /**
   * This function is responsible for adding the completion provider.
   * If the codeCompletionProvider is a function we expect that the current instance of
   * text editor only supports one language code completion, but if codeCompletionProvider is an
   * array multiple code completion providers can be provided, one for each language
   */
  registerCodeCompletion (language, codeCompletionProvider) {

    /**
     * Register the providers to monaco
     * @param {*} monaco
     * @param {*} lang
     * @param {*} provider
     */
    function registerToMonaco (lang, provider) {
      let monacoLanguageName = getMonacoLanguageName(lang);
      if (this.codeCompletionProviderDisposables[monacoLanguageName]) { return; }
      this.codeCompletionProviderDisposables[monacoLanguageName] = monaco.languages.registerCompletionItemProvider(monacoLanguageName, {
        provideCompletionItems: provider
      });
    }

    if (_.isArray(codeCompletionProvider)) {
      codeCompletionProvider.forEach((obj) => {
        if (obj.lang && obj.lang === language && obj.provider) {
          registerToMonaco.call(this, language, this.codeCompletionItemProvider);
        }
        else if (!obj.lang && obj.provider) {
          registerToMonaco.call(this, language, this.codeCompletionItemProvider);
        }
      });
    }
  }

  codeCompletionItemProvider (model, position) {
    if (model.id !== this.editor.getModel().id) {
      return;
    }
    let language = model.getLanguageIdentifier().language;

    let options = [];

    if (_.isArray(this.props.codeCompletionProviders)) {
      this.props.codeCompletionProviders.forEach((obj) => {
        if (obj.lang && getMonacoLanguageName(obj.lang) === language && obj.provider) {
          options = _.concat(options, obj.provider(getTextEditorModel(model, position), position));
        }
        else if (!obj.lang && obj.provider) {
          options = _.concat(options, obj.provider(getTextEditorModel(model, position), position));
        }
      });
    }

    return {
      suggestions: options
    };
  }

  registerTypeDefinitions (uri, language, typeDefinitionsProvider) {
    if (language !== 'javascript' || !_.isFunction(typeDefinitionsProvider)) {
      return;
    }
    let typeDefs = typeDefinitionsProvider();
    let mapped = typeDefs.map((typeDef) => {
      return { filePath: typeDef.id, content: typeDef.content };
    });
    this.instanceLibsDisposable = monaco.languages.typescript.javascriptDefaults.setInstanceLibs(uri, mapped);
  }

  updateTypeDefinitions (uri) {
    this.registerTypeDefinitions(uri, this.props.language, this.props.typeDefinitionsProvider);
  }

  /**
   * This function is responsible for adding the definition provider.
   * @param {Array} definitionProviders
   */
  registerDefinitionProvider (language, definitionProviders) {
    /**
     * Register the providers to monaco
     * @param {*} monaco
     * @param {*} lang
     * @param {*} provider
     */
    function registerToMonaco (lang, provider) {
      let monacoLanguageName = getMonacoLanguageName(lang);

      if (this.definitionProviderDisposables[monacoLanguageName]) { return; }

      this.definitionProviderDisposables[monacoLanguageName] = monaco.languages.registerDefinitionProvider(monacoLanguageName, {
        provideDefinition: provider
      });
    }

    /* We can have different providers for different languages supported by text editor
      eg.
      definitionProviders = [
        { lang: 'json', provider: defProviderForJSON }
        { lang: 'yaml', provider: defProviderForYAML }
      ]

      And we can have same providers for different languages supported by text editor
      eg.
      definitionProviders = [{provider: defProvider1}, {provider: defProvider2}]

      Register providers only for the selected language of text editor
    */
    if (_.isArray(definitionProviders)) {
      definitionProviders.forEach((obj) => {
        if (obj.lang && obj.lang === language && obj.provider) {
          registerToMonaco.call(this, language, this.definitionProvider);
        }
        else if (!obj.lang && obj.provider) {
          registerToMonaco.call(this, language, this.definitionProvider);
        }
      });
    }
  }

  /**
   * A wrapper over the actual definition providers
   * Allows the call to definition providers registered with the currently refererenced model
   * and filters out the rest
   */
  definitionProvider (model, position) {
    if (model.id !== this.editor.getModel().id) {
      return;
    }

    let range = [],
      language = model.getLanguageIdentifier().language;

    /* We can have different providers for different languages supported by text editor
      eg.
      definitionProviders = [
        { lang: 'json', provider: defProviderForJSON }
        { lang: 'yaml', provider: defProviderForYAML }
      ]

      And we can have same providers for different languages supported by text editor
      eg.
      definitionProviders = [{provider: defProvider1}, {provider: defProvider2}]

      Call providers only for the language of model
    */
    if (_.isArray(this.props.definitionProviders)) {
      this.props.definitionProviders.forEach((obj) => {
        if (obj.lang && getMonacoLanguageName(obj.lang) === language && obj.provider) {
          range.push(obj.provider(getTextEditorModel(model, position), position));
        }
        else if (!obj.lang && obj.provider) {
          range.push(obj.provider(getTextEditorModel(model, position), position));
        }
      });
    }

    return range;
  }

  /**
   * This function is responsible for adding the hover provider.
   * @param {Array} hoverProviders
   */
  registerHoverProvider (language, hoverProviders) {
    /**
     * Register the providers to monaco
     * @param {*} monaco
     * @param {*} lang
     * @param {*} provider
     */
    function registerToMonaco (lang, provider) {
      const monacoLanguageName = getMonacoLanguageName(lang);

      if (this.hoverProviderDisposables[monacoLanguageName]) { return; }

      this.hoverProviderDisposables[monacoLanguageName] = monaco.languages.registerHoverProvider(monacoLanguageName, {
        provideHover: provider
      });
    }

    if (_.isArray(hoverProviders)) {
      hoverProviders.forEach((obj) => {
        if (obj.lang && obj.lang === language && obj.provider) {
          registerToMonaco.call(this, language, this.hoverProvider);
        }
        else if (!obj.lang && obj.provider) {
          registerToMonaco.call(this, language, this.hoverProvider);
        }
      });
    }
  }

  /**
   * A wrapper over the actual hover providers
   * Allows the call to hover providers registered with the currently refererenced model
   * and filters out the rest
   */
  hoverProvider (model, position) {
    if (model.id !== this.editor.getModel().id) {
      return;
    }

    let contents = [],
      language = model.getLanguageIdentifier().language;

    if (_.isArray(this.props.hoverProviders)) {
      this.props.hoverProviders.forEach((obj) => {
        if (obj.lang && getMonacoLanguageName(obj.lang) === language && obj.provider) {
          contents = _.concat(contents, (obj.provider(getTextEditorModel(model, position), position)));
        }
        else if (!obj.lang && obj.provider) {
          contents = _.concat(contents, (obj.provider(getTextEditorModel(model, position), position)));
        }
      });
    }

    return { contents: contents };
  }

  /**
   * Feed the react prop `value` into the monaco editor model.
   */
  handleValueUpdate () {
    return Promise.resolve()
      .then(() => {

        // we create a new model and replace the entire model on value change
        // we don't do setValue because we do not need want monaco figure out
        // the conversion from its current value to new value
        // we help monaco by creating a new model and replacing the model

        // create the new model and update it
        // @note: language is set to plaintext for non-pretty views
        let value = this.props.value;
        let currentModel = this.editor.getModel();
        let didLanguageChange = (currentModel.getLanguageIdentifier().language !== getMonacoLanguageName(this.props.language));

        if (!this.props.readOnly && didLanguageChange) {
          monaco.editor.setModelLanguage(currentModel, getMonacoLanguageName(this.props.language));
        }

        // handle transformation in text for pretty view
        if (this.props.readOnly && this.state.activeView === VIEW_MODES.PRETTY) {
          try {
            // transform the text in pretty view for a language
            // This applies any transformations needed to the response,
            // like handling escape sequences.
            let transformResponse = transformResponseForLanguage[getMonacoLanguageName(this.props.language)];

            transformResponse && (value = transformResponse(value));
          }
          catch (e) {
            // could not apply unescape on value, it's okay. show the original value
          }
        }

        /**
         * If the value coming in is the same as the editor model, avoid re-creating the model, which causes a re-render
         * and loses focus of the editor. This may occur because the onChange handler is called AFTER the monaco
         * editor is updated which prior to this, would replace the model and cause the re-render
         * The bailout needs to performed only when the the editor is in edit mode.
         * In readonly mode, when the model language is changed, the props value and editor
         * value are same. If we bailout then new model will not be created with updated language.
         * @todo Refactor the language change flow. It shouldn't be handled in the value update flow
         */
        if (!this.props.readOnly && this.editor && this.editor.getValue() === _.toString(value)) {
          return;
        }

        let model = monaco.editor.createModel(value, this.state.activeView === VIEW_MODES.PRETTY ? getMonacoLanguageName(this.props.language) : LANGUAGE_PLAINTEXT);
        this.setIndentation(model);

        // if active view is pretty mode do not replace the model immediately
        // replacing immediately and then triggering a format would cause a flicker in the UI
        // NOTE: Perform the formatting operation only if the editor is in readonly mode,
        // no formatting action should happen in edit mode without an explicit intent from the user
        if (this.shouldAutoFormat() && this.state.activeView === VIEW_MODES.PRETTY) {
          return this.replaceAsPrettyModel(model);
        }
        else {
          this.replaceMonacoModel(model);
        }
      });
  }

  /**
   * Replaces current active model for monaco with the new one.
   *
   * IMPORTANT: Handles proper disposal of the previous model
   * @param {*} newModel
   */
  replaceMonacoModel (newModel) {

    // Check if the new model that is being added is valid and live and has not been disposed.
    // One instance when the model can be in disposed state when there is delay in
    // loading the format file in Line: 573, and by then the initial handleValueUpdate function
    // was called, which replaced the model in the editor. In that case the newModel received from
    // Line:573 is now disposed and setting it in the editor will throw and error.
    if (newModel.isDisposed()) {
      return;
    }

    let currentModel = this.editor.getModel();

    // do nothing if the previous model is the same as new model
    if (currentModel === newModel) {
      return;
    }

    // cleanup current model
    // disconnect current model from editor
    currentModel && this.editor.setModel(null);

    // dispose the model
    currentModel && currentModel.dispose();

    this.editor.setModel(newModel);
  }

  replaceAsPrettyModel (newModel) {
    // start formatting
    let formatAction = import('monaco-editor/esm/vs/editor/contrib/format/format')
      .then((format) => {
        return this.editor._instantiationService.invokeFunction(format.formatDocumentWithSelectedProvider, newModel, true);
      });

    // start a promise that resolves in 300ms
    // whichever finishes first update the model to editor - triggering a UI update
    // This creates an UI with the following feedback
    // if the response finishes formatting within 300ms the entire
    return Promise.race([
      new Promise(function (resolve) {
        setTimeout(resolve, 300);
      }),
      this.wrapWithEditorFeedback(EDITOR_FEEDBACK_STATES.FORMATTING, formatAction)
    ])
      .then(() => { this.replaceMonacoModel(newModel); });
  }

  initializeEditorSettingsHandlers () {
    this.handlers = {};
    _.forEach(CUSTOMIZABLE_TEXT_EDITOR_SETTINGS, (setting) => {
      let boundedSettingHandler = this.updateEditorOptions.bind(this, setting);
      this.handlers[setting] = boundedSettingHandler;
      pm.settings.on(`setSetting:${setting}`, boundedSettingHandler);
    });
  }

  disposeEditorSettingsHandlers () {
    if (!this.handlers) { return; }
    _.forEach(CUSTOMIZABLE_TEXT_EDITOR_SETTINGS, (setting) => {
      let boundedSettingHandler = this.handlers[setting];
      pm.settings.off(`setSetting:${setting}`, boundedSettingHandler);
      this.handlers[setting] = null;
    });
    this.handlers = null;
  }

  setIndentation (model) {
    model = model || this.editor.getModel();

    if (!model) {
      return;
    }

    let useSpace = this.getIndentationSettingValue('editorIndentType');
    let tabSize = this.getIndentationSettingValue('editorIndentCount');
    model.updateOptions({ insertSpaces: useSpace, tabSize: tabSize });
  }

  updateEditorOptions (settingName) {
    let settingValue = getSettingValue(settingName);
    switch (settingName) {
      case 'editorFontFamily':
        this.editor.updateOptions({ fontFamily: settingValue });
        return;
      case 'responseFontSize':
        this.editor.updateOptions({ fontSize: settingValue, lineHeight: 1.5 * settingValue });
        return;
      case 'editorIndentCount':
      case 'editorIndentType':
        this.setIndentation();
        return;
      case 'editorAutoCloseBrackets':
        this.editor.updateOptions({ autoClosingBrackets: (settingValue ? 'languageDefined' : 'never') });
        return;
      case 'editorAutoCloseQuotes':
        this.editor.updateOptions({ autoClosingQuotes: (settingValue ? 'languageDefined' : 'never') });
        return;
      case 'editorRenderNonPrintable':
        this.editor.updateOptions({ renderWhitespace: settingValue, renderControlCharacters: settingValue });
        return;
      default:
        return;
    }
  }

  registerPmEventListeners () {
    this.initializeEditorSettingsHandlers();
    pm.mediator.on('textEditor:selectAll', this.handleSelectAll);
    pm.mediator.on('textEditor:redo', this.handleRedo);
    pm.mediator.on('textEditor:undo', this.handleUndo);
  }

  unregisterPmEventListeners () {
    this.disposeEditorSettingsHandlers();
    pm.mediator.off('textEditor:selectAll', this.handleSelectAll);
    pm.mediator.off('textEditor:redo', this.handleRedo);
    pm.mediator.off('textEditor:undo', this.handleUndo);
  }

  disposeCodeCompletionProviders () {
    for (let [language, disposer] of Object.entries(this.codeCompletionProviderDisposables)) {
      disposer && disposer.dispose && disposer.dispose();
    }
    this.codeCompletionProviderDisposables = null;
  }

  disposeDefinitionProviders () {
    for (let [language, disposer] of Object.entries(this.definitionProviderDisposables)) {
      disposer && disposer.dispose && disposer.dispose();
    }

    this.definitionProviderDisposables = null;
  }

  disposeHoverProviders () {
    for (let [language, disposer] of Object.entries(this.hoverProviderDisposables)) {
      disposer && disposer.dispose && disposer.dispose();
    }

    this.hoverProviderDisposables = null;
  }

  getCurrentModelLanguage () {
    let model = this.editor.getModel();
    return model && model.getLanguageIdentifier().language;
  }

  attemptResize (evt) {
    if (this.state.height !== evt.contentHeight) {
      this.useRawRefresh = true;
      let height = evt.contentHeight;

      if (this.props.minHeight && typeof this.props.minHeight === 'number') {
        height = Math.max(evt.contentHeight, this.props.minHeight);
      }

      if (this.props.maxHeight && typeof this.props.maxHeight === 'number') {
        height = Math.min(height, this.props.maxHeight);
      }
      this.setState({ height: height });
    }
  }

  handlePlaceholder (isEmpty) {
    if (!this.props.placeholder || !this.editor) {
      return;
    }

    if (!this.placeHolderDomNode) {
      let monacoLinesContainer = this.editor.getDomNode().querySelector('.lines-content');
      if (monacoLinesContainer) {
        monacoLinesContainer.append(this.getPlaceholderSpan());
        let placeHolderDomNode = this.editor.getDomNode().querySelector('.monaco-placeholder');

        // click event listener added to focus the editor when someone clicks on the placeholder
        placeHolderDomNode && placeHolderDomNode.addEventListener('click', this.focus);
        this.placeHolderDomNode = placeHolderDomNode;
      }
    }

    if (isEmpty) {
      if (this.state.placeHolderVisible) {
        return;
      }
      this.showPlaceholder();
    } else {
      this.hidePlaceholder();
    }
  }

  showPlaceholder () {
    this.resizePlaceholder();
    this.placeHolderDomNode.style.display = 'block';
    this.setState({ placeHolderVisible: true });
  }

  hidePlaceholder () {
    this.placeHolderDomNode.style.display = 'none';
    this.setState({ placeHolderVisible: false });
  }

  resizePlaceholder () {
    if (!this.editor || !this.placeHolderDomNode) {
      return;
    }

    // The placeholder is being resized according to the editor's content width.
    // @todo Refactor the placeholder implementation to be in-line with the way monaco
    // handles the rendering of the lines. With the refactoring, the modifications like
    // resizing of the placeholder to fit the content etc need not be performed explicitly
    // and will be handed natively.
    this.placeHolderDomNode.style.width = `${this.editor.getLayoutInfo().contentWidth}px`;
  }

  getPlaceholderSpan () {
    let placeholderSpan = document.createElement('span');
    placeholderSpan.className = 'monaco-placeholder';
    placeholderSpan.style.fontFamily = getSettingValue('editorFontFamily');
    placeholderSpan.style.display = 'none';
    placeholderSpan.innerText = this.props.placeholder;

    return placeholderSpan;
  }

  /**
   * Refreshes the editor size and layout. Use this when you know that the size or layout
   * might have changed from external variables.
   */
  refresh () {

    // Since v0.20.0 the layout function causes the editor to freeze if the editor is not visible.
    // So as workaround we check whether the editor dom is visible or not. If the editor dom is not
    // visible we skip the layout function.
    // Using offsetParent property of the editor DOM node to check the visibility of the same.
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
    if (!this.editor || this.editor.getDomNode().offsetParent === null) {
      return;
    }

    // forces the editor to refresh layout
    this.editor.layout();
  }

  toggleFindWidget () {
    let findWidget = this.editor && this.editor._overlayWidgets['editor.contrib.findWidget'];
    if (findWidget && this.editor._overlayWidgets['editor.contrib.findWidget'].widget._isVisible) {
      this.handleCloseFindWidget();
    }
    else {
      this.handleOpenFindWidget();
    }

  }

  handleOpenFindWidget () {
    this.editor.getAction('actions.findWithSelection').run();
  }

  handleCloseFindWidget () {
    this.editor.trigger('keyboard', 'closeFindWidget');
  }

  handleCopyText () {
    if (window.SDK_PLATFORM === 'browser') {
      // @todo replace the clipboard helper with pm.sdk.Clipboard
      ClipboardHelper.copy(this.editor.getValue());
    } else {
      require('electron').clipboard.writeText(this.editor.getValue());
    }
    pm.toasts.success('Copied to clipboard');
  }

  handleViewChange (selectedView) {
    if (selectedView === this.state.activeView) {
      return;
    }

    // on view change, change the state first
    // the rest of the actions depend on current state, so do it before doing anything else
    this.setState({ activeView: selectedView }, () => {
      // update editor options e.g. wrapping, etc based on active view
      this.editor.updateOptions(this.getMonacoOptions());

      // if mode is a text editor view - and the view has changed
      // always re-render the value
      // that will take care of the value transformation and language/formatting
      if (this.isTextEditorView()) {
        this.handleValueUpdate();
      }
    });
  }

  /**
   * Formats the content of the text editor.
   */
  prettify () {
    this.editor.updateOptions({ readOnly: false });
    let prettyPromise = this.editor.getAction('editor.action.formatDocument').run()
      .then(() => {
        this.editor.updateOptions({ readOnly: true });
      })
      .catch(() => {
        this.editor.updateOptions({ readOnly: true });
      });

    this.wrapWithEditorFeedback(EDITOR_FEEDBACK_STATES.FORMATTING, prettyPromise);
  }

  getEditorStyles () {
    return {
      width: this.props.width || '100%',
      height: this.props.autoResize ? `${this.state.height}px` : this.props.height || '100%'
    };
  }

  getEditorNodeStyles () {
    if (this.state.activeView === VIEW_MODES.PRETTY || this.state.activeView === VIEW_MODES.RAW) {
      return {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: (this.props.autoResize) ? `${this.state.height}px` : (this.props.showActionBar) ? 'calc(100% - 40px)' : '100%'
      };
    }

    return { display: 'none' };
  }

  /**
  * This function allows consumers of TextEditor to force the editor to focus. This may be used in situations where
  * after an event like a change in layout, the editor loses focus where it was previously focused.
  */
  focus () {

    // If a parent component tries to focus the text editor when it is being mounted, in those cases the this.editor
    // is undefined and the editor is not focused after it is mounted. Hence we add this action to a deferred queue
    // and perform the actions in the deferred queue after the mounting is successfully completed.
    if (!this.editor) {
      this.deferredQueue.push(this.focusEditor);
      return;
    }

    this.focusEditor();
  }

  focusEditor () {

    // while switching between tabs in pre-request/tests scripts
    // the focus is not being set back to the editor because at that instance
    // the editor is hidden. Putting it into seTimeout makes sure that the focus function
    // is called after the editor is ready and visible.
    // @todo remove the setTimeout hack with a monaco api which is called
    // when the editor is ready.
    // https://github.com/microsoft/monaco-editor/issues/115
    setTimeout(() => {

      // Using offsetParent property of the editor DOM node to check the visibility of the same.
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
      if (this.editor && this.editor.getDomNode().offsetParent === null) {
        return;
      }
      this.editor && this.editor.focus();
    }, 100);
  }

  handleContextMenu () {
    /*
      Workaround for issue - https://github.com/postmanlabs/postman-app-support/issues/6876
      This was happening because text editor was losing focus when context menu was triggered.
      So, manually focusing editor.

      Monaco editor implements its own context menu and since we don't use it in favour of native
      context menu, we do not include the feature 'contextmenu' in the webpack. The focus handling for
      monaco editor when context menu is triggered is done automatically and is implemented here -
      https://github.com/microsoft/vscode/blob/98b5ee978b2796f996f47b1bf2737bd456af560e/src/vs/editor/contrib/contextmenu/contextmenu.ts#L70.
      This file is excluded since it is part of the 'contextmenu' feature and so we have to focus manually.
    */
    this.focus();

    // https:// bugs.chromium.org/p/chromium/issues/detail?id=686339
    pm.mediator.trigger('textEditor:selectionChange', this.editor.getModel().getValueInRange(this.editor.getSelection()));
  }

  isTextEditorView () {
    return this.state.activeView === VIEW_MODES.PRETTY || this.state.activeView === VIEW_MODES.RAW;
  }

  wrapWithEditorFeedback (feedbackMessage, actionPromise) {
    if (!feedbackMessage || !actionPromise) {
      return;
    }

    let timeoutId = setTimeout(() => {
      isFeedbackOn = true;
      this.setState({
        editorFeedbackMessage: feedbackMessage
      });
    }, 300),
      isFeedbackOn = false;

    return actionPromise
      .then(() => {
        clearTimeout(timeoutId);
        isFeedbackOn && this.setState({ editorFeedbackMessage: '' });
      })
      .catch((e) => {
        clearTimeout(timeoutId);
        isFeedbackOn && this.setState({ editorFeedbackMessage: '' });

        throw e;
      });
  }

  /**
   * @debt Mirroring Ace editor shortcuts to monaco editor to match the current behavior.
   *
   * @todo Move this shortcut into a documented Postman shortcut and give customizability
   */
  getKeyMapHandlers () {
    return {
      handleFoldAll: () => {
        this.editor.getAction('editor.foldAll').run();
      },
      handleUnfoldAll: () => {
        this.editor.getAction('editor.unfoldAll').run();
      },
      handleFoldSelection: () => {
        this.editor.getAction('editor.fold').run();
      },
      handleUnfoldSelection: () => {
        this.editor.getAction('editor.unfold').run();
      },
      handleJumpToMatchingBracket: () => {
        this.editor.getAction('editor.action.jumpToBracket').run();
      },
      handleFormatDocument: () => {
        this.editor.getAction('editor.action.formatDocument').run();
      },
      handleDeleteLine: () => {
        this.editor.getAction('editor.action.deleteLines').run();
      },
      handleDuplicateSelection: () => {
        this.editor.getAction('editor.action.copyLinesDownAction').run();
      },
      handleToUpperCase: () => {
        this.editor.getAction('editor.action.transformToUppercase').run();
      },
      handleToLowerCase: () => {
        this.editor.getAction('editor.action.transformToLowercase').run();
      },
      handleSelectionToBracket: () => {
        this.editor.getAction('editor.action.selectToBracket').run();
      },
      handleToggleComment: () => {
        // The command cmd + / is also the global shortcut for opening the settings modal.
        // Monaco editor doesn't stop the bubbling of the event, because of which when a user
        // tries to toggle comments the settings modal also opens up. Since the toggling of comment
        // is a default behaviour in the monaco editor, we just handle this event via key map handler
        // and prevent the bubbling of this key combination to the top level keymap handler.
        _.noop();
      }
    };
  }

  renderActionBar () {
    let selectedLanguageLabel = _.find(this.props.languages, { key: this.props.language });

    // Defaults to 'Text' IF the language is not provided or not found in the languages prop
    selectedLanguageLabel = selectedLanguageLabel ? selectedLanguageLabel.label : 'Text';

    let isPrettyView = this.state.activeView === VIEW_MODES.PRETTY,
      isReadOnly = this.props.readOnly,
      customTabs = _.map(this.props.customTabs, (value) => {
        if (!(typeof value.name === 'string' && typeof value.renderContent === 'function')) {
          return;
        }

        let nameWithoutSpaces = value.name.toLowerCase().replace(/\s/g, '_'),
          className = `text-editor-tab text-editor-tab--${nameWithoutSpaces}`,
          content;

        if (value.isBeta) {
          content = (
            <span>
              <span>{value.name}</span>
              <span className='tab-beta-label'>BETA</span>
            </span>
          );
        } else {
          content = (<span>{value.name}</span>);
        }

        if (this.props.tabsType === 'dropdown') {
          return (
            <MenuItem
              key={`text-editor-tab-${value.name}`}
              refKey={value.name}
              active={this.state.activeView === value.name}
            >
              {content}
            </MenuItem>
          );
        } else {
          return (
            <Tab key={`text-editor-tab-${value.name}`} refKey={value.name} className={className}>
              {content}
            </Tab>
          );
        }
      });

    return (
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
          {this.props.tabsType === 'dropdown' ?
            <Dropdown className='text-editor-dropdown' onSelect={this.handleViewChange}>
              <DropdownButton type='secondary' size='small'>
                <LegacyButton className='text-editor-dropdown-button__label'>{this.state.activeView}</LegacyButton>
              </DropdownButton>
              <DropdownMenu>
                <MenuItem
                  refKey={VIEW_MODES.PRETTY}
                  active={this.state.activeView === VIEW_MODES.PRETTY}
                >
                  <span>Pretty</span>
                </MenuItem>
                {isReadOnly &&
                  <MenuItem refKey={VIEW_MODES.RAW} active={this.state.activeView === VIEW_MODES.RAW}>
                    <span>Raw</span>
                  </MenuItem>
                }
                {customTabs}
              </DropdownMenu>
            </Dropdown>
            :
            <Tabs
              type='secondary'
              defaultActive={VIEW_MODES.PRETTY}
              activeRef={this.state.activeView}
              onChange={this.handleViewChange}
            >
              <Tab refKey={VIEW_MODES.PRETTY} className='text-editor-tab--pretty'>Pretty</Tab>
              {isReadOnly &&
                <Tab refKey={VIEW_MODES.RAW} className='text-editor-tab--raw'>Raw</Tab>
              }
              {customTabs}
            </Tabs>
          }
          {isPrettyView && this.props.languages &&
            <div>
              <Dropdown
                className='text-editor__language-dropdown'
                onSelect={this.props.onLanguageSelect}
              >
                <DropdownButton type='secondary' size='small'>
                  <LegacyButton><span>{selectedLanguageLabel}</span></LegacyButton>
                </DropdownButton>
                <DropdownMenu fluid>
                  {
                    _.map(this.props.languages, (langauge) => {
                      return <MenuItem refKey={langauge.key} key={langauge.key}><span>{langauge.label}</span></MenuItem>;
                    })
                  }
                </DropdownMenu>
              </Dropdown>
            </div>
          }
          {isPrettyView && isReadOnly &&
            <div>
              <Button
                type='tertiary'
                icon='icon-action-wrap-stroke'
                className={`text-editor__line-wrap-button ${this.props.wordWrap !== false && 'is-active'}`}
                onClick={this.props.onWordWrapClick}
              />
            </div>
          }
          <div className='text-editor__feedback-text'><span>{this.state.editorFeedbackMessage}</span></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
          {this.isTextEditorView() &&
            <div>
              <Button
                type='tertiary'
                icon='icon-action-copy-stroke'
                className='text-editor__copy-button'
                onClick={this.handleCopyText}
              />
              <Button
                type='tertiary'
                icon='icon-action-search-stroke'
                className='text-editor__search-button'
                onClick={this.handleOpenFindWidget}
              />
            </div>
          }
        </div>
      </div>
    );
  }

  renderCustomView () {
    let customTabContent = null;

    _.forEach(this.props.customTabs, (value) => {
      if (!(typeof value.name === 'string' && typeof value.renderContent === 'function')) {
        return;
      }

      if (this.state.activeView === value.name) {
        customTabContent = value.renderContent();
      }
    });

    return customTabContent;
  }

  render () {
    return (
      <div className='text-editor' style={this.getEditorStyles()} ref={(ref) => this.editorContainer = ref} >
        {this.props.showActionBar && this.renderActionBar()}
        <KeyMaps
          handlers={this.getKeyMapHandlers()}
          keyMap={getKeyMaps()}
        >
          <div ref={(node) => this._node = node} style={this.getEditorNodeStyles()} onContextMenu={this.handleContextMenu} />
        </KeyMaps>
        {!this.props.hideActionBar && this.renderCustomView()}
        {

          // Show loading state while Monaco is being mounted
          !this.state.isMounted &&
          <LoadingIndicator className='text-editor__loading-indicator' />
        }
      </div>
    );
  }
}
