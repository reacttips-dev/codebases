/* eslint-disable react/no-danger */
import React from 'react';
import CML from 'bundles/cml/components/CML';
import type { CmlContent } from 'bundles/cml/types/Content';
import type { Content } from 'bundles/compound-assessments/components/api/types/CompoundAssessmentsForm';
import type { CMLOrHTMLContent } from 'bundles/compound-assessments/types/FormParts';

type Props = {
  value: string | CmlContent | Content | CMLOrHTMLContent | undefined;
  assumeStringIsHtml?: boolean;
  isControlled?: boolean;
  className?: string;
  display?: 'inline-block' | undefined;
};

/**
 * Use this component to render CML/HTML/Text
 */
const CMLOrHTML: React.FunctionComponent<Props> = ({
  value,
  assumeStringIsHtml = true,
  isControlled,
  className,
  display,
}): React.ReactElement<'div' | 'span'> | null => {
  const rest = {
    isControlled,
    className,
    display,
  };

  if (!value) {
    return null;
  }

  if (typeof value === 'object') {
    if (value.typeName === 'cml' || value.typeName === 'cmlContent') {
      return <CML cml={value as CmlContent} {...rest} />;
    } else if (value.typeName === 'htmlText') {
      return <span {...rest} dangerouslySetInnerHTML={{ __html: value.definition.content }} />;
    } else if (value.typeName === 'htmlContent') {
      return <span {...rest} dangerouslySetInnerHTML={{ __html: value.definition.html }} />;
    }
  } else if (assumeStringIsHtml) {
    return <span {...rest} dangerouslySetInnerHTML={{ __html: value }} />;
  } else {
    return <span {...rest}>{value}</span>;
  }

  return null;
};

export default CMLOrHTML;
