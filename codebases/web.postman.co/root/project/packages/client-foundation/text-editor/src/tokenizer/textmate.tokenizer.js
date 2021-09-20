// Examples of how to implement vscode-textmate and oniguruma lib for syntax highlighting
// https://github.com/microsoft/vscode-textmate/blob/master/README.md
// https://github.com/microsoft/vscode-textmate/blob/master/benchmark/benchmark.js
// https://github.com/microsoft/vscode/blob/master/src/vs/workbench/services/textMate/browser/abstractTextMateService.ts#L230

var textmate = require('vscode-textmate');
import typescriptGrammar from 'raw-loader!./grammar/Typescript.tmLanguage';
import hexGrammar from 'raw-loader!./grammar/Hex.tmLanguage';
import base64Grammar from 'raw-loader!./grammar/Base64.tmLanguage';

// Refer: https://github.com/stef-levesque/vscode-hexdump/blob/master/syntaxes/hexdump.tmLanguage
import hexdumpGrammar from 'raw-loader!./grammar/Hexdump.tmLanguage';

let vscodeOnigurumaLib = null;

/**
 * Registers oniguruma wasm library with vscode-oniguruma lib
 */
async function getVSCodeOniguruma () {
  if (!vscodeOnigurumaLib) {
    let vscodeOnigurumaModule = require('vscode-oniguruma');
    const wasmBin = (window.SDK_PLATFORM === 'browser') ? await fetch(self.postman_static_assets_url + '/onig.wasm') : await fetch('../js/onig.wasm');
    vscodeOnigurumaLib = vscodeOnigurumaModule.loadWASM(wasmBin).then((_) => {
      return {
        createOnigScanner (patterns) { return new vscodeOnigurumaModule.OnigScanner(patterns); },
        createOnigString (s) { return new vscodeOnigurumaModule.OnigString(s); }
      };
    });
  }
  return vscodeOnigurumaLib;
}

/**
 * Parses tmGrammar and loads for a particular language
 * @param {*} scopeName
 */
function loadGrammar (scopeName) {
  let grammarPath = null;
  let grammar = null;
  switch (scopeName) {
    case 'source.tsx':
      grammarPath = 'typescript';
      grammar = typescriptGrammar;
      break;
    case 'source.hexdump':
      grammarPath = 'hexdump';
      grammar = hexdumpGrammar;
      break;
    case 'source.hex':
      grammarPath = 'hex';
      grammar = hexGrammar;
      break;
    case 'source.base64':
      grammarPath = 'base64';
      grammar = base64Grammar;
      break;
    default:
      return null;
  }
  return Promise.resolve(textmate.parseRawGrammar(grammar, grammarPath));
}

/**
 * https://github.com/NeekSandhu/monaco-editor-textmate/blob/master/src/tm-to-monaco-token.ts
 * @param {*} editor
 * @param {*} scopes
 */
function textmateToMonacoToken (editor, scopes) {
  let scopeName = '';

  // get the scope name. Example: cpp , java, haskell
  for (let i = scopes[0].length - 1; i >= 0; i -= 1) {
    const char = scopes[0][i];
    if (char === '.') {
      break;
    }
    scopeName = char + scopeName;
  }

  // iterate through all scopes from last to first
  for (let i = scopes.length - 1; i >= 0; i -= 1) {
    const scope = scopes[i];

    /**
     * Try all possible tokens from high specific token to low specific token
     *
     * Example:
     * 0 meta.function.definition.parameters.cpp
     * 1 meta.function.definition.parameters
     *
     * 2 meta.function.definition.cpp
     * 3 meta.function.definition
     *
     * 4 meta.function.cpp
     * 5 meta.function
     *
     * 6 meta.cpp
     * 7 meta
     */
    for (let i = scope.length - 1; i >= 0; i -= 1) {
      const char = scope[i];
      let editorTheme = editor && editor['_themeService'] && editor['_themeService'].getTheme();
      if (char === '.') {
        const token = scope.slice(0, i);
        if (editorTheme && editorTheme._tokenTheme._match(token + '.' + scopeName)._foreground > 1) {
          return token + '.' + scopeName;
        }
        if (editorTheme && editorTheme._tokenTheme._match(token)._foreground > 1) {
          return token;
        }
      }
    }
  }

  return '';
}

class TokenizerState {
  constructor (_ruleStack) {
    this._ruleStack = _ruleStack;
  }

  get ruleStack () {
    return this._ruleStack;
  }

  clone () {
    return new TokenizerState(this._ruleStack);
  }

  equals (other) {
    if (
      !other ||
      !(other instanceof TokenizerState) ||
      other !== this ||
      other._ruleStack !== this._ruleStack
    ) {
      return false;
    }
    return true;
  }
}

/**
 *
 * @param {*} monaco
 */
export default async function registerTokenizer (monaco, editor) {
  var Registry = textmate.Registry;
  var onigasmRegistry = new Registry({ loadGrammar, onigLib: getVSCodeOniguruma() });

  let scopes = new Map();
  scopes.set('javascript', 'source.tsx');
  scopes.set('hexdump', 'source.hexdump');
  scopes.set('hex', 'source.hex');
  scopes.set('base64', 'source.base64');

  Array.from(scopes.keys()).map(async (languageId) => {
    let onigasmGrammar = await onigasmRegistry.loadGrammar(scopes.get(languageId));
    monaco.languages.setTokensProvider(languageId, {
      getInitialState: () => new TokenizerState(textmate.INITIAL),
      tokenize: (line, state) => {
        // Prevent tokenization of lines with length greater than 20K
        if (line.length > 20000) {
          line = '';
        }
        const res = onigasmGrammar.tokenizeLine(line, state.ruleStack);
        return {
          endState: new TokenizerState(res.ruleStack),
          tokens: res.tokens.map((token) => ({
            ...token,

            // At the moment, monaco-editor doesn't seem to accept array of scopes
            scopes: editor ? textmateToMonacoToken(editor, token.scopes) : token.scopes[token.scopes.length - 1]
          }))
        };
      }
    });
  });
}
