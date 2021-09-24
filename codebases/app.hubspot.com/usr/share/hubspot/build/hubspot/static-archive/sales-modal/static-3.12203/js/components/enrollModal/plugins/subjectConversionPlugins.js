'use es6';

import { compose } from 'draft-extend';
import SubjectBlock from 'SalesTemplateEditor/plugins/SubjectBlock';
import arrowKeysOnly from 'SalesTemplateEditor/plugins/arrowKeysOnly';
import DisableImmutableEntityInput from 'SalesTemplateEditor/plugins/DisableImmutableEntityInput';
import MissingMergeTagPlugin from './MissingMergeTagPlugin';
export default function getSubjectConversionPlugins() {
  return compose(DisableImmutableEntityInput(), SubjectBlock, arrowKeysOnly, MissingMergeTagPlugin());
}