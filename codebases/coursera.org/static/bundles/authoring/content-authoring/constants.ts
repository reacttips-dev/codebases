import { SlateNode, SlateBlock, SlateChange, SlateNormalizeError, SlateSchema } from './types';

const BLOCK_TYPES = {
  PARAGRAPH: 'paragraph',
  HEADING: 'heading',
  LINK: 'link',
  BULLET_LIST: 'bullet-list',
  NUMBER_LIST: 'number-list',
  LIST_ITEM: 'list-item',
  IMAGE: 'image',
  ASSET: 'asset',
  CODE: 'code',
  TABLE: 'table',
  TABLE_ROW: 'table-row',
  TABLE_CELL: 'table-cell',
  TEXT: 'text',
  PLACEHOLDER: 'placeholder',
  LOADER: 'loader',
  PERSONALIZATION_TAG: 'ptag',
} as const;

const MARKS = {
  BOLD: 'bold',
  ITALIC: 'italic',
  UNDERLINE: 'underline',
  VARIABLE: 'variable',
} as const;

const {
  PARAGRAPH,
  HEADING,
  LINK,
  BULLET_LIST,
  NUMBER_LIST,
  LIST_ITEM,
  IMAGE,
  ASSET,
  CODE,
  TABLE,
  TABLE_CELL,
  PLACEHOLDER,
  LOADER,
  PERSONALIZATION_TAG,
} = BLOCK_TYPES;

const TOP_LEVEL_BLOCK_TYPES = [
  PARAGRAPH,
  HEADING,
  LINK,
  BULLET_LIST,
  NUMBER_LIST,
  TABLE,
  IMAGE,
  ASSET,
  CODE,
  PLACEHOLDER,
  LOADER,
] as const;

const TABLE_CELL_SCHEMA = {
  nodes: [
    {
      match: { type: PARAGRAPH },
      max: 1, // PARTNER-18293: only allow 1 `PARAGRAPH` inside a TABLE_CELL
    },
  ],
  normalize: (change: SlateChange, error: SlateNormalizeError) => {
    // merge any additional `PARAGRAPH`s inside TABLE_CELL into the first sibling `PARAGRAPH`
    if (error.code === 'child_unknown' && error.child?.type === PARAGRAPH) {
      return change.mergeNodeByKey(error.child.key, {});
    }

    return change;
  },
};

// sample test jsfiddle https://jsfiddle.net/k6Lm9zor/
const LIST_SCHEMA = {
  nodes: [
    {
      // Only allows LIST_ITEM child nodes, in order to normalize any invalid markup pasted from external sources
      // https://docs.slatejs.org/guides/schemas#basic-schemas
      match: { type: LIST_ITEM },
    },
  ],
  normalize: (change: SlateChange, error: SlateNormalizeError) => {
    if (
      error.code === 'child_type_invalid' &&
      error.child?.nodes &&
      (error.child.type === BULLET_LIST || error.child.type === NUMBER_LIST)
    ) {
      /* flatten nested lists as top-level LIST_ITEM node
       * for example,
       * <ul>
       *   <li> this is a valid LI </li>
       *   <ul>  <---- this will be removed and children <li> will be appended into the parent list
       *     <li> nested 1 </li>
       *     <li> nested 2 </li>
       *   </ul>
       * </ul>
       */
      const parentList = change.value.document.getParent(error.child.key) as SlateBlock;
      let index = parentList.nodes.findIndex((node) => node.key === error.child?.key);

      // insert child <li> into the parent list
      error.child.nodes.forEach((n: SlateNode) => {
        // move node into parent and skip normalization temporarily
        // @ts-ignore 4th param is required but not typed in @types/slate
        change.moveNodeByKey(n.key, parentList.key, index, { normalize: false });
        index += 1;
      });

      // remove the invalid nested list parent, which is empty anyway now
      return change.removeNodeByKey(error.child.key);
    }

    return change;
  },
};

