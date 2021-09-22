import type Monaco from 'monaco-editor';

import ScalaHighlightRules from 'bundles/code-evaluator/utils/language-definitions/scala';
import HaskellHighlightRules from 'bundles/code-evaluator/utils/language-definitions/haskell';
import OCamlHighlightRules from 'bundles/code-evaluator/utils/language-definitions/oCaml';
import MatlabHighlightRules from 'bundles/code-evaluator/utils/language-definitions/matlab';
import PrologHighlightRules from 'bundles/code-evaluator/utils/language-definitions/prolog';
import LaTexHighlightRules from 'bundles/code-evaluator/utils/language-definitions/laTex';
import VhdlHighlightRules from 'bundles/code-evaluator/utils/language-definitions/vhdl';

export const tokenizedLanguages = {
  scala: {
    id: 'scala',
    tokensProvider: ScalaHighlightRules,
  },
  ocaml: {
    id: 'ocaml',
    tokensProvider: OCamlHighlightRules,
  },
  latex: {
    id: 'latex',
    tokensProvider: LaTexHighlightRules,
  },
  matlab: {
    id: 'matlab',
    tokensProvider: MatlabHighlightRules,
  },
  haskell: {
    id: 'haskell',
    tokensProvider: HaskellHighlightRules,
  },
  vhdl: {
    id: 'vhdl',
    tokensProvider: VhdlHighlightRules,
  },
  prolog: {
    id: 'prolog',
    tokensProvider: PrologHighlightRules,
  },
} as const;

export const registerLanguage = (monaco: typeof Monaco, language: keyof typeof tokenizedLanguages) => {
  const tokenizedLanguage = tokenizedLanguages[language];
  const { id, tokensProvider } = tokenizedLanguage;
  monaco.languages.register({ id });
  monaco.languages.setMonarchTokensProvider(id, tokensProvider as Monaco.languages.IMonarchLanguage);
};
