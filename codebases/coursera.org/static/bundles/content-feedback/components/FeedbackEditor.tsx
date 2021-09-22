import React from 'react';
import type { CmlContent } from 'bundles/cml/types/Content';
import CMLEditorV2 from 'bundles/authoring/content-authoring/components/CMLEditorV2';
import 'css!./__styles__/FeedbackEditor';

type Props = {
  cml: CmlContent | null | undefined;
  placeholder: string;
  onChange: (cml: CmlContent) => void;
  isFocused: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
};

export default function FeedbackEditor({ cml, placeholder, onChange, isFocused, ariaLabel, ariaDescribedBy }: Props) {
  return (
    <div className="rc-FeedbackEditor">
      <CMLEditorV2
        initialCML={cml || undefined}
        onContentChange={onChange}
        focusOnLoad={isFocused}
        placeholder={placeholder}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
        customTools={[]}
      />
    </div>
  );
}
