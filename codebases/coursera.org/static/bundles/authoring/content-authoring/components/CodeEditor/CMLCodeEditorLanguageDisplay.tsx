import React from 'react';
import { codeLanguages, LanguageType } from 'bundles/cml/constants/codeLanguages';
import _t from 'i18n!nls/authoring';

type Props = {
  languageValue: LanguageType;
};

class CMLCodeEditorLanguageDisplay extends React.Component<Props> {
  render() {
    const { languageValue } = this.props;
    const language = codeLanguages.find((codeLanguage) => codeLanguage.value === languageValue);
    const languageName = language ? language.name : _t('Generic code block');

    return (
      <div className="rc-CMLCodeEditorLanguageDisplay">
        {'< / >'} &nbsp; {languageName}
      </div>
    );
  }
}

export default CMLCodeEditorLanguageDisplay;
