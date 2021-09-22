import React from 'react';
import Tex from 'bundles/phoenix/components/Tex';
import CMLParser from 'bundles/cml/models/CMLParser';
import { CmlContent } from 'bundles/cml/types/Content';

type Props = {
  cml: CmlContent;
};

/**
 * CMLText
 * Renders inner text of a given CML object
 */
const CMLText: React.FunctionComponent<Props> = ({ cml }) => {
  const parser = new CMLParser(cml.definition.value);

  return (
    <div className="rc-CMLText">
      <Tex>{CMLParser.getInnerText(parser.getRoot())}</Tex>
    </div>
  );
};

export default CMLText;
