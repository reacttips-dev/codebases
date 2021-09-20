import React from 'react';

import {
  PowerUpAttachmentSectionSuggestion,
  PowerUpAttachmentSectionSuggestionProps,
} from './PowerUpAttachmentSectionSuggestion';

interface PowerUpSuggestionContainerProps {
  suggestionProps: [PowerUpAttachmentSectionSuggestionProps];
}

export const PowerUpSuggestionContainer: React.FunctionComponent<PowerUpSuggestionContainerProps> = ({
  suggestionProps,
}) => {
  return (
    <React.Fragment>
      {suggestionProps.map((props) => {
        return (
          <PowerUpAttachmentSectionSuggestion key={props.name} {...props} />
        );
      })}
    </React.Fragment>
  );
};