const EDITOR_SCHEMA: SlateSchema = {
  document: {
    nodes: [
      {
        // only allows certain block types as top-level blocks. e.g. a LIST_ITEM cannot be top-level outside of a BULLET_LIST
        match: TOP_LEVEL_BLOCK_TYPES.map((blockType) => ({ type: blockType })),
      },
    ],
    normalize: (change: SlateChange, error: SlateNormalizeError) => {
      if (error.code === 'child_type_invalid' && error.child) {
        // normalize invalid top-level blocks as PARAGRAPH nodes
        return change.setNodeByKey(error.child.key, { type: PARAGRAPH });
      }

      return change;
    },
  },
  blocks: {
    [IMAGE]: {
      isVoid: true, // https://docs.slatejs.org/slate-core/schema#isvoid
    },
    [LOADER]: {
      isVoid: true,
    },
    [ASSET]: {
      isVoid: true,
    },
    [CODE]: {
      isVoid: true,
    },
    // @ts-expect-error we need to ugrade Slate to a newer version to fix this
    [BULLET_LIST]: LIST_SCHEMA,
    // @ts-expect-error we need to ugrade Slate to a newer version to fix this
    [NUMBER_LIST]: LIST_SCHEMA,
    // @ts-expect-error we need to ugrade Slate to a newer version to fix this
    [TABLE_CELL]: TABLE_CELL_SCHEMA,
  },
  inlines: {
    [PERSONALIZATION_TAG]: {
      isVoid: true, // required to allow for the entire inline to be deleted with 1 backspace
    },
  },
};

const exported = {
  // mark type from slate
  MARKS,

  // map cml tagname to MARKS above
  CML_MARKS: {
    strong: 'BOLD',
    em: 'ITALIC',
    u: 'UNDERLINE',
    var: 'VARIABLE',
  } as const,

  MARKS_TO_CML: {
    bold: 'strong',
    italic: 'em',
    underline: 'u',
    variable: 'var',
  } as const,

  NEWLINES_REGEX: /(\r\n\t|\n|\r\t)/g,
  BLOCK_TYPES,

  // the toolbar button to be disabled when one of the list of block types is in the current selection
  DISABLED_TYPES: {
    [HEADING]: [IMAGE, BULLET_LIST, NUMBER_LIST, TABLE_CELL, ASSET, CODE],
    [MARKS.BOLD]: [IMAGE, ASSET, CODE, MARKS.VARIABLE],
    [MARKS.ITALIC]: [IMAGE, ASSET, CODE, MARKS.VARIABLE],
    [MARKS.UNDERLINE]: [IMAGE, ASSET, CODE, MARKS.VARIABLE],
    [MARKS.VARIABLE]: [IMAGE, ASSET, CODE, MARKS.BOLD, MARKS.ITALIC, MARKS.UNDERLINE, LINK],
    [LINK]: [IMAGE, ASSET, CODE, PERSONALIZATION_TAG, MARKS.VARIABLE],
    [BULLET_LIST]: [IMAGE, TABLE_CELL, HEADING, ASSET, CODE],
    [NUMBER_LIST]: [IMAGE, TABLE_CELL, HEADING, ASSET, CODE],
    [TABLE]: [IMAGE, BULLET_LIST, NUMBER_LIST, LIST_ITEM, HEADING, ASSET, TABLE, CODE],
    [IMAGE]: [HEADING, LINK, BULLET_LIST, NUMBER_LIST, TABLE, ASSET, CODE],
    [ASSET]: [HEADING, LINK, BULLET_LIST, NUMBER_LIST, TABLE_CELL, IMAGE, CODE],
    [CODE]: [HEADING, LINK, BULLET_LIST, NUMBER_LIST, TABLE, ASSET, IMAGE, TABLE, TABLE_CELL],
  },
};

export default exported;
export { MARKS, BLOCK_TYPES, EDITOR_SCHEMA };

export const { CML_MARKS, MARKS_TO_CML, NEWLINES_REGEX, DISABLED_TYPES } = exported;
