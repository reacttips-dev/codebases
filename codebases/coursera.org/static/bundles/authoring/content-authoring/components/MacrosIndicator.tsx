import React from 'react';
import { color } from '@coursera/coursera-ui';
import _t from 'i18n!nls/authoring';

type Props = {
  macros: Array<string>;
  cml: string;
};

// renders a pill indicator for each macro from bundles/cml/constants/CMLVariableNames.js
// found in the editor's current cml
const MacrosIndicator: React.FunctionComponent<Props> = ({ macros = [], cml = '' }) => {
  const detectedMacros = macros.filter((macro) => cml.includes('%' + macro + '%'));

  return detectedMacros.length > 0 ? (
    <div
      style={{
        background: color.bgPaper,
        position: 'absolute',
        top: 2,
        right: 2,
        padding: 4,
      }}
    >
      <span className="font-sm">{_t('Variable(s) confirmed:')}</span>
      {detectedMacros.map((macro) => (
        <div className="pill-success" key={macro}>
          {macro}
        </div>
      ))}
    </div>
  ) : null;
};

export default MacrosIndicator;
