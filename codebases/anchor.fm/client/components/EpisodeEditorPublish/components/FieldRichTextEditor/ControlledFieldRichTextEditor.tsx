import React from 'react';
import { FieldController } from 'shared/FieldController';
import {
  ControlledFieldRichTextEditorProps,
  FieldRichTextEditorProps,
} from './types';
import { FieldRichTextEditor } from '.';

export const ControlledFieldRichTextEditor = (
  props: ControlledFieldRichTextEditorProps
) => (
  <FieldController<FieldRichTextEditorProps, HTMLTextAreaElement>
    as={FieldRichTextEditor}
    {...props}
  />
);
